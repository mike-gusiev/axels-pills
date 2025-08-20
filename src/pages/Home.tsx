import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  User,
  Pill,
  Clock,
  CheckCircle,
  Calendar,
  AlertTriangle,
  Package,
  History,
  ShoppingCart,
  Edit3,
  Filter,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  subscribePurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
  type Purchase,
} from '../services/userHistory';

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

type Page = 'patients' | 'medications' | 'history';
type TimeOfDay = 'morning' | 'afternoon' | 'evening';
type WarningLevel = 'critical' | 'warning' | 'normal';
type HistoryAction = 'purchase' | 'consumption' | 'adjustment' | 'prescription';

interface Medication {
  id: string;
  name: string;
  pillsRemaining: number;
  patientIds: string[];
}

interface Patient {
  id: string;
  name: string;
  medications: PatientMedication[];
}

interface AggregatedMedication {
  id?: string;
  name: string;
  totalPills: number;
  patients: string[];
  dailyConsumption: number;
  daysRemaining: number;
}

const MedicationSystem = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(
      collection(db, `users/${user.uid}/patients`),
      (snapshot) => {
        const loadedPatients: Patient[] = snapshot.docs.map((d) => ({
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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [medsFS, setMedsFS] = useState<Medication[]>([]);
  const [patientsFS, setPatientsFS] = useState<Patient[]>([]);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [editing, setEditing] = useState<Purchase | null>(null);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
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

  useEffect(() => {
    if (!user) return;

    const unsubs: Array<() => void> = [];

    const unsubPatients = onSnapshot(
      collection(db, `users/${user.uid}/patients`),
      (snap) => {
        unsubs.forEach((u) => u());
        unsubs.length = 0;

        const nextAssignMap: Record<
          string,
          Record<string, PatientMedication>
        > = {};

        snap.docs.forEach((pDoc) => {
          const pid = pDoc.id;
          const subUnsub = onSnapshot(
            collection(db, `users/${user.uid}/patients/${pid}/medications`),
            (medSnap) => {
              const inner: Record<string, PatientMedication> = {};
              medSnap.docs.forEach((mDoc) => {
                inner[mDoc.id] = {
                  medicationId: mDoc.id,
                  ...(mDoc.data() as Omit<PatientMedication, 'medicationId'>),
                };
              });
              setAssignByPatient((prev) => ({ ...prev, [pid]: inner }));
            }
          );
          unsubs.push(subUnsub);
        });
      }
    );

    return () => {
      unsubPatients();
      unsubs.forEach((u) => u());
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, `users/${user.uid}/medications`),
      (snapshot) => {
        const medications: Medication[] = snapshot.docs.map((d) => {
          const data = d.data() as Omit<Medication, 'id'>;
          return {
            id: d.id,
            ...data,
            patientIds: Array.isArray((data as any).patientIds)
              ? data.patientIds
              : [],
          };
        });
        setMedsFS(medications);
      }
    );
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(
      collection(db, `users/${user.uid}/patients`),
      (snapshot) => {
        const patients: Patient[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Patient, 'id'>),
        }));
        setPatientsFS(patients);
      }
    );
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setLoadingPurchases(true);
    const unsub = subscribePurchases(user.uid, (items) => {
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
        .map((assign) => {
          const master = medsFS.find((m) => m.id === assign.medicationId);
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

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffInDays = (a: Date, b: Date) => {
    const A = startOfDay(a).getTime();
    const B = startOfDay(b).getTime();
    return Math.round((A - B) / (1000 * 60 * 60 * 24));
  };
  const dailyFor = (m: PatientMedication) =>
    (m.morning ? 1 : 0) + (m.afternoon ? 1 : 0) + (m.evening ? 1 : 0);

  const pillsAtDate = (
    m: PatientMedication,
    asOfISO: string
  ): number | typeof Infinity => {
    const daily = dailyFor(m);
    if (!daily) return Infinity;
    const today = new Date();
    const asOf = new Date(asOfISO);
    const forward = Math.max(0, diffInDays(asOf, today));
    const projected = m.pillsRemaining - daily * forward;
    return Math.max(0, projected);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 86400000); // 24h

    return () => clearInterval(timer);
  }, []);

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

    const existing = medsFS.find(
      (m) => m.name.toLowerCase() === name.toLowerCase()
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
    if (medication.morning) times.push('вранці');
    if (medication.afternoon) times.push('вдень');
    if (medication.evening) times.push('ввечері');
    return times.length > 0 ? times.join(', ') : 'не назначено';
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
    return medsFS.map((m) => {
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
    if (!q || q <= 0) return;

    await addPurchase(user.uid, {
      medicationId: med.id,
      medicationName: med.name,
      quantity: q,
      notes: '',
    });
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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

  const [historyDateRange, setHistoryDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date(),
  });
  const [historyActionFilter, setHistoryActionFilter] = useState<
    HistoryAction | 'all'
  >('all');
  const [historySearch, setHistorySearch] = useState('');

  // унікальні утиліти, щоб не конфліктувати з вашими
  const formatHistoryDateTime = (date: Date): string =>
    date.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getHistoryActionIcon = (action: HistoryAction) => {
    switch (action) {
      case 'purchase':
        return <ShoppingCart className="w-4 h-4" />;
      case 'consumption':
        return <Pill className="w-4 h-4" />;
      case 'adjustment':
        return <Edit3 className="w-4 h-4" />;
      case 'prescription':
        return <User className="w-4 h-4" />;
    }
  };

  const getHistoryActionColor = (action: HistoryAction) => {
    switch (action) {
      case 'purchase':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'consumption':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'adjustment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'prescription':
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  const getHistoryActionText = (action: HistoryAction) => {
    switch (action) {
      case 'purchase':
        return 'Покупка';
      case 'consumption':
        return 'Споживання';
      case 'adjustment':
        return 'Корекція';
      case 'prescription':
        return 'Призначення';
    }
  };

  const Header = () => (
    <div className="bg-white shadow-lg mb-6">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
          <Pill className="mr-3 text-blue-600" />
          Axels Pills Tracker
        </h1>
        <nav className="flex space-x-1">
          <button
            onClick={() => setCurrentPage('patients')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentPage === 'patients'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4 inline-block mr-2" />
            Пацієнти
          </button>
          <button
            onClick={() => setCurrentPage('medications')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentPage === 'medications'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="w-4 h-4 inline-block mr-2" />
            Препарати
          </button>
          <button
            onClick={() => setCurrentPage('history')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentPage === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <History className="w-4 h-4 inline-block mr-2" />
            Історія
          </button>
        </nav>
      </div>
    </div>
  );

  const PatientsPage = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Добавление нового пациента */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-800">
          Додати пацієнта
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            name="patientName"
            placeholder="ПІБ пацієнта"
            value={newPatientName}
            onChange={(e) => setNewPatientName(e.target.value)}
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addPatient}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Додати
          </button>
        </div>
      </div>

      {/* Список пациентов */}
      <div className="space-y-6">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                {patient.name}
              </h3>
              <button
                onClick={() => removePatient(patient.id)}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Добавление препарата */}
            <div className="bg-white p-3 rounded-md mb-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Назва препарата"
                  value={selectedPatient === patient.id ? newMedication : ''}
                  onChange={(e) => {
                    setNewMedication(e.target.value);
                    setSelectedPatient(patient.id);
                  }}
                  className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="number"
                  placeholder="К-ть таблеток"
                  value={
                    selectedPatient === patient.id ? newMedicationPills : ''
                  }
                  onChange={(e) => {
                    setNewMedicationPills(e.target.value);
                    setSelectedPatient(patient.id);
                  }}
                  className="w-32 p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={() => addMedication(patient.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <Pill className="w-4 h-4 mr-1" />
                  Додати
                </button>
              </div>
            </div>

            {/* Список препаратов */}
            <div className="space-y-3">
              {(medsByPatient[patient.id] || []).map((medication) => {
                const daysRemaining = getDaysRemaining(medication);
                const warningLevel = getWarningLevel(daysRemaining);

                return (
                  <div
                    key={medication.id}
                    className={`bg-white p-4 rounded-md border-l-4 border-blue-500 ${
                      warningLevel !== 'normal'
                        ? 'ring-2 ring-opacity-50 ' +
                          getWarningColor(warningLevel)
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg text-gray-800 flex items-center">
                          <Pill className="w-4 h-4 mr-2 text-blue-600" />
                          {medication.name}
                        </h4>
                        <div className="flex items-center mt-1 space-x-4">
                          <span className="text-sm text-gray-600">
                            Залишилося:{' '}
                            <strong>{medication.pillsRemaining} таб.</strong>
                          </span>
                          <span className="text-sm text-gray-600">
                            Вистачить на:{' '}
                            <strong>
                              {daysRemaining === Infinity ? '∞' : daysRemaining}{' '}
                              дн.
                            </strong>
                          </span>
                          {warningLevel !== 'normal' && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex items-center ${getWarningColor(warningLevel)}`}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {warningLevel === 'critical'
                                ? 'Терміново поповнити!'
                                : 'Скоро закінчиться'}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          removeMedication(patient.id, medication.id)
                        }
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Відвʼязати від пацієнта"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm text-gray-600 font-medium">
                        Графік прийому:
                      </span>
                    </div>

                    <div className="flex gap-4 ml-6">
                      {(['morning', 'afternoon', 'evening'] as TimeOfDay[]).map(
                        (time) => {
                          const labels: Record<TimeOfDay, string> = {
                            morning: 'Вранці',
                            afternoon: 'Вдень',
                            evening: 'Ввечері',
                          };

                          return (
                            <label
                              key={time}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={medication[time]}
                                onChange={() => {
                                  updateDoc(
                                    doc(
                                      db,
                                      `users/${user!.uid}/patients/${patient.id}/medications/${medication.id}`
                                    ),
                                    { [time]: !medication[time] }
                                  );
                                }}
                                className="sr-only"
                              />
                              <div
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                  medication[time]
                                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {medication[time] && (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                )}
                                {labels[time]}
                              </div>
                            </label>
                          );
                        }
                      )}
                    </div>

                    <div className="mt-2 ml-6 text-sm text-gray-600">
                      <strong>Приймати:</strong> {getScheduleText(medication)}
                      <span className="ml-4">
                        <strong>В місяць:</strong> ~
                        {getMonthlyConsumption(medication)} таб.
                      </span>
                    </div>
                  </div>
                );
              })}

              {(!medsByPatient[patient.id] ||
                medsByPatient[patient.id].length === 0) && (
                <div className="text-gray-500 text-center py-4 italic">
                  Препарати не призначені
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {patients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Пацієнти не додані</p>
        </div>
      )}
    </div>
  );

  const MedicationsPage = () => {
    const allMedications = getAllMedications(selectedDate);
    const criticalMedications = allMedications.filter(
      (med) => getWarningLevel(med.daysRemaining) === 'critical'
    );
    const warningMedications = allMedications.filter(
      (med) => getWarningLevel(med.daysRemaining) === 'warning'
    );

    return (
      <div className="space-y-6">
        {/* Календарь и текущая дата */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700">Дата:</span>
            <span className="text-sm text-blue-600">
              {formatDate(selectedDate)}
            </span>
          </div>

          <div className="max-w-[300px]">
            <DatePicker
              selected={new Date(selectedDate)}
              onChange={(date: Date | null) => {
                if (date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  const d = String(date.getDate()).padStart(2, '0');
                  setSelectedDate(`${y}-${m}-${d}`);
                }
              }}
              inline
              calendarClassName="w-full"
            />
          </div>
        </div>

        {/* Сповіщення */}
        {(criticalMedications.length > 0 || warningMedications.length > 0) && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Сповіщення
            </h2>

            {criticalMedications.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-red-800 mb-2">
                  Критический уровень запасов:
                </h3>
                <div className="space-y-2">
                  {criticalMedications.map((med, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border-l-4 border-red-400 p-3 rounded"
                    >
                      <p className="text-red-800">
                        <strong>{med.name}</strong> - залишилося{' '}
                        {med.totalPills} таб. (вистачить на {med.daysRemaining}{' '}
                        дн.)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {warningMedications.length > 0 && (
              <div>
                <h3 className="font-medium text-yellow-800 mb-2">
                  Скоро закінчиться:
                </h3>
                <div className="space-y-2">
                  {warningMedications.map((med, index) => (
                    <div
                      key={index}
                      className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded"
                    >
                      <p className="text-yellow-800">
                        <strong>{med.name}</strong> - залишилося{' '}
                        {med.totalPills} таб. (вистачить на {med.daysRemaining}{' '}
                        дн.)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Общий список препаратов */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Package className="w-6 h-6 mr-2 text-green-600" />
            Всі препарати
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-3 font-semibold">
                    Назва препарата
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Загальний залишок
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Витрата на день
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Вистачить на днів
                  </th>
                  <th className="text-left p-3 font-semibold">
                    Приймають пацієнти
                  </th>
                  <th className="text-left p-3 font-semibold">Статус</th>
                  <th className="text-left p-3 font-semibold">Дії</th>
                </tr>
              </thead>
              <tbody>
                {allMedications.map((medication, index) => {
                  const warningLevel = getWarningLevel(
                    medication.daysRemaining
                  );

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{medication.name}</td>
                      <td className="p-3">{medication.totalPills} таб.</td>
                      <td className="p-3">
                        {medication.dailyConsumption} таб.
                      </td>
                      <td className="p-3">
                        {medication.daysRemaining === Infinity
                          ? '∞'
                          : medication.daysRemaining}
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {medication.patients
                          .map((pid) => patientNameById[pid])
                          .filter(Boolean)
                          .join(', ') || ''}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getWarningColor(warningLevel)}`}
                        >
                          {warningLevel === 'critical'
                            ? 'Критичний'
                            : warningLevel === 'warning'
                              ? 'Попередження'
                              : 'Норма'}
                        </span>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          placeholder="Купили (таб.)"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value;
                              handleAddPurchase(
                                {
                                  id: medication.id as string,
                                  name: medication.name,
                                },
                                val
                              );
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                          className="w-28 p-1 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {allMedications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Препарати не додані</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const HistoryPage = () => {
    return (
      <div className="space-y-6">
        {/* блок фільтрів можете лишити як був; просто використовуйте history для відображення */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <History className="w-6 h-6 mr-2 text-green-600" />
              Історія операцій
            </h2>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Знайдено записів: {purchases.length}
            </div>
          </div>

          <div className="space-y-4">
            {purchases.map((p) => (
              <div key={p.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg">
                      {p.medicationName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(p.timestamp).toLocaleString('uk-UA')}
                    </div>
                    <div className="mt-1">
                      <span className="text-sm text-gray-600">Кількість: </span>
                      <span className="font-semibold text-green-700">
                        +{p.quantity}
                      </span>
                    </div>
                    {p.notes && (
                      <div className="text-sm text-gray-700 mt-1">
                        Примітки: {p.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(p);
                      }}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={async () => {
                        if (!user) return;
                        if (
                          confirm(
                            'Видалити покупку? Склад буде зменшено на цю кількість.'
                          )
                        ) {
                          await deletePurchase(user.uid, p);
                        }
                      }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-6xl mx-auto px-6 pb-6">
        {currentPage === 'patients' && PatientsPage()}
        {currentPage === 'medications' && MedicationsPage()}
        {currentPage === 'history' && <HistoryPage />}
      </div>
    </div>
  );
};

export default MedicationSystem;
