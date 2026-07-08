export type FileCategory = 
  | 'foto-principal' 
  | 'fotos-defeito' 
  | 'fotos-manutencao' 
  | 'fotos-pecas' 
  | 'videos' 
  | 'documentos' 
  | 'manuais';

export type FileModule = 'printers' | 'service-orders';
export type FileResourceType = 'image' | 'video' | 'raw';
export type FileStatus = 'uploading' | 'active' | 'deleted';

export interface UploadedFile {
  id: string;
  empresaId: string;
  modulo: FileModule;
  entidadeId: string;
  categoria: FileCategory;
  publicId: string;
  url: string;
  urlOriginal: string;
  format: string;
  resourceType: FileResourceType;
  bytes: number;
  width?: number;
  height?: number;
  nomeOriginal: string;
  deleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  status: FileStatus;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0–100
  status: 'compressing' | 'uploading' | 'success' | 'error';
  error?: string;
  result?: UploadedFile;
}

export interface UploadConfig {
  maxSizeBytes: number; // default: 20MB for images, 100MB for videos
  acceptedFormats: string[]; // ['image/*', 'application/pdf', 'video/mp4', ...]
  maxFiles: number; // default: 10
  compressionQuality: number; // 0–1, default: 0.8
  compressionMaxWidth: number; // default: 1920
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: FileResourceType;
  bytes: number;
  width?: number;
  height?: number;
}
