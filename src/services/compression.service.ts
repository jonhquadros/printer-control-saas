import { UploadConfig } from '../types/file.types';

export const compressIfNeeded = async (file: File, config: UploadConfig): Promise<File> => {
  // Only compress images
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // If it's a small image or already highly compressed format, maybe skip, 
  // but prompt says "Compressão de imagem é obrigatória para imagens acima de 500KB antes do upload."
  if (file.size <= 500 * 1024) {
    return file; // Skip compression for < 500KB
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > config.compressionMaxWidth) {
          height = Math.round((height * config.compressionMaxWidth) / width);
          width = config.compressionMaxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          return resolve(file); // fallback
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg', // convert to jpeg for size
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          config.compressionQuality
        );
      };
      img.onerror = () => resolve(file); // fallback
    };
    reader.onerror = () => resolve(file);
  });
};
