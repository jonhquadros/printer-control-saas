import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

export interface AuditLog {
  action: string;
  userId?: string;
  userEmail?: string;
  companyId?: string;
  details?: string;
  status: 'SUCCESS' | 'FAILURE';
  ip?: string;
}

export const auditService = {
  async log(entry: AuditLog) {
    try {
      await addDoc(collection(db, "auditLogs"), {
        ...entry,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to write audit log:", error);
    }
  }
};
