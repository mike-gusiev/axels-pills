import { AggregatedMedication, WarningLevel } from '@/types';
import DateSelector from '../medications/DateSelector';
import MedicationNotifications from '../medications/MedicationNotifications';
import MedicationsTable from '../medications/MedicationsTable';

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
  return (
    <div className="space-y-6">
      {/* Calendar */}
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* Notifications */}
      <MedicationNotifications
        criticalMedications={criticalMedications}
        warningMedications={warningMedications}
      />

      {/* Medications List */}
      <MedicationsTable
        allMedications={allMedications}
        patientNameById={patientNameById}
        buyQty={buyQty}
        setBuyQty={setBuyQty}
        handleAddPurchase={handleAddPurchase}
        getWarningLevel={getWarningLevel}
        getWarningColor={getWarningColor}
      />
    </div>
  );
};

export default MedicationsPage;
