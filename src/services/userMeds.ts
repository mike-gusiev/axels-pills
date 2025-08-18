import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '../firebase';

export interface Medication {
  id: string;
  name: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  pillsRemaining: number;
}

export const medsColRef = (uid: string) =>
  collection(db, 'users/${uid}/medications');

export function listenMeds(uid: string, cb: (meds: Medication[]) => void) {
  getDocs(medsColRef(uid)).then((snapshot) => {
    const meds: Medication[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Medication[];
    cb(meds);
  });
}

export async function getMeds(uid: string): Promise<Medication[]> {
  const snapshot = await getDocs(medsColRef(uid));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Medication[];
}

export async function addMedication(
  uid: string,
  medication: Omit<Medication, 'id'>
): Promise<void> {
  const medsRef = medsColRef(uid);
  await setDoc(doc(medsRef), medication);
}

export async function updateMedication(
  uid: string,
  medicationId: string,
  updates: Partial<Omit<Medication, 'id'>>
): Promise<void> {
  const medRef = doc(medsColRef(uid), medicationId);
  await updateDoc(medRef, updates);
}

export async function deleteMedication(
  uid: string,
  medicationId: string
): Promise<void> {
  const medRef = doc(medsColRef(uid), medicationId);
  await deleteDoc(medRef);
}
