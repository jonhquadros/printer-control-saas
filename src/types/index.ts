export type UserRole = 'ADMIN' | 'TECHNICIAN' | 'CLIENT' | 'SUPER_ADMIN';

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

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'UPLOADING' | 'COMPLETED' | 'ERROR';
  error?: string;
}

