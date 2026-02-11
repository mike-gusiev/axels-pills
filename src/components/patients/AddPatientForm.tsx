import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AddPatientFormProps {
  newPatientName: string;
  setNewPatientName: (value: string) => void;
  addPatient: () => Promise<void>;
}

const AddPatientForm = ({
  newPatientName,
  setNewPatientName,
  addPatient,
}: AddPatientFormProps) => {
  const { t } = useTranslation();

  return (
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
  );
};

export default AddPatientForm;
