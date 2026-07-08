import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Printer as PrinterIcon, History, FileText, Wrench } from "lucide-react";
import { usePrinter } from "../../hooks/usePrinters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { CountersTab } from "./CountersTab";
import { PrinterDataTab } from "./PrinterDataTab";
import { FileGallery } from "../../components/upload/FileGallery";
import { FileDropzone } from "../../components/upload/FileDropzone";

export const PrinterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { printer, isLoading } = usePrinter(id || "");

  if (isLoading) return <div className="p-8 text-slate-500">Carregando...</div>;
  if (!printer) return <div className="p-8 text-slate-500">Impressora não encontrada.</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/printers" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <PrinterIcon className="w-6 h-6 text-indigo-600" />
              {printer.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {printer.brand} {printer.model} • NS: {printer.serialNumber}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 mb-6">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <PrinterIcon className="w-4 h-4" />
            Dados
          </TabsTrigger>
          <TabsTrigger value="counters" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Contadores
          </TabsTrigger>
          <TabsTrigger value="os" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Ordens de Serviço
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <PrinterDataTab printer={printer} />
        </TabsContent>

        <TabsContent value="counters" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CountersTab printer={printer} />
        </TabsContent>

        <TabsContent value="os" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-12 bg-white border border-dashed rounded-xl flex flex-col items-center text-center">
            <Wrench className="w-12 h-12 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Histórico de OS</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-2">
              As ordens de serviço vinculadas a este equipamento aparecerão aqui conforme forem abertas.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div>
              <h3 className="font-bold text-slate-800 mb-4">Adicionar Arquivo</h3>
              <FileDropzone 
                config={{ maxSizeBytes: 20 * 1024 * 1024, acceptedFormats: [], maxFiles: 10, compressionQuality: 0.8, compressionMaxWidth: 1920 }}
                categoria="documentos"
                modulo="printers"
                entidadeId={printer.id}
              />
            </div>
            
            <div>
              <h3 className="font-bold text-slate-800 mb-4">Arquivos da Impressora</h3>
              <FileGallery 
                modulo="printers" 
                entidadeId={printer.id}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
