import { db } from '../firebase/config';
import { collection, doc, setDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { UploadedFile, FileModule } from '../types/file.types';
import { CloudinaryUploadResult } from '../types/file.types';

export const saveMetadata = async (
  result: CloudinaryUploadResult, 
  context: {
    empresaId: string;
    modulo: FileModule;
    entidadeId: string;
    categoria: string;
    userId: string;
    originalName: string;
    urlOriginal: string;
    url: string;
  }
): Promise<UploadedFile> => {
  const fileRef = doc(collection(db, 'files'));
  const fileData: UploadedFile = {
    id: fileRef.id,
    empresaId: context.empresaId,
    modulo: context.modulo,
    entidadeId: context.entidadeId,
    categoria: context.categoria as any,
    publicId: result.public_id,
    url: context.url,
    urlOriginal: context.urlOriginal,
    format: result.format,
    resourceType: result.resource_type,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
    nomeOriginal: context.originalName,
    deleted: false,
    createdAt: new Date(),
    createdBy: context.userId,
    updatedAt: new Date(),
    updatedBy: context.userId,
    status: 'active',
  };

  await setDoc(fileRef, fileData);
  return fileData;
};

export const getFilesByEntity = async (empresaId: string, modulo: FileModule, entidadeId: string): Promise<UploadedFile[]> => {
  const q = query(
    collection(db, 'files'),
    where('empresaId', '==', empresaId),
    where('modulo', '==', modulo),
    where('entidadeId', '==', entidadeId),
    where('deleted', '==', false)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      deletedAt: data.deletedAt?.toDate ? data.deletedAt.toDate() : data.deletedAt,
    } as UploadedFile;
  });
};

export const softDelete = async (fileId: string, userId: string): Promise<void> => {
  const fileRef = doc(db, 'files', fileId);
  await updateDoc(fileRef, {
    deleted: true,
    deletedAt: new Date(),
    deletedBy: userId,
    updatedAt: new Date(),
    updatedBy: userId,
    status: 'deleted'
  });
};
