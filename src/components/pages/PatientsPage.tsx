import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PatientMedication } from '../../services/userMeds';
import { Patient, WarningLevel } from '@/types';
import AddPatientForm from '../patients/AddPatientForm';
import PatientCard from '../patients/PatientCard';

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
      <AddPatientForm
        newPatientName={newPatientName}
        setNewPatientName={setNewPatientName}
        addPatient={addPatient}
      />

      {/* List of patients */}
      <div className="space-y-6">
        {patients.map(patient => (
          <PatientCard
            key={patient.id}
            patient={patient}
            removePatient={removePatient}
            newMedication={newMedication}
            setNewMedication={setNewMedication}
            newMedicationPills={newMedicationPills}
            setNewMedicationPills={setNewMedicationPills}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            addMedication={addMedication}
            medications={medsByPatient[patient.id] || []}
            removeMedication={removeMedication}
            getDaysRemaining={getDaysRemaining}
            getWarningLevel={getWarningLevel}
            getWarningColor={getWarningColor}
            getScheduleText={getScheduleText}
            getMonthlyConsumption={getMonthlyConsumption}
            user={user}
          />
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
