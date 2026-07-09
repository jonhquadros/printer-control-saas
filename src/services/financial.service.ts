import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/config";
import { 
  FinancialSummary, 
  TechnicianProductivity, 
  FinancialKPI, 
  ServiceOrder, 
  Printer,
  PrinterCounter 
} from "../types";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export const financialService = {
  async getDashboardKPIs(companyId: string, startDate: Date, endDate: Date): Promise<FinancialKPI> {
    // This is a simplified version that fetches OS in the period
    const q = query(
      collection(db, "serviceOrders"),
      where("companyId", "==", companyId),
      where("status", "==", "FINALIZADA"),
      where("updatedAt", ">=", startDate),
      where("updatedAt", "<=", endDate)
    );
    
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => doc.data() as ServiceOrder);
    
    let totalPartsCost = 0;
    let totalLaborCost = 0;
    
    orders.forEach(order => {
      totalPartsCost += order.parts.reduce((acc, p) => acc + (p.cost * p.quantity), 0);
      // Assuming totalCost includes labor + parts
      totalLaborCost += (order.totalCost || 0) - order.parts.reduce((acc, p) => acc + (p.cost * p.quantity), 0);
    });

    // Fetch total impressions in the period
    const cq = query(
      collection(db, "printerCounters"),
      where("companyId", "==", companyId),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "asc")
    );
    const counterSnapshot = await getDocs(cq);
    const counters = counterSnapshot.docs.map(doc => doc.data() as PrinterCounter);
    
    // Group by printer to find delta
    const printerDeltas: Record<string, { first: number, last: number }> = {};
    counters.forEach(c => {
      if (!printerDeltas[c.printerId]) {
        printerDeltas[c.printerId] = { first: c.counter, last: c.counter };
      } else {
        printerDeltas[c.printerId].last = c.counter;
      }
    });

    let totalImpressions = 0;
    Object.values(printerDeltas).forEach(d => {
      totalImpressions += (d.last - d.first);
    });

    const totalCostPeriod = totalPartsCost + totalLaborCost;
    
    return {
      totalCostPeriod,
      totalPartsCost,
      totalLaborCost,
      totalImpressions,
      costPerImpression: totalImpressions > 0 ? totalCostPeriod / totalImpressions : 0,
      averageOsCost: orders.length > 0 ? totalCostPeriod / orders.length : 0
    };
  },

  async getTechnicianProductivity(companyId: string, startDate: Date, endDate: Date): Promise<TechnicianProductivity[]> {
    const q = query(
      collection(db, "serviceOrders"),
      where("companyId", "==", companyId),
      where("updatedAt", ">=", startDate),
      where("updatedAt", "<=", endDate)
    );
    
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => doc.data() as ServiceOrder);
    
    const techStats: Record<string, TechnicianProductivity> = {};
    
    orders.forEach(order => {
      if (!order.technicianId) return;
      
      if (!techStats[order.technicianId]) {
        techStats[order.technicianId] = {
          technicianId: order.technicianId,
          technicianName: "Técnico", // Ideally fetch name from a user cache
          totalOs: 0,
          totalFinishedOs: 0,
          totalLaborCost: 0,
          totalPartsCost: 0,
        };
      }
      
      const stats = techStats[order.technicianId];
      stats.totalOs++;
      if (order.status === 'FINALIZADA') {
        stats.totalFinishedOs++;
        const partsCost = order.parts.reduce((acc, p) => acc + (p.cost * p.quantity), 0);
        stats.totalPartsCost += partsCost;
        stats.totalLaborCost += (order.totalCost || 0) - partsCost;
      }
    });
    
    return Object.values(techStats);
  },

  async getMonthlySummaries(companyId: string, limit: number = 6): Promise<FinancialSummary[]> {
    const q = query(
      collection(db, "financialSummary"),
      where("companyId", "==", companyId),
      orderBy("year", "desc"),
      orderBy("month", "desc")
    );
    // Actually limit doesn't work well with multiple orderBys in some SDK versions but let's try
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FinancialSummary));
  }
};
