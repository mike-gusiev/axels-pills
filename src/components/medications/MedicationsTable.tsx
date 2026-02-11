import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AggregatedMedication, WarningLevel } from '@/types';

interface MedicationsTableProps {
  allMedications: AggregatedMedication[];
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

const MedicationsTable = ({
  allMedications,
  patientNameById,
  buyQty,
  setBuyQty,
  handleAddPurchase,
  getWarningLevel,
  getWarningColor,
}: MedicationsTableProps) => {
  const { t } = useTranslation();

  const tableColumns = [
    'home.medications.medicationName',
    'home.medications.totalRemaining',
    'home.medications.dailyConsumption',
    'home.medications.daysRemaining',
    'home.medications.patients',
    'home.medications.status',
    'home.medications.actions',
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
        <Package className="w-6 h-6 mr-2 text-green-600" />
        {t('home.medications.allMedications')}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-b">
              {tableColumns.map((column, index) => (
                <th
                  key={index}
                  className="text-left p-3 font-semibold text-gray-800 dark:text-white"
                >
                  {t(column)}
                </th>
              ))}
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
  );
};

export default MedicationsTable;
