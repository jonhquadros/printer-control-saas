export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'TECHNICIAN' | 'CLIENT';

export type Permission = 
  | 'VIEW_ALL_COMPANIES'
  | 'MANAGE_COMPANIES'
  | 'VIEW_ALL_PRINTERS'
  | 'MANAGE_PRINTERS'
  | 'VIEW_ALL_OS'
  | 'MANAGE_OS'
  | 'VIEW_REPORTS'
  | 'MANAGE_USERS'
  | 'MANAGE_SETTINGS'
  | 'VIEW_AUDIT_LOGS';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId: string;
  status: 'ACTIVE' | 'INACTIVE';
  photoUrl?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseDocument {
  companyId: string;
  createdAt: any;
  updatedAt: any;
  createdBy: string;
  updatedBy: string;
  status: string;
  deleted?: boolean;
}

export interface Printer extends BaseDocument {
  id: string;
  name: string;
  serialNumber: string;
  brand: string;
  model: string;
  assetNumber?: string; // patrimônio
  unit?: string; // unidade
  sector?: string; // setor
  ip?: string;
  mac?: string;
  location?: string;
  photoUrl?: string;
  qrCodeUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'WAITING_PARTS';
  initialCounter: number;
  currentCounter: number;
  maintenanceLimit?: number;
  lastMaintenanceDate?: any;
  nextMaintenanceDate?: any;
  observations?: string;
}

export interface PrinterCounter extends BaseDocument {
  id: string;
  printerId: string;
  date: any;
  technicianId: string;
  technicianName: string;
  counter: number;
  origin: 'MANUAL' | 'SNMP' | 'API';
  observation?: string;
  attachmentUrls?: string[];
  deleted: boolean;
}

export type OSStatus = 'ABERTA' | 'AGUARDANDO_TECNICO' | 'EM_ATENDIMENTO' | 'AGUARDANDO_PECAS' | 'AGUARDANDO_APROVACAO' | 'FINALIZADA' | 'ARQUIVADA';

export interface OSPart {
  id: string;
  name: string;
  quantity: number;
  cost: number;
}

export interface ServiceOrder extends BaseDocument {
  id: string;
  number: number;
  companyId: string;
  printerId: string;
  technicianId?: string;
  priority: 'BAIXA' | 'NORMAL' | 'ALTA' | 'URGENTE';
  category: 'CORRETIVA' | 'PREVENTIVA' | 'INSTALACAO' | 'RECOLHIMENTO';
  openingDate: any;
  predictedDate?: any;
  completionDate?: any;
  problem: string;
  diagnosis?: string;
  technicalReport?: string;
  solution?: string;
  parts: OSPart[];
  totalCost: number;
  registeredCounter?: number;
  photosUrls: string[];
  technicianSignatureUrl?: string;
  clientSignatureUrl?: string;
  status: OSStatus;
}

export type ReportType = 
  | 'PRINTER_HISTORY' 
  | 'COMPANY_HISTORY' 
  | 'OS_PERIOD' 
  | 'COSTS' 
  | 'PARTS' 
  | 'COUNTER_EVOLUTION' 
  | 'PREVENTIVE' 
  | 'SLA';

export type ReportFormat = 'PDF' | 'EXCEL' | 'CSV';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  companyId?: string;
  printerId?: string;
  technicianId?: string;
  status?: string;
  priority?: string;
}

export interface GeneratedReport {
  id: string;
  companyId: string;
  type: ReportType;
  name: string;
  format: ReportFormat;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  filters: ReportFilter;
  fileUrl?: string;
  createdBy: string;
  createdAt: any;
}

export type WhatsAppProvider = 'EVOLUTION' | 'META' | 'TWILIO';

export interface WhatsAppConfig {
  id: string;
  companyId: string;
  provider: WhatsAppProvider;
  apiUrl?: string;
  apiKey?: string;
  phoneNumber?: string;
  instanceName?: string;
  isActive: boolean;
  templates: Record<string, string>;
  updatedAt?: any;
}

export type NotificationEvent = 
  | 'OS_OPENED' 
  | 'TECHNICIAN_ON_WAY' 
  | 'SERVICE_START' 
  | 'APPROVAL_NEEDED' 
  | 'OS_COMPLETED' 
  | 'PREVENTIVE_ALERT' 
  | 'MAINTENANCE_OVERDUE' 
  | 'SATISFACTION_SURVEY';

export interface NotificationLog {
  id: string;
  companyId: string;
  orderId?: string;
  printerId?: string;
  event: NotificationEvent;
  recipient: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  error?: string;
  createdAt: any;
}

export type FileCategory = 'fotos-defeito' | 'fotos-manutencao' | 'fotos-pecas' | 'videos' | 'documentos' | 'manuais';
export type FileModule = 'SERVICE_ORDERS' | 'PRINTERS' | 'COMPANIES';

export interface UploadedFile extends BaseDocument {
  id: string;
  moduleId: FileModule;
  entityId: string;
  category: FileCategory;
  name: string;
  originalName: string;
  url: string;
  size: number;
  type: string; // mime type
  path: string; // storage path
  status: 'ACTIVE' | 'DELETED';
  deletedAt?: any;
}

export interface Part extends BaseDocument {
  id: string;
  code: string;
  name: string;
  description?: string;
  unitCost: number;
  stock: number;
  minStock?: number;
}

export interface PartUsage extends BaseDocument {
  id: string;
  partId: string;
  partName: string;
  osId: string;
  osNumber: number;
  printerId: string;
  technicianId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: any;
}

export interface FinancialSummary extends BaseDocument {
  id: string; // e.g., "YYYY-MM"
  month: number;
  year: number;
  totalImpressions: number;
  totalOsCost: number;
  totalPartsCost: number;
  totalLaborCost: number;
  costPerImpression: number;
  printerCount: number;
  averageCostPerPrinter: number;
}

export interface TechnicianProductivity {
  technicianId: string;
  technicianName: string;
  totalOs: number;
  totalFinishedOs: number;
  totalLaborCost: number;
  totalPartsCost: number;
  averageResponseTime?: number; // in hours
  averageResolutionTime?: number; // in hours
}

export interface FinancialKPI {
  totalCostPeriod: number;
  totalPartsCost: number;
  totalLaborCost: number;
  costPerImpression: number;
  averageOsCost: number;
  totalImpressions: number;
}

export interface CostConfig extends BaseDocument {
  id: string;
  laborRatePerHour: number; // Valor da hora técnica
  defaultPartMarkup?: number; // Markup padrão para peças se aplicável
}

