import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AggregatedMedication } from '@/types';

interface MedicationNotificationsProps {
  criticalMedications: AggregatedMedication[];
  warningMedications: AggregatedMedication[];
}

const MedicationNotifications = ({
  criticalMedications,
  warningMedications,
}: MedicationNotificationsProps) => {
  const { t } = useTranslation();

  if (criticalMedications.length === 0 && warningMedications.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
        {t('home.medications.notifications')}
      </h2>

      {criticalMedications.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-red-800 mb-2 dark:text-red-400">
            {t('home.medications.criticalLevel')}
          </h3>
          <div className="space-y-2">
            {criticalMedications.map((med, index) => (
              <div
                key={index}
                className="bg-red-50 border-l-4 border-red-400 p-3 rounded"
              >
                <p className="text-red-800">
                  <strong>{med.name}</strong> -{' '}
                  {t('home.patients.remaining').toLowerCase()} {med.totalPills}{' '}
                  {t('home.patients.tabs')} (
                  {t('home.patients.enoughFor').toLowerCase()}{' '}
                  {med.daysRemaining} {t('home.patients.days')})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {warningMedications.length > 0 && (
        <div>
          <h3 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
            {t('home.medications.endingSoon')}
          </h3>
          <div className="space-y-2">
            {warningMedications.map((med, index) => (
              <div
                key={index}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded"
              >
                <p className="text-yellow-800">
                  <strong>{med.name}</strong> -{' '}
                  {t('home.patients.remaining').toLowerCase()} {med.totalPills}{' '}
                  {t('home.patients.tabs')} (
                  {t('home.patients.enoughFor').toLowerCase()}{' '}
                  {med.daysRemaining} {t('home.patients.days')})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationNotifications;
