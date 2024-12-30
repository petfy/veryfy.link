import { Check, ShoppingBag } from "lucide-react";

interface VerifyFooterProps {
  registrationNumber: string;
  verifyUrl: string;
}

export function VerifyFooter({ registrationNumber, verifyUrl }: VerifyFooterProps) {
  return (
    <div className="flex items-center justify-center p-2 bg-gradient-to-r from-white via-green-50 to-white border-t">
      <div className="flex items-center space-x-2">
        <Check className="h-4 w-4 text-green-600" />
        <span className="text-xs font-medium text-gray-700 flex items-center">
          Verified by{' '}
          <a 
            href="https://verify.link" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-green-600 hover:text-green-800 transition-colors duration-300 mx-1"
          >
            Verify.link
          </a>
          <span className="text-gray-500 flex items-center">
            <ShoppingBag className="h-4 w-4 mx-1 text-blue-600" />
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
  );
}