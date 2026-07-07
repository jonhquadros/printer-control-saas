import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { GeneratedReport, ReportType, ReportFormat, ReportFilter } from "../types";

export const reportService = {
  async getReports(companyId: string) {
    const q = query(
      collection(db, "reports"),
      where("companyId", "==", companyId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedReport));
  },

  async createReport(report: Omit<GeneratedReport, 'id' | 'createdAt' | 'status'>) {
    const docRef = await addDoc(collection(db, "reports"), {
      ...report,
      status: 'PROCESSING',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateReportStatus(id: string, status: GeneratedReport['status'], fileUrl?: string) {
    const docRef = doc(db, "reports", id);
    await updateDoc(docRef, {
      status,
      ...(fileUrl && { fileUrl }),
      updatedAt: serverTimestamp(),
    });
  },

  async generateFile(report: { type: string, format: string, data: any, name: string }) {
    const response = await fetch("/api/reports/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error("Failed to generate report file");
    }

    return await response.blob();
  }
};
