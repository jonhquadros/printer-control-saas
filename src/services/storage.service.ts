import { UploadConfig, UploadedFile, FileModule, CloudinarySignature, CloudinaryUploadResult, FileCategory } from '../types/file.types';
import { compressIfNeeded } from './compression.service';
import { buildPublicId, buildTransformationUrl, getCloudinaryUploadUrl } from './cloudinary.service';
import { saveMetadata, softDelete as softDeleteFile } from './file.service';

// Mock generation of signature for client-side demo if no real backend is provided
// In production, this MUST call a Cloud Function
const generateUploadSignatureMock = async (folder: string, publicId: string, resourceType: string): Promise<CloudinarySignature> => {
  // Using unauthenticated upload for now if no signature backend exists.
  // We'll mimic the response to keep structure intact.
  return {
    signature: '',
    timestamp: Math.floor(Date.now() / 1000),
    folder,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  };
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
  
  // IMPORTANT: For unsigned uploads (since we don't have a secure backend available to sign it right now without exposing secrets),
  // we would typically use an upload preset. 
  // Given the constraints and lack of real cloud function backend with the secret, 
  // I will use standard unsigned upload if preset is provided, OR if the environment has secrets (not recommended but for demo).
  // Assuming the user set up an unsigned preset named "saas_upload":
  formData.append('upload_preset', 'ml_default'); // Default unsigned preset for many cloudinary accounts. Fallback.
  
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
