import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AdFormatSelector } from './components/AdFormatSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { Gallery } from './components/Gallery';
import { generateAdImage, generateAdVideo, suggestAdCopy } from './services/geminiService';
import type { AdFormat, UploadedImage, Creation, GeneratedAdResult } from './types';
import { AD_FORMATS } from './constants';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [selectedAdFormat, setSelectedAdFormat] = useState<AdFormat>(AD_FORMATS[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [adCopy, setAdCopy] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>(selectedAdFormat.prompt);

  const [creations, setCreations] = useState<Creation[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);

  const [suggestedSlogans, setSuggestedSlogans] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedCreations = localStorage.getItem('adStudioCreations');
      if (savedCreations) {
        setCreations(JSON.parse(savedCreations));
      }
    } catch (err) {
      console.error("Failed to load creations from local storage:", err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('adStudioCreations', JSON.stringify(creations));
    } catch (err) {
      console.error("Failed to save creations to local storage:", err);
    }
  }, [creations]);

  useEffect(() => {
    setCustomPrompt(selectedAdFormat.prompt);
    setAdCopy('');
  }, [selectedAdFormat]);

  const handleImageUpload = useCallback((image: UploadedImage | null) => {
    setUploadedImage(image);
    setSuggestedSlogans([]);
    if (image) {
      setGeneratedImage(null);
      setGeneratedText(null);
      setGeneratedVideoUrl(null);
      setError(null);
    }
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedImage || !selectedAdFormat) {
      setError('Please upload an image and select an ad format.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedText(null);
    setGeneratedVideoUrl(null);

    try {
      let result: GeneratedAdResult;
      if (selectedAdFormat.outputType === 'video') {
        result = await generateAdVideo(uploadedImage, customPrompt, adCopy);
        setGeneratedVideoUrl(result.generatedVideoUrl || null);
      } else {
        result = await generateAdImage(uploadedImage, customPrompt, adCopy);
        setGeneratedImage(result.generatedImage || null);
        setGeneratedText(result.generatedText || null);
      }
      
      const newCreation: Creation = {
        id: `creation-${Date.now()}`,
        timestamp: Date.now(),
        originalImage: uploadedImage,
        generatedImage: result.generatedImage || null,
        generatedVideoUrl: result.generatedVideoUrl || null,
        generatedText: result.generatedText || null,
        prompt: customPrompt,
        adCopy: adCopy,
        adFormatId: selectedAdFormat.id,
        adFormatTitle: selectedAdFormat.title,
      };
      setCreations(prev => [newCreation, ...prev]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, selectedAdFormat, customPrompt, adCopy]);
  
  const handleDeleteCreation = (id: string) => {
    setCreations(prev => prev.filter(c => c.id !== id));
  };

  const handleClearCreations = () => {
    if (window.confirm("Are you sure you want to delete all creations? This cannot be undone.")) {
      setCreations([]);
    }
  };
  
  const handleRemixCreation = (creation: Creation) => {
    const format = AD_FORMATS.find(f => f.id === creation.adFormatId) || AD_FORMATS[0];
    setUploadedImage(creation.originalImage);
    setSelectedAdFormat(format);
    setAdCopy(creation.adCopy);
    setCustomPrompt(creation.prompt);
    
    setGeneratedImage(null);
    setGeneratedText(null);
    setGeneratedVideoUrl(null);
    setError(null);
    setIsGalleryOpen(false);
  };

  const handleSuggestSlogans = useCallback(async () => {
    if (!uploadedImage) return;
    setIsSuggesting(true);
    setError(null);
    setSuggestedSlogans([]);
    try {
      const slogans = await suggestAdCopy(uploadedImage);
      setSuggestedSlogans(slogans);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'Could not suggest slogans.');
    } finally {
      setIsSuggesting(false);
    }
  }, [uploadedImage]);

  const buttonText = selectedAdFormat.outputType === 'video' ? 'Generate Video' : 'Generate Ad';
  const buttonIcon = selectedAdFormat.outputType === 'video' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header creationsCount={creations.length} onToggleGallery={() => setIsGalleryOpen(prev => !prev)} />
      
      {isGalleryOpen && (
        <Gallery 
          creations={creations} 
          onClose={() => setIsGalleryOpen(false)}
          onDelete={handleDeleteCreation}
          onClear={handleClearCreations}
          onRemix={handleRemixCreation}
        />
      )}

      <main className="container mx-auto p-4 md:p-8">
        <div className="space-y-12">
          
          <section>
             <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 bg-indigo-500 rounded-full h-8 w-8 flex items-center justify-center font-bold text-white ring-4 ring-indigo-500/30">1</div>
                <h2 className="text-xl font-bold text-white">Upload Product Image</h2>
              </div>
            <ImageUploader onImageUpload={handleImageUpload} />
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 bg-indigo-500 rounded-full h-8 w-8 flex items-center justify-center font-bold text-white ring-4 ring-indigo-500/30">2</div>
              <h2 className="text-xl font-bold text-white">Choose & Customize Ad</h2>
            </div>
            <AdFormatSelector
              formats={AD_FORMATS}
              selectedFormat={selectedAdFormat}
              onSelectFormat={setSelectedAdFormat}
              adCopy={adCopy}
              onAdCopyChange={setAdCopy}
              customPrompt={customPrompt}
              onCustomPromptChange={setCustomPrompt}
              onSuggestSlogans={handleSuggestSlogans}
              suggestedSlogans={suggestedSlogans}
              isSuggesting={isSuggesting}
              isImageUploaded={!!uploadedImage}
            />
          </section>

          <section className="text-center">
            <button
              onClick={handleGenerateClick}
              disabled={!uploadedImage || isLoading}
              className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              {isLoading ? (
                 <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  {buttonIcon}
                  {buttonText}
                </>
              )}
            </button>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 bg-indigo-500 rounded-full h-8 w-8 flex items-center justify-center font-bold text-white ring-4 ring-indigo-500/30">3</div>
              <h2 className="text-xl font-bold text-white">View Result</h2>
            </div>
             <ResultDisplay
                originalImage={uploadedImage}
                generatedImage={generatedImage}
                generatedText={generatedText}
                generatedVideoUrl={generatedVideoUrl}
                isLoading={isLoading}
                error={error}
                selectedAdFormat={selectedAdFormat}
             />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;