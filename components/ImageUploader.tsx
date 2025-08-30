
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
    <section className="bg-gray-800/50 p-6 rounded-xl shadow-md border border-gray-700 h-full">
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
        className="mt-1 flex justify-center items-center h-full min-h-[12rem] px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
      >
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Product preview" className="max-h-48 rounded-lg shadow-lg" />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-500 text-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-400">
              <p className="pl-1 font-semibold text-indigo-400">Click to upload an image</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </section>
  );
};