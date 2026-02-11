import { Trash2, Pill, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { PatientMedication } from '../../services/userMeds';
import { TimeOfDay, WarningLevel } from '@/types';

interface MedicationCardProps {
  medication: PatientMedication;
  patientId: string;
  removeMedication: (patientId: string, medicationId: string) => Promise<void>;
  getDaysRemaining: (medication: PatientMedication) => number;
  getWarningLevel: (daysRemaining: number) => WarningLevel;
  getWarningColor: (level: WarningLevel) => string;
  getScheduleText: (medication: PatientMedication) => string;
  getMonthlyConsumption: (medication: PatientMedication) => number;
  user: { uid: string } | null;
}

const MedicationCard = ({
  medication,
  patientId,
  removeMedication,
  getDaysRemaining,
  getWarningLevel,
  getWarningColor,
  getScheduleText,
  getMonthlyConsumption,
  user,
}: MedicationCardProps) => {
  const { t } = useTranslation();
  const daysRemaining = getDaysRemaining(medication);
  const warningLevel = getWarningLevel(daysRemaining);

  return (
    <div
      className={`dark:bg-gray-700 bg-white p-4 rounded-md border-l-4 border-blue-500 ${
        warningLevel !== 'normal'
          ? 'ring-2 ring-opacity-50 ' + getWarningColor(warningLevel)
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
                {medication.pillsRemaining} {t('home.patients.tabs')}
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
          onClick={() => removeMedication(patientId, medication.id)}
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
        {(['morning', 'afternoon', 'evening'] as TimeOfDay[]).map(time => {
          const labels: Record<TimeOfDay, string> = {
            morning: t('home.patients.morning'),
            afternoon: t('home.patients.afternoon'),
            evening: t('home.patients.evening'),
          };

          return (
            <label key={time} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={medication[time]}
                onChange={() => {
                  updateDoc(
                    doc(
                      db,
                      `users/${user!.uid}/patients/${patientId}/medications/${medication.id}`
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
                {medication[time] && <CheckCircle className="w-3 h-3 mr-1" />}
                {labels[time]}
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-2 sm:ml-6 text-sm text-gray-600 dark:text-white">
        <strong>{t('home.patients.take')}:</strong>{' '}
        {getScheduleText(medication)}
        <span className="ml-4">
          <strong>{t('home.patients.perMonth')}:</strong> ~
          {getMonthlyConsumption(medication)} {t('home.patients.tabs')}
        </span>
      </div>
    </div>
  );
};

export default MedicationCard;
