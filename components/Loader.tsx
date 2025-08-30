import React, { useState, useEffect } from 'react';

const messages = [
  "Warming up the AI's creative circuits...",
  "Finding the perfect lighting and shadows...",
  "Rendering pixels with a touch of magic...",
  "Animating the keyframes for your video...",
  "Compositing video layers, this may take a few minutes...",
  "Encoding the final video...",
  "Applying the finishing touches...",
];

export const Loader: React.FC = () => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(prev => {
        const currentIndex = messages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-8">
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent-blue"></div>
      </div>
      <h3 className="mt-6 text-xl font-medium text-text-primary">Generating Your Ad...</h3>
      <p className="mt-2 text-sm text-text-secondary h-5 transition-opacity duration-500">{message}</p>
    </div>
  );
};