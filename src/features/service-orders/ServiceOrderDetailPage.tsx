import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, CheckCircle } from "lucide-react";
import { useServiceOrder } from "../../hooks/useServiceOrders";
import { usePrinter } from "../../hooks/usePrinters";
import { useAuth } from "../../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { OSInfoTab } from "./OSInfoTab";
import { OSStatusFlow } from "./OSStatusFlow";
import { OSPartsTab } from "./OSPartsTab";
import { OSPhotosTab } from "./OSPhotosTab";
import { OSSignaturesTab } from "./OSSignaturesTab";
import { OSReportPDF } from "./OSReportPDF";
import { Button } from "../../components/ui/button";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Loader2, Printer as PrinterIcon } from "lucide-react";

export const ServiceOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { order, isLoading: isOrderLoading } = useServiceOrder(id || "");
  const { printer, isLoading: isPrinterLoading } = usePrinter(order?.printerId || "");
  const [isGenerating, setIsGenerating] = React.useState(false);

  if (isOrderLoading || isPrinterLoading) return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="text-slate-500 font-medium">Carregando detalhes da OS...</p>
    </div>
  );
  if (!order) return <div className="p-8 text-slate-500">OS não encontrada.</div>;

  const generatePDF = async () => {
    setIsGenerating(true);
    // Use the professional layout for PDF
    const element = document.getElementById("os-report-print");
    if (!element) {
      alert("Erro ao localizar conteúdo do relatório.");
      setIsGenerating(false);
      return;
    }

    try {
      // Small delay to ensure any dynamic content or images are ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 794, // 210mm at 96dpi
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      if (!imgData || imgData === "data:,") {
        throw new Error("Falha ao capturar imagem do relatório (canvas vazio).");
      }

      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`OS-${String(order.number).padStart(5, '0')}.pdf`);
    } catch (err) {
      console.error("Error generating PDF", err);
      alert("Erro ao gerar o PDF. Verifique se todas as imagens foram carregadas.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500" id="os-pdf-content">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/service-orders" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors data-[html2canvas-ignore]:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-indigo-600" />
              OS #{String(order.number).padStart(5, '0')}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Status Atual: <span className="font-bold text-indigo-600">{order.status.replace('_', ' ')}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-2" data-html2canvas-ignore="true">
          <Button 
            variant="outline" 
            onClick={generatePDF} 
            disabled={isGenerating}
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              "Gerar PDF Profissional"
            )}
          </Button>
        </div>
      </div>

      {/* Professional PDF Template (Hidden from view but rendered for capture) */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        <OSReportPDF 
          order={order} 
          printer={printer || undefined} 
          companyName={user?.companyId || "PrinterControl"} 
        />
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6" data-html2canvas-ignore="true">
        <OSStatusFlow order={order} />
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-slate-100/50 p-1" data-html2canvas-ignore="true">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="parts">Peças</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
          <TabsTrigger value="signatures">Assinaturas</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-2">
          <OSInfoTab order={order} />
        </TabsContent>
        <TabsContent value="parts" className="mt-2">
          <OSPartsTab order={order} />
        </TabsContent>
        <TabsContent value="photos" className="mt-2">
          <OSPhotosTab order={order} />
        </TabsContent>
        <TabsContent value="signatures" className="mt-2">
          <OSSignaturesTab order={order} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
