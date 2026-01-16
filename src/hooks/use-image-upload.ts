import { useState } from 'react';
import { supabase } from '@/db/supabase';

export function useImageUpload(bucketName: string) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize to max 1080p
          const maxDimension = 1080;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/webp',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/webp',
            0.8
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    setUploading(true);
    setProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let fileToUpload = file;

        // Compress if larger than 1MB
        if (file.size > 1024 * 1024) {
          fileToUpload = await compressImage(file);
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${timestamp}_${randomStr}_${sanitizedName}`;

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
        setProgress(((i + 1) / files.length) * 100);
      }

      return uploadedUrls;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return { uploadFiles, uploading, progress };
}
