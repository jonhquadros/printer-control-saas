import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  listAll
} from "firebase/storage";
import { storage } from "../firebase/config";
import { v4 as uuidv4 } from 'uuid';

export const storageService = {
  async uploadFile(
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void
  ): Promise<{ url: string, path: string, name: string }> {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${uuidv4()}.${fileExtension}`;
    const fullPath = `${path}/${fileName}`;
    const storageRef = ref(storage, fullPath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            path: fullPath,
            name: fileName
          });
        }
      );
    });
  },

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
};
