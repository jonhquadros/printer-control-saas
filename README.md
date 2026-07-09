# PrinterControl SaaS v1.0

Plataforma Multi-Tenant para gestão de outsourcing de impressão, controle de contadores, Ordens de Serviço e manutenção.

## 🚀 Tecnologias

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Express (Vite Middleware), Firebase Admin SDK
- **Database**: Firestore (NoSQL)
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **UI**: Shadcn/UI, Lucide Icons, Motion (Animations)

## 🛠️ Configuração Local

1.  **Instale as dependências**:
    ```bash
    npm install
    ```

2.  **Variáveis de Ambiente**:
    Crie um arquivo `.env` baseado no `.env.example` com suas credenciais do Firebase e Cloudinary.

3.  **Desenvolvimento**:
    ```bash
    npm run dev
    ```

## 🔐 Segurança & Multi-Tenancy

O sistema utiliza `companyId` como chave de isolamento em todos os documentos. As Firebase Security Rules garantem que usuários de uma empresa nunca acessem dados de outra.

- **Admin**: Controle total da empresa.
- **Técnico**: Gestão de OS e leituras.
- **Cliente**: Acesso apenas leitura aos seus equipamentos.
- **Super Admin**: Visão global de todos os tenants.

## 📈 Funcionalidades Principais

- Dashboard com KPIs em tempo real.
- Gestão de Impressoras com QR Code.
- Controle de Contadores e Manutenção Preventiva.
- Ordens de Serviço com Assinatura Digital e Fotos.
- Relatórios em PDF e Excel.
- Notificações In-App e via WhatsApp.
- Auditoria Completa de Ações.
- Inteligência Artificial para Diagnósticos (Gemini).

---
Desenvolvido por Google AI Studio.
