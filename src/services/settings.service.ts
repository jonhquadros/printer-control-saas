import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  writeBatch,
  getDocs,
  addDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import { CompanySettings, InAppNotification } from "../types/settings";

export const settingsService = {
  async getSettings(companyId: string): Promise<CompanySettings | null> {
    const docRef = doc(db, "settings", companyId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      ...data,
      updatedAt: data.updatedAt?.toDate(),
    } as CompanySettings;
  },

  async updateSettings(companyId: string, data: Partial<CompanySettings>): Promise<void> {
    const docRef = doc(db, "settings", companyId);
    await setDoc(docRef, {
      ...data,
      companyId,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  },

  async initializeCompany(companyId: string, plan: CompanySettings['plan']): Promise<void> {
    const defaultSettings: Partial<CompanySettings> = {
      maintenanceThresholdPages: 5000,
      maintenanceThresholdDays: 180,
      whatsappEnabled: false,
      aiEnabled: false,
      notificationPreferences: {
        osCreated: true,
        osAssigned: true,
        osFinished: true,
        maintenanceDue: true,
      },
      plan,
    };
    await this.updateSettings(companyId, defaultSettings);
  }
};

export const notificationService = {
  subscribe(companyId: string, userId: string, callback: (notifications: InAppNotification[]) => void) {
    const q = query(
      collection(db, "notifications"),
      where("companyId", "==", companyId),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as InAppNotification[];
      callback(notifications);
    });
  },

  async markAsRead(notificationId: string): Promise<void> {
    const docRef = doc(db, "notifications", notificationId);
    await updateDoc(docRef, { read: true });
  },

  async markAllAsRead(userId: string, companyId: string): Promise<void> {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("companyId", "==", companyId),
      where("read", "==", false)
    );
    
    const snapshot = await getDocs(q); // Note: getDocs needed here, I will fix import
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    await batch.commit();
  },

  async notify({
    companyId,
    userId,
    title,
    message,
    type = 'INFO',
    link
  }: Omit<InAppNotification, 'id' | 'read' | 'timestamp'>): Promise<void> {
    await addDoc(collection(db, "notifications"), {
      companyId,
      userId,
      title,
      message,
      type,
      link: link || null,
      read: false,
      timestamp: serverTimestamp(),
    });
  }
};
