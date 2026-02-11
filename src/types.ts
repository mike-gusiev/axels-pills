import { PatientMedication } from './services/userMeds';

interface Medication {
  id: string;
  name: string;
  pillsRemaining: number;
  patientIds: string[];
}

interface Patient {
  id: string;
  name: string;
  medications: PatientMedication[];
}

interface AggregatedMedication {
  id?: string;
  name: string;
  totalPills: number;
  patients: string[];
  dailyConsumption: number;
  daysRemaining: number;
}

type Page = 'patients' | 'medications' | 'history';
type WarningLevel = 'critical' | 'warning' | 'normal';
type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export type { Medication, Patient, AggregatedMedication, Page, WarningLevel, TimeOfDay };
