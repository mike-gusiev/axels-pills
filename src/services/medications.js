import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
export const getMedications = async () => {
    const querySnapshot = await getDocs(collection(db, 'medications'));
    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};
