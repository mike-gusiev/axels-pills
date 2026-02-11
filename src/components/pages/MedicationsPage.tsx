import { Calendar, AlertTriangle, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/datepicker-dark.css';
import { AggregatedMedication, WarningLevel } from '@/types';

interface MedicationsPageProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  allMedications: AggregatedMedication[];
  criticalMedications: AggregatedMedication[];
  warningMedications: AggregatedMedication[];
  patientNameById: Record<string, string>;
  buyQty: Record<string, string>;
  setBuyQty: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  handleAddPurchase: (
    med: { id: string; name: string },
    value: string
  ) => Promise<void>;
  getWarningLevel: (daysRemaining: number) => WarningLevel;
  getWarningColor: (level: WarningLevel) => string;
}

const MedicationsPage = ({
  selectedDate,
  setSelectedDate,
  allMedications,
  criticalMedications,
  warningMedications,
  patientNameById,
  buyQty,
  setBuyQty,
  handleAddPurchase,
  getWarningLevel,
  getWarningColor,
}: MedicationsPageProps) => {
  const { t } = useTranslation();

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const locale = t('_locale', 'uk-UA');
    return d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Календарь и текущая дата */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-700 dark:text-white">
            {t('home.medications.date')}:
          </span>
          <span className="text-sm text-blue-600">
            {formatDate(selectedDate)}
          </span>
        </div>

        <div className="w-full sm:max-w-[300px]">
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
                      {t('home.patients.remaining').toLowerCase()}{' '}
                      {med.totalPills} {t('home.patients.tabs')} (
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
                      {t('home.patients.remaining').toLowerCase()}{' '}
                      {med.totalPills} {t('home.patients.tabs')} (
                      {t('home.patients.enoughFor').toLowerCase()}{' '}
                      {med.daysRemaining} {t('home.patients.days')})
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Общий список препаратов */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
          <Package className="w-6 h-6 mr-2 text-green-600" />
          {t('home.medications.allMedications')}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b">
                <th className="text-left p-3 font-semibold text-gray-800 dark:text-white">
                  {t('home.medications.medicationName')}
                </th>
                <th className="text-left p-3 font-semibold text-gray-800 dark:text-white">
                  {t('home.medications.totalRemaining')}
                </th>
                <th className="text-left p-3 font-semibold text-gray-800 dark:text-white">
                  {t('home.medications.dailyConsumption')}
                </th>
                <th className="text-left p-3 font-semibold text-gray-800 dark:text-white">
                  {t('home.medications.daysRemaining')}
                </th>
                <th className="text-left p-3 font-semibold text-gray-800 dark:text-white">
                  {t('home.medications.patients')}
                </th>
                <th className="text-left p-3 font-semibold text-gray-800 dark:text-white">
                  {t('home.medications.status')}
                </th>
                <th className="text-left p-3 font-semibold text-gray-800 dark:text-white">
                  {t('home.medications.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {allMedications.map((medication, index) => {
                const warningLevel = getWarningLevel(medication.daysRemaining);

                return (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3 font-medium text-gray-800 dark:text-white">
                      {medication.name}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-white">
                      {medication.totalPills} {t('home.patients.tabs')}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-white">
                      {medication.dailyConsumption} {t('home.patients.tabs')}
                    </td>
                    <td className="p-3 text-gray-800 dark:text-white">
                      {medication.daysRemaining === Infinity
                        ? '∞'
                        : medication.daysRemaining}
                    </td>
                    <td className="p-3 text-sm text-gray-600 dark:text-gray-300">
                      {medication.patients
                        .map(pid => patientNameById[pid])
                        .filter(Boolean)
                        .join(', ') || ''}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getWarningColor(warningLevel)}`}
                      >
                        {warningLevel === 'critical'
                          ? t('home.medications.critical')
                          : warningLevel === 'warning'
                            ? t('home.medications.warning')
                            : t('home.medications.normal')}
                      </span>
                    </td>
                    <td className="p-3">
                      {medication.patients.length === 0 ? (
                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                          {t('home.medications.medicationDeleted')}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder={t('home.medications.purchased')}
                            value={buyQty[medication.id as string] ?? ''}
                            onChange={e =>
                              setBuyQty(prev => ({
                                ...prev,
                                [medication.id as string]: e.target.value,
                              }))
                            }
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                const id = medication.id as string;
                                const val = buyQty[id];
                                if (!val) return;
                                handleAddPurchase(
                                  { id, name: medication.name },
                                  val
                                );
                                setBuyQty(prev => ({ ...prev, [id]: '' }));
                              }
                            }}
                            className="w-28 p-1 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => {
                              const id = medication.id as string;
                              const val = buyQty[id];
                              if (!val) return;
                              handleAddPurchase(
                                { id, name: medication.name },
                                val
                              );
                              setBuyQty(prev => ({ ...prev, [id]: '' }));
                            }}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="Додати"
                          >
                            +
                          </button>
                        </div>
                      )}
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
            <p className="text-lg">{t('home.medications.noMedications')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationsPage;
