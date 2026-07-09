import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { ServiceOrder, OSStatus, OSPart } from "../types";
import { auditService } from "./audit.service";
import { ServiceOrderFormValues } from "../schemas/service-order.schema";

export const serviceOrderService = {
  async getAll(companyId?: string, technicianId?: string, isGlobal?: boolean): Promise<ServiceOrder[]> {
    let q;
    
    if (isGlobal || !companyId) {
      q = query(
        collection(db, "serviceOrders"), 
        orderBy("number", "desc")
      );
    } else {
      q = query(
        collection(db, "serviceOrders"), 
        where("companyId", "==", companyId),
        orderBy("number", "desc")
      );
    }
    
    const snapshot = await getDocs(q);
    let orders = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as ServiceOrder));
    
    if (technicianId) {
      orders = orders.filter(o => o.technicianId === technicianId);
    }
    
    return orders;
  },

  async getById(id: string): Promise<ServiceOrder | null> {
    const docRef = doc(db, "serviceOrders", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as ServiceOrder;
    }
    return null;
  },

  async create(data: ServiceOrderFormValues, companyId: string, userId: string): Promise<ServiceOrder> {
    // Generate auto number
    const q = query(
      collection(db, "serviceOrders"),
      where("companyId", "==", companyId),
      orderBy("number", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    let nextNumber = 1;
    if (!snapshot.empty) {
      nextNumber = (snapshot.docs[0].data().number || 0) + 1;
    }

    const osData = {
      ...data,
      number: nextNumber,
      companyId,
      status: 'ABERTA' as OSStatus,
      openingDate: serverTimestamp(),
      parts: [],
      totalCost: 0,
      photosUrls: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
      updatedBy: userId,
    };
    
    const docRef = await addDoc(collection(db, "serviceOrders"), osData);
    
    await auditService.log({
      module: 'SERVICE_ORDERS',
      action: 'CREATE',
      userId,
      companyId,
      details: `OS #${nextNumber} criada para o equipamento ${data.printerId}.`
    });

    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() } as ServiceOrder;
  },

  async updateStatus(id: string, status: OSStatus, userId: string, companyId: string): Promise<void> {
    const docRef = doc(db, "serviceOrders", id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
    
    await auditService.log({
      module: 'SERVICE_ORDERS',
      action: 'STATUS_CHANGE',
      userId,
      companyId,
      details: `Status da OS ${id} alterado para ${status}.`
    });
  },

  async uploadPhoto(id: string, stage: string, file: File, companyId: string): Promise<string> {
    const storageRef = ref(storage, `companies/${companyId}/service-orders/${id}/${stage}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },
  
  async update(id: string, data: Partial<ServiceOrder>, userId: string, companyId: string): Promise<void> {
    const docRef = doc(db, "serviceOrders", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: userId
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, "serviceOrders", id);
    await updateDoc(docRef, {
      status: 'ARQUIVADA',
      updatedAt: serverTimestamp(),
    });
  }
};
