import { collection, getDocs } from 'firebase/firestore';

import { db } from '../firebase';

export interface Medication {
  id: string;
  name: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  pillsRemaining: number;
}

export const getMedications = async (): Promise<Medication[]> => {
  const querySnapshot = await getDocs(collection(db, 'medications'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Medication[];
};
