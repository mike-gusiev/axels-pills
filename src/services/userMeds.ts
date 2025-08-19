import {
  collection,
  doc,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  increment,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Medication {
  id: string;
  name: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  pillsRemaining: number;
  patientIds: string[];
}

export const medsColRef = (uid: string) =>
  collection(db, `users/${uid}/medications`);

export function listenMeds(uid: string, cb: (meds: Medication[]) => void) {
  return onSnapshot(
    medsColRef(uid),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const meds: Medication[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Medication, 'id'>),
      }));
      cb(meds);
    }
  );
}

export async function getMeds(uid: string): Promise<Medication[]> {
  const snapshot = await getDocs(medsColRef(uid));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Medication, 'id'>),
  }));
}

export async function addMedication(
  uid: string,
  medication: Omit<Medication, 'id'>
): Promise<string> {
  const payload = { ...medication, patientIds: [] };
  const ref = await addDoc(medsColRef(uid), payload);
  return ref.id;
}

export async function deleteMedication(
  uid: string,
  medicationId: string
): Promise<void> {
  const medRef = doc(medsColRef(uid), medicationId);
  await deleteDoc(medRef);
}

export async function assignPatientToMedication(
  uid: string,
  medicationId: string,
  patientId: string
): Promise<void> {
  const medRef = doc(medsColRef(uid), medicationId);
  await updateDoc(medRef, { patientIds: arrayUnion(patientId) });
}

export async function unassignPatientFromMedication(
  uid: string,
  medicationId: string,
  patientId: string
): Promise<void> {
  const medRef = doc(medsColRef(uid), medicationId);
  await updateDoc(medRef, { patientIds: arrayRemove(patientId) });
}

export async function addPills(
  uid: string,
  medicationId: string,
  delta: number
): Promise<void> {
  const medRef = doc(medsColRef(uid), medicationId);
  await updateDoc(medRef, { pillsRemaining: increment(delta) });
}

export async function toggleMedicationTime(
  uid: string,
  medicationId: string,
  time: 'morning' | 'afternoon' | 'evening'
): Promise<void> {
  const medRef = doc(medsColRef(uid), medicationId);
  await updateDoc(medRef, { [time]: increment(1) });
}
