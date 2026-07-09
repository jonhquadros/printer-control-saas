import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { SearchResult } from "../types/settings";

export const searchService = {
  async globalSearch(companyId: string, searchTerm: string): Promise<SearchResult[]> {
    if (!searchTerm || searchTerm.length < 2) return [];

    const results: SearchResult[] = [];
    const searchLower = searchTerm.toLowerCase();

    // 1. Search Printers (by Serial, Patrimony or IP)
    const printerQuery = query(
      collection(db, "printers"),
      where("companyId", "==", companyId),
      limit(5)
    );
    const printerDocs = await getDocs(printerQuery);
    printerDocs.forEach(doc => {
      const data = doc.data();
      if (
        data.serialNumber?.toLowerCase().includes(searchLower) ||
        data.patrimony?.toLowerCase().includes(searchLower) ||
        data.ipAddress?.toLowerCase().includes(searchLower) ||
        data.model?.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: doc.id,
          type: 'PRINTER',
          title: `${data.brand} ${data.model}`,
          subtitle: `SN: ${data.serialNumber} | IP: ${data.ipAddress}`,
          link: `/printers/${doc.id}`
        });
      }
    });

    // 2. Search OS (by Number)
    const osQuery = query(
      collection(db, "serviceOrders"),
      where("companyId", "==", companyId),
      limit(5)
    );
    const osDocs = await getDocs(osQuery);
    osDocs.forEach(doc => {
      const data = doc.data();
      if (
        String(data.number).includes(searchTerm) ||
        data.problemReported?.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: doc.id,
          type: 'OS',
          title: `OS #${data.number}`,
          subtitle: data.problemReported,
          link: `/service-orders/${doc.id}`
        });
      }
    });

    // 3. Search Users
    const userQuery = query(
      collection(db, "users"),
      where("companyId", "==", companyId),
      limit(5)
    );
    const userDocs = await getDocs(userQuery);
    userDocs.forEach(doc => {
      const data = doc.data();
      if (
        data.name?.toLowerCase().includes(searchLower) ||
        data.email?.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: doc.id,
          type: 'USER',
          title: data.name,
          subtitle: data.email,
          link: `/users` // Direciona para a lista de usuários por enquanto
        });
      }
    });

    return results;
  }
};
