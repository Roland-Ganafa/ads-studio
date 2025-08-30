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
    <div className="bg-dark-bg rounded-xl overflow-hidden shadow-lg border border-dark-border flex flex-col group">
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
            <img src={`data:${creation.originalImage.mimeType};base64,${creation.originalImage.base64}`} alt="Original" className="w-12 h-12 object-cover rounded-md border-2 border-dark-border"/>
            <div>
              <p className="font-semibold text-text-primary text-base leading-tight">{creation.adFormatTitle}</p>
              <p className="text-xs text-text-secondary mt-1">{new Date(creation.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
            <button onClick={() => onRemix(creation)} className="flex items-center justify-center gap-2 text-sm bg-gray-600 hover:bg-gray-500 text-text-primary font-medium py-2 px-2 rounded-md transition-all duration-200" title="Remix">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4 2a1 1 0 00-1 1v2.101a7.002 7.002 0 0011.601 2.966V4.5a1 1 0 00-2 0v1.05a5 5 0 00-7.05 3.434V10a1 1 0 002 0V8.5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1h2.55a1 1 0 00.85-.49l.485-1.129a.998.998 0 011.7.734l-.55 1.283a1 1 0 00.85.49H15a1 1 0 001-1v-2.101a7.002 7.002 0 00-11.601-2.966V4.5a1 1 0 002 0v1.05a5 5 0 007.05-3.434V4a1 1 0 00-1-1H4z" /></svg>
            </button>
            <button onClick={handleDownload} className="flex items-center justify-center gap-2 text-sm bg-accent-green hover:opacity-90 text-white font-medium py-2 px-2 rounded-md transition-all duration-200" title="Download">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            <button onClick={() => onDelete(creation.id)} className="flex items-center justify-center gap-2 text-sm bg-accent-red hover:opacity-90 text-white font-medium py-2 px-2 rounded-md transition-all duration-200" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
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
    <div className="fixed inset-0 bg-dark-bg/80 backdrop-blur-sm z-50 flex flex-col" role="dialog" aria-modal="true">
      <div className="flex-shrink-0 p-4 bg-dark-card/90 border-b border-dark-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-xl font-medium text-text-primary">My Creations</h2>
          <div className="flex items-center gap-4">
            {creations.length > 0 && (
              <button onClick={onClear} className="text-sm text-accent-red hover:opacity-80 transition-opacity">Clear All</button>
            )}
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        {creations.length > 0 ? (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creations.map(creation => (
              <GalleryItem key={creation.id} creation={creation} onDelete={onDelete} onRemix={onRemix} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
             </svg>
            <h3 className="text-xl font-medium text-text-primary">Your Gallery is Empty</h3>
            <p className="mt-2 max-w-sm">Generated ads will appear here automatically. Go create something amazing!</p>
          </div>
        )}
      </div>
    </div>
  );
};