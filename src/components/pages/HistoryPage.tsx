import { History } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Purchase } from '../../services/userHistory';
import { updatePurchase, deletePurchase } from '../../services/userHistory';
import { Medication } from '../../types';
interface HistoryPageProps {
  purchases: Purchase[];
  medsFS: Medication[];
  editing: Purchase | null;
  setEditing: (purchase: Purchase | null) => void;
  editBuff: { quantity: number; notes: string };
  setEditBuff: React.Dispatch<
    React.SetStateAction<{ quantity: number; notes: string }>
  >;
  savingEdit: boolean;
  setSavingEdit: (saving: boolean) => void;
  user: { uid: string } | null;
}

const HistoryPage = ({
  purchases,
  medsFS,
  editing,
  setEditing,
  editBuff,
  setEditBuff,
  savingEdit,
  setSavingEdit,
  user,
}: HistoryPageProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center">
            <History className="w-6 h-6 mr-2 text-green-600" />
            {t('home.history.title')}
          </h2>
          <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-center">
            {t('home.history.recordsFound')} {purchases.length}
          </div>
        </div>

        <div className="space-y-4">
          {purchases.map(p => {
            const medication = medsFS.find(m => m.id === p.medicationId);
            const isDeleted =
              !medication || (medication.patientIds?.length ?? 0) === 0;

            return (
              <div key={p.id} className="border rounded-lg p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-lg dark:text-white flex items-center gap-2">
                      {p.medicationName}
                      {isDeleted && (
                        <span className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
                          {t('home.history.deleted')}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-white">
                      {new Date(p.timestamp).toLocaleString('uk-UA')}
                    </div>

                    {editing?.id === p.id ? (
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 dark:text-white">
                            {t('home.history.quantity')}
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={editBuff.quantity}
                            onChange={e =>
                              setEditBuff(prev => ({
                                ...prev,
                                quantity:
                                  parseInt(e.target.value || '0', 10) || 0,
                              }))
                            }
                            className="w-28 p-1 text-sm border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {t('home.history.notes')}
                          </label>
                          <input
                            type="text"
                            value={editBuff.notes}
                            onChange={e =>
                              setEditBuff(prev => ({
                                ...prev,
                                notes: e.target.value,
                              }))
                            }
                            className="w-full p-2 text-sm border rounded"
                            placeholder={t('home.history.addNote')}
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            disabled={savingEdit}
                            onClick={async () => {
                              if (!user) return;
                              if (editBuff.quantity < 0) {
                                alert(t('home.history.quantityNegative'));
                                return;
                              }
                              try {
                                setSavingEdit(true);
                                await updatePurchase(user.uid, p, {
                                  quantity: editBuff.quantity,
                                  notes: editBuff.notes,
                                });
                                setEditing(null);
                              } catch (err: unknown) {
                                const error = err as { message?: string };
                                alert(
                                  error?.message ?? t('home.history.saveError')
                                );
                              } finally {
                                setSavingEdit(false);
                              }
                            }}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded disabled:opacity-60"
                          >
                            {t('home.history.save')}
                          </button>
                          <button
                            disabled={savingEdit}
                            onClick={() => setEditing(null)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-800  rounded"
                          >
                            {t('home.history.cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-1">
                          <span className="text-sm text-gray-600 dark:text-white">
                            {t('home.history.quantity')}
                          </span>
                          <span className="font-semibold text-green-700">
                            +{p.quantity}
                          </span>
                        </div>
                        {p.notes && (
                          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {t('home.history.notes')} {p.notes}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 sm:ml-4">
                    {editing?.id === p.id ? null : (
                      <button
                        onClick={() => {
                          setEditing(p);
                          setEditBuff({
                            quantity: p.quantity,
                            notes: p.notes ?? '',
                          });
                        }}
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded"
                      >
                        {t('home.history.edit')}
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        if (!user) return;
                        if (
                          confirm(
                            t('home.history.deleteConfirm', {
                              quantity: p.quantity,
                            })
                          )
                        ) {
                          try {
                            await deletePurchase(user.uid, p);
                            if (editing?.id === p.id) setEditing(null);
                          } catch (err: unknown) {
                            const error = err as { message?: string };
                            alert(
                              error?.message ?? t('home.history.deleteError')
                            );
                          }
                        }
                      }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
                    >
                      {t('home.history.delete')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
