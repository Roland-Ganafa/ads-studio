import React from 'react';

export interface UploadedImage {
  base64: string;
  mimeType: string;
}

export interface AdFormat {
  id: string;
  title: string;
  description: string;
  prompt: string;
  example?: string;
  icon: React.ReactNode;
  outputType: 'image' | 'video';
  cost: number;
}

// FIX: Renamed properties to be consistent with their usage across the application.
export interface GeneratedAdResult {
  generatedImage?: string | null;
  generatedText?: string | null;
  generatedVideoUrl?: string | null;
}

export interface Creation extends GeneratedAdResult {
  id: string;
  timestamp: number;
  originalImage: UploadedImage;
  prompt: string;
  adCopy: string;
  adFormatId: string;
  adFormatTitle: string;
}