import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/reports/generate", async (req, res) => {
    const { type, format, data, name } = req.body;
    
    try {
      if (format === 'PDF') {
        const doc = new jsPDF();
        doc.text(`Relatório: ${name}`, 10, 10);
        doc.text(`Tipo: ${type}`, 10, 20);
        doc.text("Data de geração: " + new Date().toLocaleString(), 10, 30);
        
        // Basic table representation for now
        let y = 50;
        doc.setFontSize(10);
        if (Array.isArray(data)) {
          data.slice(0, 20).forEach((item: any, i: number) => {
            const line = Object.values(item).join(" | ");
            doc.text(line, 10, y + (i * 7));
          });
        }

        const pdfBuffer = doc.output('arraybuffer');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${name}.pdf`);
        return res.send(Buffer.from(pdfBuffer));
      }

      if (format === 'EXCEL' || format === 'CSV') {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: format === 'EXCEL' ? 'xlsx' : 'csv' });
        
        res.setHeader('Content-Type', format === 'EXCEL' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${name}.${format === 'EXCEL' ? 'xlsx' : 'csv'}`);
        return res.send(buffer);
      }

      res.status(400).json({ error: "Invalid format" });
    } catch (error: any) {
      console.error("Report generation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/whatsapp/send", async (req, res) => {
    const { config, recipient, message, fileUrl } = req.body;

    if (!config || !recipient || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`[WhatsApp Proxy] Sending message via ${config.provider} to ${recipient}`);

    try {
      // Logic for different providers
      let success = false;
      let error = null;

      if (config.provider === 'EVOLUTION') {
        // Mock Evolution API call
        // const response = await fetch(`${config.apiUrl}/message/sendText/${config.instanceName}`, { ... });
        success = true;
      } else if (config.provider === 'META') {
        // Mock Meta Cloud API call
        success = true;
      } else if (config.provider === 'TWILIO') {
        // Mock Twilio call
        success = true;
      }

      if (success) {
        res.json({ status: "ok", message: "Message sent successfully" });
      } else {
        res.status(500).json({ error: error || "Failed to send message via provider" });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
