import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import crypto from "crypto";
import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
const adminApp = getApps().length === 0 
  ? initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0778844675",
    })
  : getApp();

const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/admin/create-user", async (req, res) => {
    const { companyId, data, adminId, adminEmail } = req.body;
    const { password, ...userData } = data;

    try {
      if (!password) {
        return res.status(400).json({ error: "Senha é obrigatória." });
      }

      // 1. Create Auth User
      const userRecord = await auth.createUser({
        email: data.email,
        password: password,
        displayName: data.name,
      });

      const newUserId = userRecord.uid;

      // 2. Create User Document in Firestore
      await db.collection("users").doc(newUserId).set({
        ...userData,
        id: newUserId,
        companyId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        invitedBy: adminId || null,
      });

      // 3. Audit Log
      await db.collection("auditLogs").add({
        module: 'USERS',
        action: 'CREATE',
        userId: adminId || 'SYSTEM',
        userEmail: adminEmail || 'SYSTEM',
        userName: adminEmail || 'Admin',
        companyId: companyId,
        details: `Usuário ${data.email} criado com ID ${newUserId} pelo administrador ${adminEmail}.`,
        timestamp: FieldValue.serverTimestamp(),
      });

      res.json({ status: "ok", userId: newUserId });
    } catch (error: any) {
      console.error("Error creating user:", error);
      
      let message = "Erro interno ao criar usuário.";
      const errorMsg = error.message || "";
      
      if (errorMsg.includes("identitytoolkit.googleapis.com")) {
        message = "O serviço de Autenticação não está totalmente configurado. Certifique-se de: 1. Ativar o 'Authentication' no Console do Firebase e 2. Habilitar o provedor 'E-mail/Senha' na aba Sign-in Method.";
        console.error("Firebase Auth API Error Link:", errorMsg);
      } else if (errorMsg.includes("EMAIL_EXISTS") || error.code === 'auth/email-already-exists') {
        message = "Este e-mail já está sendo utilizado por outra conta.";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "O método de login por E-mail/Senha não está habilitado no Console do Firebase.";
      }
      
      res.status(500).json({ error: message, code: error.code });
    }
  });
  app.post("/api/upload/signature", (req, res) => {
    const { folder, publicId } = req.body;
    const timestamp = Math.floor(Date.now() / 1000);
    const apiSecret = process.env.VITE_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET || "rK9O8l_npw4PtQ2VyXY5LismRIg";
    const apiKey = process.env.VITE_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY || "233674441999741";
    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || "dijgjpenq";

    const params: any = { timestamp };
    if (folder) params.folder = folder;
    if (publicId) params.public_id = publicId;

    const sortedKeys = Object.keys(params).sort();
    const signatureStr = sortedKeys.map(k => `${k}=${params[k]}`).join('&') + apiSecret;
    
    const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

    res.json({
      signature,
      timestamp,
      folder,
      apiKey,
      cloudName
    });
  });

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
