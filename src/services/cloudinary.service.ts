import { FileCategory, FileModule } from '../types/file.types';
import { v4 as uuidv4 } from 'uuid';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const buildPublicId = (
  empresaId: string,
  modulo: FileModule,
  entidadeId: string,
  categoria: FileCategory
): string => {
  const timestamp = Date.now();
  const uuid = uuidv4();
  return `saas-printer-control/${empresaId}/${modulo}/${entidadeId}/${categoria}/${timestamp}_${uuid}`;
};

export const buildTransformationUrl = (publicId: string, categoria: FileCategory): string => {
  if (!CLOUD_NAME) return '';
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  
  let transformations = 'f_auto,q_auto';
  
  if (['fotos-defeito', 'fotos-manutencao', 'fotos-pecas'].includes(categoria)) {
    transformations += ',w_1920,c_limit';
  } else if (categoria === 'foto-principal') {
    transformations += ',w_800,c_fill';
  } else if (categoria === 'videos') {
    // For videos, use video endpoint
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/f_auto,q_auto/${publicId}`;
  } else if (['documentos', 'manuais'].includes(categoria)) {
    // Raw files don't support image transformations
    return `https://res.cloudinary.com/${CLOUD_NAME}/raw/upload/${publicId}`;
  }
  
  return `${baseUrl}/${transformations}/${publicId}`;
};

export const buildThumbnailUrl = (publicId: string, resourceType: string): string => {
  if (!CLOUD_NAME || resourceType !== 'image') return '';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_300,h_300,c_fill/${publicId}`;
};

export const getCloudinaryUploadUrl = (resourceType: string = 'auto') => {
  return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
};
