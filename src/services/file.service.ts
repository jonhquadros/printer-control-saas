import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  serverTimestamp,
  orderBy,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import { UploadedFile, FileModule, FileCategory } from "../types";

export const fileService = {
  async registerFile(fileData: Omit<UploadedFile, 'id' | 'createdAt' | 'updatedAt'>) {
    const docRef = await addDoc(collection(db, "files"), {
      ...fileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getFiles(params: { 
    companyId: string, 
    moduleId: FileModule, 
    entityId: string,
    category?: FileCategory
  }): Promise<UploadedFile[]> {
    let q = query(
      collection(db, "files"),
      where("companyId", "==", params.companyId),
      where("moduleId", "==", params.moduleId),
      where("entityId", "==", params.entityId),
      where("status", "==", "ACTIVE"),
      orderBy("createdAt", "desc")
    );

    if (params.category) {
      q = query(q, where("category", "==", params.category));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UploadedFile));
  },

  async softDeleteFile(fileId: string, userId: string) {
    const docRef = doc(db, "files", fileId);
    await updateDoc(docRef, {
      status: 'DELETED',
      deletedAt: serverTimestamp(),
      updatedBy: userId,
      updatedAt: serverTimestamp(),
    });
  }
};
