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
  
  async create(companyId: string, data: UserFormValues, adminId?: string, adminEmail?: string): Promise<void> {
    const response = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyId,
        data,
        adminId,
        adminEmail,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Falha ao criar usuário no servidor.");
    }
  },

  async update(id: string, data: Partial<UserFormValues>, adminId?: string, adminEmail?: string, companyId?: string): Promise<void> {
    const docRef = doc(db, "users", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    
    await auditService.log({
      module: 'USERS',
      action: 'UPDATE',
      userId: adminId,
      userEmail: adminEmail,
      companyId: companyId,
      details: `Usuário ${id} atualizado pelo administrador.`
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
