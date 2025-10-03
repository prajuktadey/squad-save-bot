import { useState, useEffect } from 'react';
import pixelMascot from '@/assets/pixel-mascot.png';

interface PixelMascotProps {
  message?: string;
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const genZMessages = [
  "hey bestie, ready to save?",
  "money moves incoming", 
  "you're about to slay those goals",
  "no cap, let's get this bag",
  "savings era activated"
];

export const PixelMascot = ({ 
  message, 
  isAnimating = false, 
  size = 'md' 
}: PixelMascotProps) => {
  const [currentMessage, setCurrentMessage] = useState(message || genZMessages[0]);
  const [showMessage, setShowMessage] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16', 
    lg: 'w-24 h-24'
  };

  useEffect(() => {
    if (isAnimating) {
      const randomMessage = genZMessages[Math.floor(Math.random() * genZMessages.length)];
      setCurrentMessage(randomMessage);
      setShowMessage(true);
      
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className="relative inline-flex flex-col items-center">
      <div 
        className={`${sizeClasses[size]} pixel-glow transition-all duration-300 ${
          isAnimating ? 'animate-bounce-party' : 'animate-pixel-pulse'
        }`}
      >
        <img 
          src={pixelMascot} 
          alt="squad save bot mascot"
          className="w-full h-full object-contain pixelated"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
      
      {showMessage && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 animate-slide-up">
          <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap shadow-lg">
            {currentMessage}
          </div>
        </div>
      )}
    </div>
  );
};