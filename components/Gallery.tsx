
import React, { useEffect, useCallback } from 'react';
import type { Creation } from '../types';

interface GalleryProps {
  creations: Creation[];
  onClose: () => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onRemix: (creation: Creation) => void;
}

const GalleryItem: React.FC<{ creation: Creation; onDelete: (id: string) => void; onRemix: (creation: Creation) => void; }> = ({ creation, onDelete, onRemix }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    const isVideo = !!creation.generatedVideoUrl;
    link.href = isVideo ? creation.generatedVideoUrl! : creation.generatedImage!;
    link.download = `${creation.adFormatId}-ad.${isVideo ? 'mp4' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col group">
      <div className="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center">
        {creation.generatedVideoUrl ? (
          <video src={creation.generatedVideoUrl} controls playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={creation.generatedImage || undefined} alt="Generated Ad" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-start space-x-3">
            <img src={`data:${creation.originalImage.mimeType};base64,${creation.originalImage.base64}`} alt="Original" className="w-12 h-12 object-cover rounded-md border-2 border-gray-600"/>
            <div>
              <p className="font-bold text-white text-base leading-tight">{creation.adFormatTitle}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(creation.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
            <button onClick={() => onRemix(creation)} className="flex items-center justify-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-2 rounded-md transition-all duration-200" title="Remix">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                <span className="hidden sm:inline">Remix</span>
            </button>
            <button onClick={handleDownload} className="flex items-center justify-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-2 rounded-md transition-all duration-200" title="Download">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                <span className="hidden sm:inline">Download</span>
            </button>
            <button onClick={() => onDelete(creation.id)} className="flex items-center justify-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-2 rounded-md transition-all duration-200" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 <span className="hidden sm:inline">Delete</span>
            </button>
        </div>
      </div>
    </div>
  );
};


export const Gallery: React.FC<GalleryProps> = ({ creations, onClose, onDelete, onClear, onRemix }) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col" role="dialog" aria-modal="true">
      <div className="flex-shrink-0 p-4 bg-gray-900/70 border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">My Creations</h2>
          <div className="flex items-center gap-4">
            {creations.length > 0 && (
              <button onClick={onClear} className="text-sm text-red-400 hover:text-red-300 hover:underline">Clear All</button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        {creations.length > 0 ? (
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creations.map(creation => (
              <GalleryItem key={creation.id} creation={creation} onDelete={onDelete} onRemix={onRemix} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
            <h3 className="text-xl font-semibold text-gray-300">Your Gallery is Empty</h3>
            <p className="mt-2 max-w-sm">Generated ads will appear here automatically. Go create something amazing!</p>
          </div>
        )}
      </div>
    </div>
  );
};
