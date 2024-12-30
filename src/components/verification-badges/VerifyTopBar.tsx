import { useState, useEffect } from "react";
import { Check, X, ShoppingBag } from "lucide-react";

interface VerifyTopBarProps {
  registrationNumber: string;
  verifyUrl: string;
  isPreview?: boolean;
}

export function VerifyTopBar({ registrationNumber, verifyUrl, isPreview = false }: VerifyTopBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isPreview) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [isPreview]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-0 left-0 w-full bg-gradient-to-r from-white via-green-50 to-white shadow-lg z-50"
      style={{
        height: '40px',
        animation: isPreview ? undefined : 'fadeOut 0.5s ease-out 20s forwards',
        transition: 'all 0.3s ease'
      }}
    >
      {!isPreview && (
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="max-w-4xl mx-auto h-full flex items-center justify-center px-4">
        <div className="flex items-center space-x-2 animate-slide-in-left">
          <Check className="h-4 w-4 text-green-600 opacity-0 animate-appear" />

          <span className="text-xs font-medium text-gray-700 opacity-0 animate-appear flex items-center flex-wrap">
            Verified Official Store by{' '}
            <a 
              href="https://veryfy.link" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-green-600 hover:text-green-800 transition-colors duration-300 mx-1"
            >
              Veryfy
            </a>
            <span className="text-gray-500 flex items-center">
              Shop with confidence{' '}
              <ShoppingBag className="h-4 w-4 ml-1 animate-bounce text-blue-600" />
            </span>
            {' | '}
            <span className="text-gray-700 font-bold mx-1">
              Registration: {registrationNumber}
            </span>
            {' '}
            <a 
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              Verify
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}