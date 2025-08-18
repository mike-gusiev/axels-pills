import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, } from 'firebase/firestore';
import { db } from '../firebase';
export const medsColRef = (uid) => collection(db, 'users/${uid}/medications');
export function listenMeds(uid, cb) {
    getDocs(medsColRef(uid)).then((snapshot) => {
        const meds = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        cb(meds);
    });
}
export async function getMeds(uid) {
    const snapshot = await getDocs(medsColRef(uid));
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}
export async function addMedication(uid, medication) {
    const medsRef = medsColRef(uid);
    await setDoc(doc(medsRef), medication);
}
export async function updateMedication(uid, medicationId, updates) {
    const medRef = doc(medsColRef(uid), medicationId);
    await updateDoc(medRef, updates);
}
export async function deleteMedication(uid, medicationId) {
    const medRef = doc(medsColRef(uid), medicationId);
    await deleteDoc(medRef);
}
