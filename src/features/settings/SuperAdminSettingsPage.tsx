import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { 
  ShieldAlert, 
  Building2, 
  Users, 
  Printer, 
  FileText,
  Activity,
  Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const SuperAdminSettingsPage: React.FC = () => {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: async () => {
      const q = query(collection(db, "companies"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2.5 rounded-2xl shadow-lg shadow-red-200">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Painel Global (SaaS)</h1>
        </div>
        <p className="text-slate-500 font-medium ml-12">Métricas e controle global de todas as empresas e instâncias.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-slate-50">
          <CardContent className="p-6 flex items-center gap-4">
             <div className="bg-indigo-100 p-3 rounded-xl">
               <Building2 className="w-6 h-6 text-indigo-600" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Empresas</p>
               <p className="text-2xl font-black text-slate-900">{companies?.length || 0}</p>
             </div>
          </CardContent>
        </Card>
        {/* Adicionar mais métricas globais aqui */}
      </div>

      <Card className="border-2 border-slate-100 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black text-slate-900">Gestão de Tenants</CardTitle>
              <CardDescription>Lista de todas as empresas registradas na plataforma.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white font-bold text-[10px] uppercase tracking-widest">
              <Globe className="w-3 h-3 mr-1" />
              Multi-Tenant Ativo
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead className="font-bold text-xs uppercase tracking-widest">Empresa</TableHead>
                 <TableHead className="font-bold text-xs uppercase tracking-widest">Plano</TableHead>
                 <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
                 <TableHead className="font-bold text-xs uppercase tracking-widest">Criação</TableHead>
                 <TableHead className="w-[100px]"></TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
                {companies?.map((company: any) => (
                  <TableRow key={company.id} className="hover:bg-slate-50/30">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{company.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{company.cnpj}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600 border-none shadow-none text-[10px] font-black uppercase tracking-widest">
                        Professional
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500" />
                         <span className="text-xs font-bold text-slate-600">Ativa</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {company.createdAt?.toDate().toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Gerenciar</button>
                    </TableCell>
                  </TableRow>
                ))}
             </TableBody>
           </Table>
        </CardContent>
      </Card>
    </div>
  );
};
