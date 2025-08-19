import { db } from '../firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';

export type Patient = {
  id: string;
  name: string;
  medications: string[];
};

const patientsColRef = (userId: string) =>
  collection(db, 'users', userId, 'patients');

export const listenPatients = (userId: string, callback: Function) => {
  return onSnapshot(patientsColRef(userId), (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const addPatient = (userId: string, name: string) => {
  return addDoc(patientsColRef(userId), {
    name,
    medications: [],
  });
};

export const removePatient = (userId: string, patientId: string) => {
  return deleteDoc(doc(db, 'users', userId, 'patients', patientId));
};
