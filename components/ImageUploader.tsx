import React, { useState, useCallback, useRef } from 'react';
import type { UploadedImage } from '../types';

interface ImageUploaderProps {
  onImageUpload: (image: UploadedImage | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onImageUpload({
          base64: base64String,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [onImageUpload]);

  return (
    <div className="bg-dark-card p-6 rounded-xl shadow-md border border-dark-border h-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload product image"
      />
      <div 
        onClick={handleUploadClick}
        className="mt-1 flex justify-center items-center h-full min-h-[12rem] px-6 pt-5 pb-6 border-2 border-dark-border border-dashed rounded-md cursor-pointer hover:border-accent-blue transition-colors bg-dark-bg/50"
      >
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Product preview" className="max-h-48 rounded-lg shadow-lg" />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-accent-red hover:opacity-90 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v4m-3-3l3 3 3-3" /></svg>
            <div className="flex text-sm text-text-secondary">
              <p className="pl-1">Click to upload or <span className="font-semibold text-accent-blue">drag and drop</span></p>
            </div>
            <p className="text-xs text-text-secondary/70">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};