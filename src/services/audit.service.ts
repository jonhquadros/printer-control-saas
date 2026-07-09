import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { AuditLog, AuditModule, AuditAction, AuditChange } from "../types/audit";

export const auditService = {
  async log({
    module,
    action,
    userId,
    userEmail,
    userName,
    companyId,
    entityId,
    details,
    changes,
  }: {
    module: AuditModule;
    action: AuditAction;
    userId?: string;
    userEmail?: string;
    userName?: string;
    companyId?: string;
    entityId?: string;
    details: string;
    changes?: AuditChange[];
  }): Promise<void> {
    try {
      await addDoc(collection(db, "auditLogs"), {
        module,
        action,
        userId: userId || 'SYSTEM',
        userEmail: userEmail || 'system@printercontrol.com',
        userName: userName || 'Sistema',
        companyId: companyId || 'GLOBAL',
        entityId: entityId || null,
        details,
        changes: changes || null,
        timestamp: serverTimestamp(),
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
      });
    } catch (error) {
      console.error("Critical: Failed to record audit log", error);
    }
  },

  async getLogs(filters: {
    companyId?: string;
    userId?: string;
    module?: AuditModule;
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
    limitCount?: number;
  }) {
    let q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"));

    if (filters.companyId && filters.companyId !== 'GLOBAL') {
      q = query(q, where("companyId", "==", filters.companyId));
    }

    if (filters.userId) {
      q = query(q, where("userId", "==", filters.userId));
    }

    if (filters.module) {
      q = query(q, where("module", "==", filters.module));
    }

    if (filters.action) {
      q = query(q, where("action", "==", filters.action));
    }

    if (filters.startDate) {
      q = query(q, where("timestamp", ">=", Timestamp.fromDate(filters.startDate)));
    }

    if (filters.endDate) {
      q = query(q, where("timestamp", "<=", Timestamp.fromDate(filters.endDate)));
    }

    if (filters.limitCount) {
      q = query(q, limit(filters.limitCount));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: (doc.data().timestamp as Timestamp)?.toDate() || new Date(),
    })) as AuditLog[];
  }
};
