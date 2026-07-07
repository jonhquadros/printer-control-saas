import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
import { db } from "../firebase/config";
import { PrinterCounter, Printer } from "../types";

export const counterService = {
  async getByPrinter(printerId: string): Promise<PrinterCounter[]> {
    const q = query(
      collection(db, "printerCounters"),
      where("printerId", "==", printerId),
      where("deleted", "==", false),
      orderBy("date", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrinterCounter));
  },

  async create(data: Omit<PrinterCounter, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>): Promise<PrinterCounter> {
    return await runTransaction(db, async (transaction) => {
      // 1. Get current printer state to check counter
      const printerRef = doc(db, "printers", data.printerId);
      const printerSnap = await transaction.get(printerRef);
      
      if (!printerSnap.exists()) {
        throw new Error("Impressora não encontrada");
      }
      
      const printerData = printerSnap.data() as Printer;
      
      if (data.counter < printerData.currentCounter) {
        throw new Error(`O novo contador (${data.counter}) não pode ser menor que o atual (${printerData.currentCounter})`);
      }

      // 2. Calculate delta
      const delta = data.counter - printerData.currentCounter;

      // 3. Create counter document
      const counterRef = doc(collection(db, "printerCounters"));
      const newCounterData = {
        ...data,
        delta,
        deleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      transaction.set(counterRef, newCounterData);

      // 4. Update printer's current counter
      transaction.update(printerRef, {
        currentCounter: data.counter,
        updatedAt: serverTimestamp(),
      });

      return { id: counterRef.id, ...newCounterData } as PrinterCounter;
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, "printerCounters", id);
    await updateDoc(docRef, {
      deleted: true,
      updatedAt: serverTimestamp(),
    });
  }
};
