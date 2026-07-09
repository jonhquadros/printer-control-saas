import { UploadConfig, UploadedFile, FileModule, CloudinarySignature, CloudinaryUploadResult, FileCategory } from '../types/file.types';
import { compressIfNeeded } from './compression.service';
import { buildPublicId, buildTransformationUrl, getCloudinaryUploadUrl } from './cloudinary.service';
import { saveMetadata, softDelete as softDeleteFile } from './file.service';

// Mock generation of signature for client-side demo if no real backend is provided
// In production, this MUST call a Cloud Function
const generateUploadSignatureMock = async (folder: string, publicId: string, resourceType: string): Promise<CloudinarySignature> => {
  const res = await fetch('/api/upload/signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, publicId })
  });
  if (!res.ok) throw new Error('Failed to generate upload signature');
  return res.json();
};

export const uploadFile = async (
  file: File,
  config: UploadConfig,
  context: {
    empresaId: string;
    modulo: FileModule;
    entidadeId: string;
    categoria: FileCategory;
    userId: string;
  },
  onProgress?: (progress: number) => void
): Promise<UploadedFile> => {
  // 1. Compress
  if (onProgress) onProgress(10);
  const fileToUpload = await compressIfNeeded(file, config);
  
  if (onProgress) onProgress(30);

  // 2. Generate Signature
  const publicId = buildPublicId(context.empresaId, context.modulo, context.entidadeId, context.categoria);
  const folder = `saas-printer-control/${context.empresaId}`; // Base folder structure
  
  // resourceType: auto
  const resourceType = 'auto';
  
  const signatureData = await generateUploadSignatureMock(folder, publicId, resourceType);
  
  if (onProgress) onProgress(40);

  // 3. Upload to Cloudinary
  const formData = new FormData();
  formData.append('file', fileToUpload);
  formData.append('public_id', publicId);
  formData.append('folder', folder);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', signatureData.timestamp.toString());
  formData.append('signature', signatureData.signature);
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', getCloudinaryUploadUrl(resourceType), true);
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        // scale 40 to 90
        const percentComplete = 40 + (e.loaded / e.total) * 50;
        onProgress(percentComplete);
      }
    };
    
    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(95);
        const result: CloudinaryUploadResult = JSON.parse(xhr.responseText);
        
        // 4. Save metadata
        const urlOriginal = result.secure_url;
        const url = buildTransformationUrl(result.public_id, context.categoria);
        
        try {
          const uploadedFile = await saveMetadata(result, {
            ...context,
            originalName: file.name,
            urlOriginal,
            url: url || urlOriginal
          });
          if (onProgress) onProgress(100);
          resolve(uploadedFile);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };
    
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
};

export const deleteFile = async (fileId: string, userId: string): Promise<void> => {
  await softDeleteFile(fileId, userId);
};

export const getDownloadUrl = async (publicId: string, resourceType: string): Promise<string> => {
  // Mock cloud function call
  // In a real app, you would fetch a signed URL from your backend to avoid exposing transformations/originals
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/fl_attachment/${publicId}`;
};

export const getZipUrl = async (publicIds: string[]): Promise<string> => {
  // Mock cloud function call for ZIP generation
  // Requires Cloudinary ZIP API (usually backend)
  throw new Error('ZIP download requires backend implementation');
};
