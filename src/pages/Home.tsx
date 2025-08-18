import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { db } from '../firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

type Page = 'patients' | 'medications';
type TimeOfDay = 'morning' | 'afternoon' | 'evening';
type WarningLevel = 'critical' | 'warning' | 'normal';

interface Medication {
  id: string;
  name: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  pillsRemaining: number;
}

interface Patient {
  id: string;
  name: string;
  medications: Medication[];
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
  const [currentPage, setCurrentPage] = useState<Page>('patients');
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Иванов И.И.',
      medications: [
        {
          id: '1',
          name: 'Аспирин',
          morning: true,
          afternoon: false,
          evening: true,
          pillsRemaining: 45,
        },
        {
          id: '2',
          name: 'Витамин D',
          morning: true,
          afternoon: false,
          evening: false,
          pillsRemaining: 12,
        },
      ],
    },
    {
      id: '2',
      name: 'Петрова А.С.',
      medications: [
        {
          id: '3',
          name: 'Омега-3',
          morning: true,
          afternoon: true,
          evening: false,
          pillsRemaining: 28,
        },
        {
          id: '4',
          name: 'Магний',
          morning: false,
          afternoon: false,
          evening: true,
          pillsRemaining: 8,
        },
        {
          id: '5',
          name: 'Кальций',
          morning: true,
          afternoon: false,
          evening: true,
          pillsRemaining: 35,
        },
      ],
    },
  ]);

  const [newPatientName, setNewPatientName] = useState<string>('');
  const [newMedication, setNewMedication] = useState<string>('');
  const [newMedicationPills, setNewMedicationPills] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [medsFS, setMedsFS] = useState<Medication[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'medications'),
      (snapshot) => {
        const medications: Medication[] = [];
        snapshot.forEach((doc) => {
          medications.push({
            id: doc.id,
            ...doc.data(),
          } as Medication);
        });
        setMedsFS(medications);
      }
    );

    return () => unsubscribe();
  }, []);

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
  const dailyFor = (m: Medication) =>
    (m.morning ? 1 : 0) + (m.afternoon ? 1 : 0) + (m.evening ? 1 : 0);

  const pillsAtDate = (
    m: Medication,
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

  const daysRemainingAt = (m: Medication, asOfISO: string): number => {
    const daily = dailyFor(m);
    if (!daily) return Infinity;
    const pills = pillsAtDate(m, asOfISO);
    if (pills === Infinity) return Infinity;
    return Math.floor(pills / daily);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 86400000); // 24h

    return () => clearInterval(timer);
  }, []);

  const addPatient = (): void => {
    if (newPatientName.trim()) {
      const newPatient: Patient = {
        id: Date.now().toString(),
        name: newPatientName,
        medications: [],
      };
      setPatients((prev) => [...prev, newPatient]);
      setNewPatientName('');
    }
  };

  const addMedication = (patientId: string): void => {
    if (newMedication.trim() && newMedicationPills) {
      setPatients((prev) =>
        prev.map((patient) =>
          patient.id === patientId
            ? {
                ...patient,
                medications: [
                  ...patient.medications,
                  {
                    id: Date.now().toString(), // Changed from number to string
                    name: newMedication,
                    morning: false,
                    afternoon: false,
                    evening: false,
                    pillsRemaining: parseInt(newMedicationPills, 10),
                  },
                ],
              }
            : patient
        )
      );
      setNewMedication('');
      setNewMedicationPills('');
    }
  };

  const removeMedication = (patientId: string, medicationId: string): void => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              medications: patient.medications.filter(
                (med) => med.id !== medicationId
              ),
            }
          : patient
      )
    );
  };

  const toggleSchedule = (
    patientId: string,
    medicationId: string,
    timeOfDay: TimeOfDay
  ): void => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              medications: patient.medications.map((med) =>
                med.id === medicationId
                  ? { ...med, [timeOfDay]: !med[timeOfDay] }
                  : med
              ),
            }
          : patient
      )
    );
  };

  const removePatient = (patientId: string): void => {
    setPatients((prev) => prev.filter((patient) => patient.id !== patientId));
  };

  const getScheduleText = (medication: Medication): string => {
    const times: string[] = [];
    if (medication.morning) times.push('вранці');
    if (medication.afternoon) times.push('вдень');
    if (medication.evening) times.push('ввечері');
    return times.length > 0 ? times.join(', ') : 'не назначено';
  };

  const getDailyConsumption = (medication: Medication): number => {
    let daily = 0;
    if (medication.morning) daily++;
    if (medication.afternoon) daily++;
    if (medication.evening) daily++;
    return daily;
  };

  const getDaysRemaining = (medication: Medication): number => {
    const daily = getDailyConsumption(medication);
    return daily > 0 ? Math.floor(medication.pillsRemaining / daily) : Infinity;
  };

  const getAllMedications = (asOfISO: string): AggregatedMedication[] => {
    return medsFS.map((m) => {
      const daily =
        (m.morning ? 1 : 0) + (m.afternoon ? 1 : 0) + (m.evening ? 1 : 0);

      const pills = pillsAtDate(m, asOfISO);
      const days =
        pills === Infinity
          ? Infinity
          : Math.floor((pills as number) / (daily || 1));

      return {
        id: m.id,
        name: m.name,
        totalPills: pills === Infinity ? 0 : (pills as number),
        patients: [],
        dailyConsumption: daily,
        daysRemaining: days,
      };
    });
  };

  const getMonthlyConsumption = (medication: Medication): number => {
    const daily = getDailyConsumption(medication);
    return daily * 30;
  };

  const updatePillCount = async (id: string, newCount: string) => {
    const n = parseInt(newCount, 10);
    if (Number.isNaN(n)) return;
    await updateDoc(doc(db, 'medications', id), { pillsRemaining: n });
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

  const Header = () => (
    <div className="bg-white shadow-lg mb-6">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
          <Pill className="mr-3 text-blue-600" />
          Система управління препаратами - Axels Pills Tracker
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
              {patient.medications.map((medication) => {
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
                                onChange={() =>
                                  toggleSchedule(
                                    patient.id,
                                    medication.id,
                                    time
                                  )
                                }
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

              {patient.medications.length === 0 && (
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
                        {medication.patients.join(', ')}
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
                          placeholder="Нова кількість"
                          onChange={(e) =>
                            updatePillCount(
                              medication.id as string,
                              e.target.value
                            )
                          }
                          className="w-24 p-1 text-xs border rounded focus:ring-2 focus:ring-blue-500"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-6xl mx-auto px-6 pb-6">
        {currentPage === 'patients' ? <PatientsPage /> : <MedicationsPage />}
      </div>
    </div>
  );
};

export default MedicationSystem;
