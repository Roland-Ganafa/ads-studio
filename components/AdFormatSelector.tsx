import React, { useState } from 'react';
import type { AdFormat } from '../types';

interface AdFormatSelectorProps {
  formats: AdFormat[];
  selectedFormat: AdFormat;
  onSelectFormat: (format: AdFormat) => void;
  adCopy: string;
  onAdCopyChange: (value: string) => void;
  customPrompt: string;
  onCustomPromptChange: (value: string) => void;
  onSuggestSlogans: () => void;
  suggestedSlogans: string[];
  isSuggesting: boolean;
  isImageUploaded: boolean;
}

export const AdFormatSelector: React.FC<AdFormatSelectorProps> = ({ 
    formats, 
    selectedFormat, 
    onSelectFormat,
    adCopy,
    onAdCopyChange,
    customPrompt,
    onCustomPromptChange,
    onSuggestSlogans,
    suggestedSlogans,
    isSuggesting,
    isImageUploaded
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-md border border-gray-700 space-y-6">
      {/* --- Format Selection --- */}
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Select Ad Format</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {formats.map((format) => (
            <div
              key={format.id}
              onClick={() => onSelectFormat(format)}
              className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                selectedFormat.id === format.id
                  ? 'bg-indigo-900/40 border-indigo-500 shadow-lg scale-105'
                  : 'bg-gray-700/30 border-gray-700 hover:border-gray-500 hover:bg-gray-700/50'
              }`}
              role="radio"
              aria-checked={selectedFormat.id === format.id}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && onSelectFormat(format)}
            >
              <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-0.5 shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-indigo-400 mt-1 flex-shrink-0 w-6 h-6">{format.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-white pr-6">{format.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{format.description}</p>
                </div>
              </div>
              <div className="absolute bottom-2 right-3 flex items-center justify-center text-xs font-bold text-yellow-400 bg-gray-900/50 rounded-full px-2 py-0.5">
                {format.cost} {format.cost === 1 ? 'Credit' : 'Credits'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Customization Section --- */}
      <div className="border-t border-gray-700 pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-300">Customize (Optional)</h3>
        
        {/* Ad Copy Card */}
        <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-600">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="ad-copy" className="block text-sm font-medium text-gray-400">Ad Copy / Slogan</label>
                 <button 
                  onClick={onSuggestSlogans}
                  disabled={!isImageUploaded || isSuggesting}
                  className="flex items-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-semibold py-1 px-3 rounded-md transition-all"
                  title="Suggest slogans based on your uploaded image"
                >
                  {isSuggesting ? (
                     <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  )}
                  <span>Suggest</span>
                </button>
            </div>
            <textarea
                id="ad-copy"
                rows={2}
                value={adCopy}
                onChange={(e) => onAdCopyChange(e.target.value)}
                placeholder="e.g., 'Summer Sale - 50% Off!'"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {suggestedSlogans.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-gray-400">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                    {suggestedSlogans.map((slogan, index) => (
                        <button 
                            key={index}
                            onClick={() => onAdCopyChange(slogan)}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-1 px-3 rounded-full transition-colors"
                        >
                            {slogan}
                        </button>
                    ))}
                </div>
              </div>
            )}
        </div>
        
        {/* Advanced Prompt Accordion */}
        <div className="bg-gray-900/40 rounded-lg border border-gray-600 overflow-hidden">
          <button 
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-300 hover:bg-gray-700/50 transition-colors"
            aria-expanded={isAdvancedOpen}
            aria-controls="advanced-prompt-panel"
          >
            <span>Advanced Prompt Editor</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-1 transition-transform transform ${isAdvancedOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isAdvancedOpen && (
            <div id="advanced-prompt-panel" className="p-4 border-t border-gray-700">
               <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-400 mb-2">Custom AI Prompt</label>
               <textarea
                   id="custom-prompt"
                   rows={5}
                   value={customPrompt}
                   onChange={(e) => onCustomPromptChange(e.target.value)}
                   className="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-sm text-gray-300 font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
               />
               <p className="text-xs text-gray-500 mt-1">Warning: Modifying this prompt may lead to unexpected results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};