import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  subscribePurchases,
  addPurchase,
  type Purchase,
} from '../services/userHistory';
import Header from '../components/Header';
import {
  PatientsPage,
  MedicationsPage,
  HistoryPage,
} from '../components/pages';
import { db } from '../firebase';
import {
  collection,
  setDoc,
  onSnapshot,
  updateDoc,
  addDoc,
  deleteDoc,
  doc,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { PatientMedication } from '../services/userMeds';
import {
  Medication,
  Patient,
  AggregatedMedication,
  Page,
  WarningLevel,
} from '@/types';

const MedicationSystem = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<Page>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      collection(db, `users/${user.uid}/patients`),
      snapshot => {
        const loadedPatients: Patient[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Patient, 'id'>),
        }));
        setPatients(loadedPatients);
      }
    );

    return () => unsub();
  }, [user]);

  const [newPatientName, setNewPatientName] = useState<string>('');
  const [newMedication, setNewMedication] = useState<string>('');
  const [newMedicationPills, setNewMedicationPills] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [medsFS, setMedsFS] = useState<Medication[]>([]);
  const [patientsFS] = useState<Patient[]>([]);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [editing, setEditing] = useState<Purchase | null>(null);
  const [, setLoadingPurchases] = useState(false);
  const [editBuff, setEditBuff] = useState<{ quantity: number; notes: string }>(
    {
      quantity: 0,
      notes: '',
    }
  );

  const [savingEdit, setSavingEdit] = useState(false);

  const [assignByPatient, setAssignByPatient] = useState<
    Record<string, Record<string, PatientMedication>>
  >({});

  const [buyQty, setBuyQty] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast({ open: true, message: msg });
    setTimeout(() => setToast({ open: false, message: '' }), 2000);
  };

  useEffect(() => {
    if (!user) return;

    const unsubs: Array<() => void> = [];

    const unsubPatients = onSnapshot(
      collection(db, `users/${user.uid}/patients`),
      snap => {
        unsubs.forEach(u => u());
        unsubs.length = 0;

        snap.docs.forEach(pDoc => {
          const pid = pDoc.id;
          const subUnsub = onSnapshot(
            collection(db, `users/${user.uid}/patients/${pid}/medications`),
            medSnap => {
              const inner: Record<string, PatientMedication> = {};
              medSnap.docs.forEach(mDoc => {
                inner[mDoc.id] = {
                  medicationId: mDoc.id,
                  ...(mDoc.data() as Omit<PatientMedication, 'medicationId'>),
                };
              });
              setAssignByPatient(prev => ({ ...prev, [pid]: inner }));
            }
          );
          unsubs.push(subUnsub);
        });
      }
    );

    return () => {
      unsubPatients();
      unsubs.forEach(u => u());
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, `users/${user.uid}/medications`),
      snapshot => {
        const medications: Medication[] = snapshot.docs.map(d => {
          const data = d.data() as Omit<Medication, 'id'>;
          return {
            id: d.id,
            ...data,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            patientIds: Array.isArray((data as any).patientIds)
              ? data.patientIds
              : [],
          };
        });
        setMedsFS(medications);
      }
    );
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    setLoadingPurchases(true);
    const unsub = subscribePurchases(user.uid, items => {
      setPurchases(items);
      setLoadingPurchases(false);
    });
    return unsub;
  }, [user]);

  const patientNameById = useMemo(() => {
    return patientsFS.reduce(
      (acc, patient) => {
        acc[patient.id] = patient.name;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [patientsFS]);

  const medsByPatient = useMemo((): Record<string, PatientMedication[]> => {
    const result: Record<string, PatientMedication[]> = {};
    for (const pid of Object.keys(assignByPatient)) {
      const assigns = assignByPatient[pid];
      result[pid] = Object.values(assigns)
        .map(assign => {
          const master = medsFS.find(m => m.id === assign.medicationId);
          if (!master) return null;
          return {
            ...master,
            medicationId: assign.medicationId,
            morning: !!assign.morning,
            afternoon: !!assign.afternoon,
            evening: !!assign.evening,
          } as PatientMedication;
        })
        .filter(Boolean) as PatientMedication[];
    }
    return result;
  }, [assignByPatient, medsFS]);

  const todayISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(todayISO());

  const dailyFor = (m: PatientMedication) =>
    (m.morning ? 1 : 0) + (m.afternoon ? 1 : 0) + (m.evening ? 1 : 0);

  const addPatient = async (): Promise<void> => {
    if (!user || !newPatientName.trim()) return;

    await addDoc(collection(db, `users/${user.uid}/patients`), {
      name: newPatientName,
      medications: [],
    });

    setNewPatientName('');
  };

  const removePatient = async (patientId: string): Promise<void> => {
    if (!user) return;

    await deleteDoc(doc(db, `users/${user.uid}/patients/${patientId}`));
  };

  const addMedication = async (patientId: string): Promise<void> => {
    if (!user) return;
    if (!newMedication.trim()) return;

    const name = newMedication.trim();
    const qty = parseInt(newMedicationPills || '0', 10) || 0;

    if (qty < 0) {
      alert(t('home.patients.quantityNegative'));
      return;
    }

    const existing = medsFS.find(
      m => m.name.toLowerCase() === name.toLowerCase()
    );

    let medId: string;

    if (existing) {
      medId = existing.id;

      await updateDoc(doc(db, `users/${user.uid}/medications/${medId}`), {
        patientIds: arrayUnion(patientId),
      });

      if (qty > 0) {
        await updateDoc(doc(db, `users/${user.uid}/medications/${medId}`), {
          pillsRemaining: increment(qty),
        });

        await addPurchase(user.uid, {
          medicationId: medId,
          medicationName: existing.name,
          quantity: qty,
          notes: 'Поповнення при прив’язці до пацієнта',
        });
      }
    } else {
      const created = await addDoc(
        collection(db, `users/${user.uid}/medications`),
        {
          name,
          pillsRemaining: qty,
          patientIds: [patientId],
        }
      );
      medId = created.id;
    }

    await setDoc(
      doc(db, `users/${user.uid}/patients/${patientId}/medications/${medId}`),
      { morning: false, afternoon: false, evening: false },
      { merge: true }
    );

    setSelectedPatient(patientId);
    setNewMedication('');
    setNewMedicationPills('');
  };

  const removeMedication = async (patientId: string, medicationId: string) => {
    if (!user) return;

    await Promise.all([
      updateDoc(doc(db, `users/${user.uid}/medications/${medicationId}`), {
        patientIds: arrayRemove(patientId),
      }),
      deleteDoc(
        doc(
          db,
          `users/${user.uid}/patients/${patientId}/medications/${medicationId}`
        )
      ),
    ]);
  };

  const getScheduleText = (medication: PatientMedication): string => {
    const times: string[] = [];
    if (medication.morning)
      times.push(t('home.patients.morning').toLowerCase());
    if (medication.afternoon)
      times.push(t('home.patients.afternoon').toLowerCase());
    if (medication.evening)
      times.push(t('home.patients.evening').toLowerCase());
    return times.length > 0 ? times.join(', ') : t('home.patients.notAssigned');
  };

  const getDailyConsumption = (medication: PatientMedication): number => {
    let daily = 0;
    if (medication.morning) daily++;
    if (medication.afternoon) daily++;
    if (medication.evening) daily++;
    return daily;
  };

  const getDaysRemaining = (medication: PatientMedication): number => {
    const daily = getDailyConsumption(medication);
    return daily > 0 ? Math.floor(medication.pillsRemaining / daily) : Infinity;
  };

  const getAllMedications = (asOfISO: string): AggregatedMedication[] => {
    return medsFS.map(m => {
      let totalDaily = 0;
      for (const pid of Object.keys(assignByPatient)) {
        const assign = assignByPatient[pid]?.[m.id];
        if (assign) totalDaily += dailyFor(assign);
      }

      const today = new Date();
      const asOf = new Date(asOfISO);
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      ).getTime();
      const end = new Date(
        asOf.getFullYear(),
        asOf.getMonth(),
        asOf.getDate()
      ).getTime();
      const forwardDays = Math.max(
        0,
        Math.round((end - start) / (1000 * 60 * 60 * 24))
      );

      const projectedPills =
        totalDaily > 0
          ? Math.max(0, m.pillsRemaining - totalDaily * forwardDays)
          : m.pillsRemaining;

      const days =
        totalDaily > 0 ? Math.floor(projectedPills / totalDaily) : Infinity;

      return {
        id: m.id,
        name: m.name,
        totalPills: projectedPills,
        patients: m.patientIds || [],
        dailyConsumption: totalDaily,
        daysRemaining: days,
      };
    });
  };

  const getMonthlyConsumption = (medication: PatientMedication): number => {
    const daily = getDailyConsumption(medication);
    return daily * 30;
  };

  const handleAddPurchase = async (
    med: { id: string; name: string },
    value: string
  ) => {
    if (!user) return;
    const q = parseInt(value, 10);
    if (isNaN(q) || q < 0) {
      alert(t('home.patients.quantityNegative'));
      return;
    }
    if (q === 0) return;

    try {
      await addPurchase(user.uid, {
        medicationId: med.id,
        medicationName: med.name,
        quantity: q,
        notes: '',
      });
      showToast(t('home.history.addedToast', { count: q, name: med.name }));
    } catch (e: unknown) {
      const error = e as { message?: string };
      alert(error?.message ?? t('home.history.addFailed'));
    }
  };

  const getWarningLevel = (daysRemaining: number): WarningLevel => {
    if (daysRemaining <= 3) return 'critical';
    if (daysRemaining <= 7) return 'warning';
    return 'normal';
  };

  const getWarningColor = (level: WarningLevel): string => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:
        return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        {currentPage === 'patients' && (
          <PatientsPage
            patients={patients}
            newPatientName={newPatientName}
            setNewPatientName={setNewPatientName}
            addPatient={addPatient}
            removePatient={removePatient}
            newMedication={newMedication}
            setNewMedication={setNewMedication}
            newMedicationPills={newMedicationPills}
            setNewMedicationPills={setNewMedicationPills}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            addMedication={addMedication}
            medsByPatient={medsByPatient}
            removeMedication={removeMedication}
            getDaysRemaining={getDaysRemaining}
            getWarningLevel={getWarningLevel}
            getWarningColor={getWarningColor}
            getScheduleText={getScheduleText}
            getMonthlyConsumption={getMonthlyConsumption}
            user={user}
          />
        )}
        {currentPage === 'medications' && (
          <MedicationsPage
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            allMedications={getAllMedications(selectedDate)}
            criticalMedications={getAllMedications(selectedDate).filter(
              med => getWarningLevel(med.daysRemaining) === 'critical'
            )}
            warningMedications={getAllMedications(selectedDate).filter(
              med => getWarningLevel(med.daysRemaining) === 'warning'
            )}
            patientNameById={patientNameById}
            buyQty={buyQty}
            setBuyQty={setBuyQty}
            handleAddPurchase={handleAddPurchase}
            getWarningLevel={getWarningLevel}
            getWarningColor={getWarningColor}
          />
        )}
        {currentPage === 'history' && (
          <HistoryPage
            purchases={purchases}
            medsFS={medsFS}
            editing={editing}
            setEditing={setEditing}
            editBuff={editBuff}
            setEditBuff={setEditBuff}
            savingEdit={savingEdit}
            setSavingEdit={setSavingEdit}
            user={user}
          />
        )}
      </div>

      {toast.open && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-600 dark:bg-green-700 text-white text-sm px-4 py-2 rounded shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default MedicationSystem;
