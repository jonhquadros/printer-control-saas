import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Part } from "../types";
import { PartFormValues } from "../schemas/financial.schema";

export const partsService = {
  async getAll(companyId: string): Promise<Part[]> {
    const q = query(
      collection(db, "parts"),
      where("companyId", "==", companyId),
      where("status", "==", "ACTIVE")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Part));
  },

  async getById(id: string): Promise<Part | null> {
    const docRef = doc(db, "parts", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Part;
    }
    return null;
  },

  async create(data: PartFormValues, companyId: string, userId: string): Promise<Part> {
    const partData = {
      ...data,
      companyId,
      status: 'ACTIVE',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
      updatedBy: userId,
    };
    const docRef = await addDoc(collection(db, "parts"), partData);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Part;
  },

  async update(id: string, data: Partial<PartFormValues>, userId: string): Promise<void> {
    const docRef = doc(db, "parts", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
  },

  async delete(id: string, userId: string): Promise<void> {
    const docRef = doc(db, "parts", id);
    await updateDoc(docRef, {
      status: 'INACTIVE',
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
  }
};
