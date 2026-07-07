# PrinterControl SaaS Control

Sistema completo para gestão de outsourcing de impressão e manutenção de equipamentos.

## 🚀 Fase 01 - Setup e Design System (Concluída)

- [x] Inicialização do projeto (Vite + React + TS)
- [x] Arquitetura de pastas modular
- [x] Design System com Tailwind CSS + Radix UI
- [x] Dark / Light Mode
- [x] Layout Principal Responsivo (Sidebar + Mobile Nav)
- [x] Configuração Firebase Base
- [x] Componentes Comuns (PageHeader, EmptyState, Loading)
- [x] Placeholders de todos os módulos

## 🛠️ Tecnologias

- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS
- **Componentes**: Radix UI (via Shadcn/UI)
- **Database/Auth**: Firebase (Firestore, Auth, Storage)
- **Icons**: Lucide React
- **Animações**: Framer Motion

## 📁 Estrutura do Projeto

```
src/
 ├── components/       # Componentes reutilizáveis
 ├── features/         # Módulos de negócio
 ├── services/         # Integração com APIs/Firebase
 ├── hooks/            # Hooks customizados
 ├── contexts/         # Contextos globais (Auth, etc)
 ├── lib/              # Configurações de bibliotecas
 ├── schemas/          # Validações Zod
 ├── types/            # Tipagens TypeScript
```

## 🔒 Segurança

O sistema utiliza arquitetura **Multi-Tenant** isolada via `companyId` em todos os documentos do Firestore.
As regras de segurança (Firestore Rules) garantem que usuários de uma empresa jamais acessem dados de outra.
