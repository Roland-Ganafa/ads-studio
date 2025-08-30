
import React from 'react';
import { Loader } from './Loader';
import type { AdFormat, UploadedImage } from '../types';

interface ResultDisplayProps {
  originalImage: UploadedImage | undefined;
  generatedImage: string | null;
  generatedVideoUrl: string | null;
  generatedText: string | null;
  isLoading: boolean;
  error: string | null;
  selectedAdFormat: AdFormat;
}

const WelcomeState: React.FC = () => (
    <div className="text-center p-8">
        <svg className="mx-auto h-16 w-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h3 className="mt-2 text-xl font-medium text-gray-300">Your Ad Appears Here</h3>
        <p className="mt-1 text-sm text-gray-500">After generating an ad, the result will be shown here.</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-8 bg-red-900/20 border border-red-500/50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 className="mt-2 text-xl font-medium text-red-300">An Error Occurred</h3>
        <p className="mt-1 text-sm text-red-400">{message}</p>
    </div>
);

const renderContent = (
    originalImage: UploadedImage | undefined,
    generatedImage: string | null,
    generatedVideoUrl: string | null,
    generatedText: string | null,
    selectedAdFormat: AdFormat,
    handleDownload: () => void
) => {
    const hasResult = generatedImage || generatedVideoUrl;
    if (!hasResult || !originalImage) return <WelcomeState />;

    const downloadButton = (isVideo: boolean) => (
        <button
            onClick={handleDownload}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isVideo ? 'Download Video' : 'Download Ad'}
        </button>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h3 className="text-center text-lg font-semibold text-gray-300 tracking-wider">Original</h3>
                    <div className="p-2 bg-gray-900/50 rounded-lg">
                        <img src={`data:${originalImage.mimeType};base64,${originalImage.base64}`} alt="Original Product" className="rounded-md w-full object-contain max-h-96" />
                    </div>
                </div>
                {generatedImage && (
                    <div className="space-y-3">
                        <h3 className="text-center text-lg font-semibold text-indigo-300 tracking-wider">Generated Ad</h3>
                        <div className="p-2 bg-gray-900/50 rounded-lg">
                            <img src={generatedImage} alt="Generated Advertisement" className="rounded-md w-full object-contain max-h-96" />
                        </div>
                        {downloadButton(false)}
                    </div>
                )}
                {generatedVideoUrl && (
                     <div className="space-y-3">
                        <h3 className="text-center text-lg font-semibold text-indigo-300 tracking-wider">Generated Video</h3>
                        <div className="p-2 bg-gray-900/50 rounded-lg">
                            <video src={generatedVideoUrl} controls playsInline className="rounded-md w-full object-contain max-h-96 bg-black" />
                        </div>
                        {downloadButton(true)}
                    </div>
                )}
            </div>
            {generatedText && (
                <div className="md:col-span-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300 italic">{generatedText}</p>
                </div>
            )}
        </div>
    );
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, generatedImage, generatedVideoUrl, generatedText, isLoading, error, selectedAdFormat }) => {
  const handleDownload = () => {
    if (!selectedAdFormat) return;

    const link = document.createElement('a');
    if (generatedVideoUrl && selectedAdFormat.outputType === 'video') {
        link.href = generatedVideoUrl;
        link.download = `${selectedAdFormat.id}-ad.mp4`;
    } else if (generatedImage && selectedAdFormat.outputType === 'image') {
        link.href = generatedImage;
        link.download = `${selectedAdFormat.id}-ad.png`;
    } else {
        return;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-md border border-gray-700 min-h-[30rem] flex flex-col justify-center">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        renderContent(originalImage, generatedImage, generatedVideoUrl, generatedText, selectedAdFormat, handleDownload)
      )}
    </div>
  );
};
