
import React from 'react';

interface HeaderProps {
  creationsCount: number;
  onToggleGallery: () => void;
  userCredits: number;
  onBuyCreditsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ creationsCount, onToggleGallery, userCredits, onBuyCreditsClick }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
             <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Ads <span className="text-indigo-400">Studio</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-800/60 rounded-full py-2 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
                <span className="text-white font-semibold">{userCredits} Credits</span>
            </div>
             <button
              onClick={onBuyCreditsClick}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>
              <span>Buy Credits</span>
            </button>
            <button
              onClick={onToggleGallery}
              className="relative bg-gray-700/50 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>My Creations</span>
              {creationsCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white ring-2 ring-gray-800">
                  {creationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};