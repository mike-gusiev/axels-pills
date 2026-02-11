import { Trash2, User, Pill } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PatientMedication } from '../../services/userMeds';
import { Patient, WarningLevel } from '@/types';
import MedicationCard from './MedicationCard';

interface PatientCardProps {
  patient: Patient;
  removePatient: (patientId: string) => Promise<void>;
  newMedication: string;
  setNewMedication: (value: string) => void;
  newMedicationPills: string;
  setNewMedicationPills: (value: string) => void;
  selectedPatient: string | null;
  setSelectedPatient: (patientId: string | null) => void;
  addMedication: (patientId: string) => Promise<void>;
  medications: PatientMedication[];
  removeMedication: (patientId: string, medicationId: string) => Promise<void>;
  getDaysRemaining: (medication: PatientMedication) => number;
  getWarningLevel: (daysRemaining: number) => WarningLevel;
  getWarningColor: (level: WarningLevel) => string;
  getScheduleText: (medication: PatientMedication) => string;
  getMonthlyConsumption: (medication: PatientMedication) => number;
  user: { uid: string } | null;
}

const PatientCard = ({
  patient,
  removePatient,
  newMedication,
  setNewMedication,
  newMedicationPills,
  setNewMedicationPills,
  selectedPatient,
  setSelectedPatient,
  addMedication,
  medications,
  removeMedication,
  getDaysRemaining,
  getWarningLevel,
  getWarningColor,
  getScheduleText,
  getMonthlyConsumption,
  user,
}: PatientCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
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
            value={selectedPatient === patient.id ? newMedicationPills : ''}
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
        {medications.map(medication => (
          <MedicationCard
            key={medication.id}
            medication={medication}
            patientId={patient.id}
            removeMedication={removeMedication}
            getDaysRemaining={getDaysRemaining}
            getWarningLevel={getWarningLevel}
            getWarningColor={getWarningColor}
            getScheduleText={getScheduleText}
            getMonthlyConsumption={getMonthlyConsumption}
            user={user}
          />
        ))}

        {medications.length === 0 && (
          <div className="text-gray-500 dark:text-gray-400 text-center py-4 italic">
            {t('home.patients.noPrescribed')}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
