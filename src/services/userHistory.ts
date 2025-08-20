import { db } from '../firebase';
import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

export type Purchase = {
  id: string;
  medicationId: string;
  medicationName: string;
  quantity: number;
  timestamp: number;
  notes?: string;
};

const purchasesCol = (uid: string) => collection(db, `users/${uid}/purchases`);

export function subscribePurchases(
  uid: string,
  cb: (items: Purchase[]) => void
) {
  const q = query(purchasesCol(uid), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snap) => {
    const items: Purchase[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Purchase, 'id'>),
    }));
    cb(items);
  });
}

export async function addPurchase(
  uid: string,
  p: Omit<Purchase, 'id' | 'timestamp'> & { timestamp?: number }
) {
  const ts = p.timestamp ?? Date.now();
  await runTransaction(db, async (tx) => {
    const medRef = doc(db, `users/${uid}/medications/${p.medicationId}`);
    const medSnap = await tx.get(medRef);
    if (!medSnap.exists()) throw new Error('Medication not found');

    const current = medSnap.data()?.pillsRemaining ?? 0;
    tx.update(medRef, { pillsRemaining: current + Math.max(0, p.quantity) });

    const colRef = purchasesCol(uid);
    await addDoc(colRef, {
      medicationId: p.medicationId,
      medicationName: p.medicationName,
      quantity: Math.max(0, p.quantity),
      notes: p.notes ?? '',
      timestamp: ts,
    });
  });
}

export async function updatePurchase(
  uid: string,
  prev: Purchase,
  updates: Partial<Pick<Purchase, 'quantity' | 'notes' | 'timestamp'>> & {
    medicationId?: string;
    medicationName?: string;
  }
) {
  await runTransaction(db, async (tx) => {
    const purchaseRef = doc(db, `users/${uid}/purchases/${prev.id}`);

    if (updates.medicationId && updates.medicationId !== prev.medicationId) {
      throw new Error('Зміна препарату в записі покупки не підтримується');
    }

    const newQty = updates.quantity ?? prev.quantity;
    const delta = newQty - prev.quantity;

    const medRef = doc(db, `users/${uid}/medications/${prev.medicationId}`);
    const medSnap = await tx.get(medRef);
    if (!medSnap.exists()) throw new Error('Medication not found');

    const current = medSnap.data()?.pillsRemaining ?? 0;
    const next = current + delta;
    if (next < 0)
      throw new Error('Після редагування склад не може бути від’ємним');

    tx.update(medRef, { pillsRemaining: next });

    const payload: Partial<Purchase> = {
      quantity: newQty,
      notes: updates.notes ?? prev.notes,
      timestamp: updates.timestamp ?? prev.timestamp,
      medicationName: updates.medicationName ?? prev.medicationName,
    };
    await tx.update(purchaseRef, payload);
  });
}

export async function deletePurchase(uid: string, p: Purchase) {
  await runTransaction(db, async (tx) => {
    const medRef = doc(db, `users/${uid}/medications/${p.medicationId}`);
    const medSnap = await tx.get(medRef);
    if (!medSnap.exists()) throw new Error('Medication not found');

    const current = medSnap.data()?.pillsRemaining ?? 0;
    const next = current - p.quantity;
    if (next < 0)
      throw new Error('Після видалення склад не може бути від’ємним');

    tx.update(medRef, { pillsRemaining: next });

    const purchaseRef = doc(db, `users/${uid}/purchases/${p.id}`);
    await deleteDoc(purchaseRef);
  });
}
