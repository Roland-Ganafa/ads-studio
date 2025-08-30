import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AdFormatSelector } from './components/AdFormatSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { Gallery } from './components/Gallery';
import { PricingModal } from './components/PricingModal';
import { generateAdImage, generateAdVideo, suggestAdCopy } from './services/geminiService';
import * as api from './services/apiService';
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
  
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [userCredits, setUserCredits] = useState<number>(0);

  const [suggestedSlogans, setSuggestedSlogans] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);

  useEffect(() => {
    // Fetch initial data from the mock API service on component mount
    api.fetchInitialData().then(data => {
      setCreations(data.creations);
      setUserCredits(data.credits);
    });
  }, []);

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

    const cost = selectedAdFormat.cost;
    if (userCredits < cost) {
      setError(`You need ${cost} credits, but you only have ${userCredits}. Please purchase more credits.`);
      setIsPricingModalOpen(true);
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
      
      const updatedCredits = await api.deductCredits(cost);
      setUserCredits(updatedCredits);
      
      const newCreationData: Omit<Creation, 'id' | 'timestamp'> = {
        originalImage: uploadedImage,
        generatedImage: result.generatedImage || null,
        generatedVideoUrl: result.generatedVideoUrl || null,
        generatedText: result.generatedText || null,
        prompt: customPrompt,
        adCopy: adCopy,
        adFormatId: selectedAdFormat.id,
        adFormatTitle: selectedAdFormat.title,
      };
      
      const newCreation = await api.saveCreation(newCreationData);
      setCreations(prev => [newCreation, ...prev]);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, selectedAdFormat, customPrompt, adCopy, userCredits]);
  
  const handleDeleteCreation = async (id: string) => {
    await api.deleteCreation(id);
    setCreations(prev => prev.filter(c => c.id !== id));
  };

  const handleClearCreations = async () => {
    if (window.confirm("Are you sure you want to delete all creations? This cannot be undone.")) {
      await api.clearCreations();
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

  const handlePurchaseCredits = async (creditAmount: number, paymentToken: string) => {
    console.log("Simulating purchase with token:", paymentToken);
    const newTotal = await api.purchaseCredits(creditAmount);
    setUserCredits(newTotal);
    setIsPricingModalOpen(false);
  };

  const hasEnoughCredits = userCredits >= selectedAdFormat.cost;
  const buttonText = selectedAdFormat.outputType === 'video' ? 'Generate Video' : 'Generate Ad';
  const buttonIcon = selectedAdFormat.outputType === 'video' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const SectionHeader = ({ number, title }: { number: number, title: string }) => (
    <div className="flex items-center space-x-4 mb-5">
      <div className="flex-shrink-0 bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center font-bold text-accent-blue ring-4 ring-gray-700/30">{number}</div>
      <h2 className="text-2xl font-medium text-text-primary">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary font-sans">
      <Header 
        creationsCount={creations.length} 
        onToggleGallery={() => setIsGalleryOpen(prev => !prev)}
        userCredits={userCredits}
        onBuyCreditsClick={() => setIsPricingModalOpen(true)}
      />
      
      {isGalleryOpen && (
        <Gallery 
          creations={creations} 
          onClose={() => setIsGalleryOpen(false)}
          onDelete={handleDeleteCreation}
          onClear={handleClearCreations}
          onRemix={handleRemixCreation}
        />
      )}
      
      {isPricingModalOpen && (
        <PricingModal
          onClose={() => setIsPricingModalOpen(false)}
          onPurchase={handlePurchaseCredits}
        />
      )}

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="space-y-16">
          
          <section>
            <SectionHeader number={1} title="Upload Product Image" />
            <ImageUploader onImageUpload={handleImageUpload} />
          </section>

          <section>
            <SectionHeader number={2} title="Choose & Customize Ad" />
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

          <section className="text-center py-8">
            <button
              onClick={handleGenerateClick}
              disabled={!uploadedImage || isLoading || !hasEnoughCredits}
              className="w-full max-w-sm bg-accent-blue hover:bg-blue-400 disabled:bg-gray-600 disabled:text-text-secondary disabled:cursor-not-allowed text-gray-900 font-bold text-lg py-4 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              {isLoading ? (
                 <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : !hasEnoughCredits && uploadedImage ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zM10 15a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  Insufficient Credits
                </>
              ) : (
                <>
                  {buttonIcon}
                  {buttonText}
                </>
              )}
            </button>
          </section>

          <section>
            <SectionHeader number={3} title="View Result" />
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