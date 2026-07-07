import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { User } from "../types";
import { UserFormValues } from "../schemas/user.schema";
import { auditService } from "./audit.service";

export const userService = {
  async getProfile(userId: string): Promise<User | null> {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      const ensureDate = (val: any) => {
        if (!val) return null;
        if (typeof val.toDate === 'function') return val.toDate();
        if (val instanceof Date) return val;
        if (val?.seconds !== undefined) return new Date(val.seconds * 1000);
        if (typeof val === 'string' || typeof val === 'number') return new Date(val);
        return null;
      };

      return {
        ...data,
        id: docSnap.id,
        createdAt: ensureDate(data.createdAt),
        updatedAt: ensureDate(data.updatedAt),
        lastLogin: ensureDate(data.lastLogin),
      } as User;
    }
    
    return null;
  },

  async updateLastLogin(userId: string): Promise<void> {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      lastLogin: serverTimestamp(),
    });
  },

  async getByCompany(companyId: string): Promise<User[]> {
    const q = query(collection(db, "users"), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  },
  
  async getAll(): Promise<User[]> {
    const q = query(collection(db, "users"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  },

  async invite(companyId: string, data: UserFormValues, adminId?: string, adminEmail?: string): Promise<void> {
    await auditService.log({
      action: 'INVITE_USER',
      userId: adminId,
      userEmail: adminEmail,
      companyId: companyId,
      status: 'SUCCESS',
      details: `User ${data.email} invited to company ${companyId}.`
    });
    console.warn("User invitation needs a backend function to securely create Firebase Auth users. Document not created in client to prevent permission denied.");
  },

  async update(id: string, data: Partial<UserFormValues>, adminId?: string, adminEmail?: string, companyId?: string): Promise<void> {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    
    await auditService.log({
      action: 'UPDATE_USER',
      userId: adminId,
      userEmail: adminEmail,
      companyId: companyId,
      status: 'SUCCESS',
      details: `User ${id} updated.`
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      status: 'INACTIVE',
      updatedAt: serverTimestamp(),
    });
  }
};
