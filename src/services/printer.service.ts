import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { Printer } from "../types";

export const printerService = {
  async getAll(companyId?: string): Promise<Printer[]> {
    let q;
    if (companyId) {
      q = query(
        collection(db, "printers"), 
        where("companyId", "==", companyId),
        where("deleted", "==", false)
      );
    } else {
      q = query(
        collection(db, "printers"),
        where("deleted", "==", false)
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Printer));
  },

  async getById(id: string): Promise<Printer | null> {
    const docRef = doc(db, "printers", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data.deleted) return null;
      return { id: snapshot.id, ...(data as any) } as Printer;
    }
    return null;
  },

  async create(data: Omit<Printer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Printer> {
    const printerData = {
      ...data,
      deleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "printers"), printerData);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...(newDoc.data() as any) } as Printer;
  },

  async update(id: string, data: Partial<Printer>): Promise<void> {
    const docRef = doc(db, "printers", id);
    // Filter out undefined values to prevent Firestore errors
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    await updateDoc(docRef, {
      ...cleanData,
      updatedAt: serverTimestamp(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, "printers", id);
    await updateDoc(docRef, {
      deleted: true,
      updatedAt: serverTimestamp(),
    });
  },

  async uploadPhoto(companyId: string, printerId: string, file: File): Promise<string> {
    const storageRef = ref(storage, `${companyId}/printers/${printerId}/foto-principal`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
};
