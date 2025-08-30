import React from 'react';

interface HeaderProps {
  creationsCount: number;
  onToggleGallery: () => void;
  userCredits: number;
  onBuyCreditsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ creationsCount, onToggleGallery, userCredits, onBuyCreditsClick }) => {
  return (
    <header className="bg-dark-card/80 backdrop-blur-sm sticky top-0 z-20 border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <svg className="w-8 h-8 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <h1 className="text-xl font-medium text-text-primary tracking-tight">
              Ads <span className="font-normal text-text-secondary">Studio</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-dark-bg rounded-full py-1.5 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v.09C8.336 6.585 8 7.234 8 8s.336 1.415.91 1.91V11a1 1 0 102 0v-1.09c.574-.495.91-1.144.91-1.91s-.336-1.415-.91-1.91V6zM9 14a1 1 0 112 0 1 1 0 01-2 0z" /></svg>
                <span className="text-text-primary font-medium text-sm">{userCredits} Credits</span>
            </div>
             <button
              onClick={onBuyCreditsClick}
              className="bg-accent-green hover:opacity-90 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-opacity duration-200 flex items-center space-x-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
              <span>Buy Credits</span>
            </button>
            <button
              onClick={onToggleGallery}
              className="relative bg-dark-bg hover:bg-dark-card text-text-primary font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2 0v10h10V5H5z" clipRule="evenodd" /></svg>
              <span>My Creations</span>
              {creationsCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-blue text-xs font-bold text-dark-bg ring-2 ring-dark-card">
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