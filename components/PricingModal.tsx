import React, { useEffect, useCallback, useState } from 'react';

interface PricingModalProps {
  onClose: () => void;
  onPurchase: (credits: number, paymentToken: string) => void;
}

const pricingTiers = [
    { credits: 50, price: 5, popular: false },
    { credits: 250, price: 20, popular: true },
    { credits: 1000, price: 75, popular: false },
];

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onPurchase }) => {
  const [selectedTier, setSelectedTier] = useState(pricingTiers[1]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real Stripe integration, you would use Stripe.js here to
    // securely create a token from the user's card details.
    // We'll simulate that by creating a fake token.
    const fakePaymentToken = `tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate payment processing
    setTimeout(() => {
        onPurchase(selectedTier.credits, fakePaymentToken);
        setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
        </button>
        <div className="p-8 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Buy More Credits</h2>
                <p className="text-gray-400 mt-2">Choose a package that suits your needs. Credits never expire.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {pricingTiers.map(tier => (
                    <div 
                        key={tier.credits}
                        onClick={() => setSelectedTier(tier)}
                        className={`relative text-center p-4 rounded-xl cursor-pointer border-2 transition-all ${selectedTier.credits === tier.credits ? 'border-indigo-500 bg-indigo-900/40' : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'}`}
                    >
                        {tier.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>}
                        <p className="text-2xl font-bold text-white">{tier.credits}</p>
                        <p className="text-sm text-gray-400">Credits</p>
                        <p className="mt-2 text-lg font-semibold text-green-400">${tier.price}</p>
                    </div>
                ))}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-400">Card Number</label>
                    <input type="text" id="card-number" placeholder="0000 0000 0000 0000" className="mt-1 w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-400">Expiry</label>
                        <input type="text" id="expiry" placeholder="MM / YY" className="mt-1 w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                     <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-400">CVC</label>
                        <input type="text" id="cvc" placeholder="123" className="mt-1 w-full bg-gray-900/50 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                </div>
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-900/50 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        `Pay $${selectedTier.price} and get ${selectedTier.credits} credits`
                    )}
                </button>
                <p className="text-xs text-gray-500 text-center">This is a mock payment form for demonstration purposes.</p>
            </form>
        </div>
      </div>
    </div>
  );
};