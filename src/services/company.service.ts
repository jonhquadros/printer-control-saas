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
import { Company } from "../types";
import { CompanyFormValues } from "../schemas/company.schema";
import { auditService } from "./audit.service";

export const companyService = {
  async getAll(): Promise<Company[]> {
    const q = query(collection(db, "companies"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
  },

  async getById(id: string): Promise<Company | null> {
    const docRef = doc(db, "companies", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Company;
    }
    return null;
  },

  async create(data: CompanyFormValues, logoFile?: File, userId?: string, userEmail?: string): Promise<Company> {
    const companyData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "companies"), companyData);
    let logoUrl = "";
    
    if (logoFile) {
      const storageRef = ref(storage, `companies/${docRef.id}/logo`);
      await uploadBytes(storageRef, logoFile);
      logoUrl = await getDownloadURL(storageRef);
      await updateDoc(docRef, { logoUrl });
    }
    
    await auditService.log({
      action: 'CREATE_COMPANY',
      userId,
      userEmail,
      companyId: docRef.id,
      status: 'SUCCESS',
      details: `Company ${data.name} created.`
    });

    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as Company;
  },

  async update(id: string, data: Partial<CompanyFormValues>, logoFile?: File, userId?: string, userEmail?: string): Promise<void> {
    const docRef = doc(db, "companies", id);
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    if (logoFile) {
      const storageRef = ref(storage, `companies/${id}/logo`);
      await uploadBytes(storageRef, logoFile);
      updateData.logoUrl = await getDownloadURL(storageRef);
    }

    await updateDoc(docRef, updateData);
    
    await auditService.log({
      action: 'UPDATE_COMPANY',
      userId,
      userEmail,
      companyId: id,
      status: 'SUCCESS',
      details: `Company ${id} updated.`
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, "companies", id);
    await updateDoc(docRef, {
      status: 'INACTIVE', // Soft delete for companies
      updatedAt: serverTimestamp(),
    });
  }
};
