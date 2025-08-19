import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  increment,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface MedicationGlobal {
  id: string;
  name: string;
  pillsRemaining: number;
}

export interface PatientMedication {
  id: string;
  medicationId: string;
  name: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  pillsRemaining: number;
}

export const medsColRef = (uid: string) =>
  collection(db, `users/${uid}/medications`);

export const patientMedsColRef = (uid: string, patientId: string) =>
  collection(db, `users/${uid}/patients/${patientId}/medications`);

export function listenMeds(
  uid: string,
  cb: (meds: MedicationGlobal[]) => void
) {
  return onSnapshot(
    medsColRef(uid),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const meds: MedicationGlobal[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<MedicationGlobal, 'id'>),
      }));
      cb(meds);
    }
  );
}

export async function getMeds(uid: string): Promise<MedicationGlobal[]> {
  const snapshot = await getDocs(medsColRef(uid));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<MedicationGlobal, 'id'>),
  }));
}

export async function addMedication(
  uid: string,
  medication: Omit<MedicationGlobal, 'id'>
): Promise<string> {
  const ref = await addDoc(medsColRef(uid), medication);
  return ref.id;
}

export async function deleteMedication(
  uid: string,
  medicationId: string
): Promise<void> {
  await deleteDoc(doc(medsColRef(uid), medicationId));
}

export async function addPills(
  uid: string,
  medicationId: string,
  delta: number
): Promise<void> {
  const medRef = doc(medsColRef(uid), medicationId);

  const snap = await getDoc(medRef);
  if (!snap.exists()) return;

  const current = snap.data().pillsRemaining || 0;
  const newValue = current + delta;

  if (newValue < 0) {
    return;
  }

  await updateDoc(medRef, { pillsRemaining: newValue });
}

export function listenPatientMeds(
  uid: string,
  patientId: string,
  cb: (meds: PatientMedication[]) => void
) {
  return onSnapshot(
    patientMedsColRef(uid, patientId),
    (snapshot: QuerySnapshot<DocumentData>) => {
      const meds: PatientMedication[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<PatientMedication, 'id'>),
      }));
      cb(meds);
    }
  );
}

export async function assignMedicationToPatient(
  uid: string,
  patientId: string,
  med: MedicationGlobal
): Promise<string> {
  const ref = await addDoc(patientMedsColRef(uid, patientId), {
    medicationId: med.id,
    name: med.name,
    morning: false,
    afternoon: false,
    evening: false,
    pillsRemaining: 0,
  });
  return ref.id;
}

export async function unassignMedicationFromPatient(
  uid: string,
  patientId: string,
  patientMedId: string
): Promise<void> {
  await deleteDoc(
    doc(db, `users/${uid}/patients/${patientId}/medications/${patientMedId}`)
  );
}

export async function togglePatientMedicationTime(
  uid: string,
  patientId: string,
  patientMedId: string,
  time: 'morning' | 'afternoon' | 'evening',
  nextValue: boolean
): Promise<void> {
  await updateDoc(
    doc(db, `users/${uid}/patients/${patientId}/medications/${patientMedId}`),
    { [time]: nextValue }
  );
}

export async function addPillsToPatientMed(
  uid: string,
  patientId: string,
  patientMedId: string,
  delta: number
): Promise<void> {
  await updateDoc(
    doc(db, `users/${uid}/patients/${patientId}/medications/${patientMedId}`),
    { pillsRemaining: increment(delta) }
  );
}
