import imageCompression from 'browser-image-compression';

export const compressionService = {
  async compressImage(file: File, options?: { maxSizeMB?: number, maxWidthOrHeight?: number }): Promise<File> {
    if (!file.type.startsWith('image/')) return file;
    
    const defaultOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, { ...defaultOptions, ...options });
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      return file;
    }
  }
};
