import {
  Plus,
  Trash2,
  User,
  Pill,
  Clock,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { PatientMedication } from '../../services/userMeds';
import { Patient, TimeOfDay, WarningLevel } from '@/types';

interface PatientsPageProps {
  patients: Patient[];
  newPatientName: string;
  setNewPatientName: (value: string) => void;
  addPatient: () => Promise<void>;
  removePatient: (patientId: string) => Promise<void>;
  newMedication: string;
  setNewMedication: (value: string) => void;
  newMedicationPills: string;
  setNewMedicationPills: (value: string) => void;
  selectedPatient: string | null;
  setSelectedPatient: (patientId: string | null) => void;
  addMedication: (patientId: string) => Promise<void>;
  medsByPatient: Record<string, PatientMedication[]>;
  removeMedication: (patientId: string, medicationId: string) => Promise<void>;
  getDaysRemaining: (medication: PatientMedication) => number;
  getWarningLevel: (daysRemaining: number) => WarningLevel;
  getWarningColor: (level: WarningLevel) => string;
  getScheduleText: (medication: PatientMedication) => string;
  getMonthlyConsumption: (medication: PatientMedication) => number;
  user: { uid: string } | null;
}

const PatientsPage = ({
  patients,
  newPatientName,
  setNewPatientName,
  addPatient,
  removePatient,
  newMedication,
  setNewMedication,
  newMedicationPills,
  setNewMedicationPills,
  selectedPatient,
  setSelectedPatient,
  addMedication,
  medsByPatient,
  removeMedication,
  getDaysRemaining,
  getWarningLevel,
  getWarningColor,
  getScheduleText,
  getMonthlyConsumption,
  user,
}: PatientsPageProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      {/* Add new patient */}
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-white">
          {t('home.patients.addPatient')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            name="patientName"
            placeholder={t('home.patients.patientName')}
            value={newPatientName}
            onChange={e => setNewPatientName(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addPatient}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('home.patients.add')}
          </button>
        </div>
      </div>

      {/* List of patients */}
      <div className="space-y-6">
        {patients.map(patient => (
          <div
            key={patient.id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                {patient.name}
              </h3>
              <button
                onClick={() => removePatient(patient.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Add new medication */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-md mb-4">
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder={t('home.patients.medicationName')}
                  value={selectedPatient === patient.id ? newMedication : ''}
                  onChange={e => {
                    setNewMedication(e.target.value);
                    setSelectedPatient(patient.id);
                  }}
                  className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="number"
                  min="0"
                  placeholder={t('home.patients.pillsCount')}
                  value={
                    selectedPatient === patient.id ? newMedicationPills : ''
                  }
                  onChange={e => {
                    setNewMedicationPills(e.target.value);
                    setSelectedPatient(patient.id);
                  }}
                  className="w-32 p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={() => addMedication(patient.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <Pill className="w-4 h-4 mr-1" />
                  {t('home.patients.add')}
                </button>
              </div>
            </div>

            {/* List of medications */}
            <div className="space-y-3">
              {(medsByPatient[patient.id] || []).map(medication => {
                const daysRemaining = getDaysRemaining(medication);
                const warningLevel = getWarningLevel(daysRemaining);

                return (
                  <div
                    key={medication.id}
                    className={`dark:bg-gray-700 bg-white p-4 rounded-md border-l-4 border-blue-500 ${
                      warningLevel !== 'normal'
                        ? 'ring-2 ring-opacity-50 ' +
                          getWarningColor(warningLevel)
                        : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3 ">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg text-gray-800 dark:text-white flex items-center">
                          <Pill className="w-4 h-4 mr-2 text-blue-600" />
                          {medication.name}
                        </h4>
                        <div className=" flex flex-wrap items-center mt-1 gap-2">
                          <span className="text-sm text-gray-600 dark:text-white">
                            {t('home.patients.remaining')}:{' '}
                            <strong>
                              {medication.pillsRemaining}{' '}
                              {t('home.patients.tabs')}
                            </strong>
                          </span>
                          <span className="text-sm text-gray-600 dark:text-white">
                            {t('home.patients.enoughFor')}:{' '}
                            <strong>
                              {daysRemaining === Infinity ? '∞' : daysRemaining}{' '}
                              {t('home.patients.days')}
                            </strong>
                          </span>
                          {warningLevel !== 'normal' && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full flex items-center ${getWarningColor(warningLevel)}`}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {warningLevel === 'critical'
                                ? t('home.patients.urgentRefill')
                                : t('home.patients.endingSoon')}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          removeMedication(patient.id, medication.id)
                        }
                        className="text-red-500 hover:text-red-700 p-1"
                        title={t('home.patients.unbindFromPatient')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 mr-2 text-gray-600  dark:text-white " />
                      <span className="text-sm text-gray-600 font-medium dark:text-white">
                        {t('home.patients.schedule')}:
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 sm:ml-6">
                      {(['morning', 'afternoon', 'evening'] as TimeOfDay[]).map(
                        time => {
                          const labels: Record<TimeOfDay, string> = {
                            morning: t('home.patients.morning'),
                            afternoon: t('home.patients.afternoon'),
                            evening: t('home.patients.evening'),
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
                                    ? 'bg-green-100 text-green-800 border-2 border-green-300 dark:bg-blue-600 dark:text-white dark:border-blue-500'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
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

                    <div className="mt-2 sm:ml-6 text-sm text-gray-600 dark:text-white">
                      <strong>{t('home.patients.take')}:</strong>{' '}
                      {getScheduleText(medication)}
                      <span className="ml-4">
                        <strong>{t('home.patients.perMonth')}:</strong> ~
                        {getMonthlyConsumption(medication)}{' '}
                        {t('home.patients.tabs')}
                      </span>
                    </div>
                  </div>
                );
              })}

              {(!medsByPatient[patient.id] ||
                medsByPatient[patient.id].length === 0) && (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4 italic">
                  {t('home.patients.noPrescribed')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {patients.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">{t('home.patients.noPatients')}</p>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;
