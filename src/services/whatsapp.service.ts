import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import { WhatsAppConfig, NotificationLog, NotificationEvent } from "../types";

export const whatsappService = {
  async getConfig(companyId: string): Promise<WhatsAppConfig | null> {
    const q = query(collection(db, "whatsappConfigs"), where("companyId", "==", companyId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as WhatsAppConfig;
  },

  async saveConfig(companyId: string, data: Partial<WhatsAppConfig>) {
    const config = await this.getConfig(companyId);
    if (config) {
      const docRef = doc(db, "whatsappConfigs", config.id);
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, "whatsappConfigs"), {
        ...data,
        companyId,
        isActive: true,
        templates: data.templates || {},
        createdAt: serverTimestamp(),
      });
    }
  },

  async getLogs(companyId: string): Promise<NotificationLog[]> {
    const q = query(
      collection(db, "notifications"),
      where("companyId", "==", companyId),
      where("createdAt", ">", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NotificationLog));
  },

  async sendNotification(params: {
    companyId: string;
    recipient: string;
    message: string;
    event: NotificationEvent;
    orderId?: string;
    printerId?: string;
    fileUrl?: string;
  }) {
    // 1. Get config
    const config = await this.getConfig(params.companyId);
    if (!config || !config.isActive) return;

    // 2. Call server-side proxy to send via provider
    try {
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config,
          recipient: params.recipient,
          message: params.message,
          fileUrl: params.fileUrl
        }),
      });

      const result = await response.json();

      // 3. Log notification
      await addDoc(collection(db, "notifications"), {
        companyId: params.companyId,
        orderId: params.orderId || null,
        printerId: params.printerId || null,
        event: params.event,
        recipient: params.recipient,
        message: params.message,
        status: response.ok ? 'SENT' : 'FAILED',
        error: response.ok ? null : result.error,
        createdAt: serverTimestamp(),
      });

      return result;
    } catch (error: any) {
      console.error("WhatsApp error:", error);
      await addDoc(collection(db, "notifications"), {
        companyId: params.companyId,
        orderId: params.orderId || null,
        printerId: params.printerId || null,
        event: params.event,
        recipient: params.recipient,
        message: params.message,
        status: 'FAILED',
        error: error.message,
        createdAt: serverTimestamp(),
      });
    }
  }
};
