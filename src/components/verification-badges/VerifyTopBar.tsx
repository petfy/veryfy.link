import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StoreProfileModal } from "./StoreProfileModal";
import type { Store } from "../store-verifications/types";

interface VerifyTopBarProps {
  registrationNumber: string;
  verifyUrl: string;
  isPreview?: boolean;
}

export function VerifyTopBar({ registrationNumber, verifyUrl, isPreview = false }: VerifyTopBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [store, setStore] = useState<Store | null>(null);

  const fetchStoreProfile = async () => {
    const { data: badges } = await supabase
      .from("verification_badges")
      .select("store_id")
      .eq("registration_number", registrationNumber)
      .single();

    if (badges?.store_id) {
      const { data: storeData } = await supabase
        .from("stores")
        .select("*")
        .eq("id", badges.store_id)
        .single();

      if (storeData) {
        setStore(storeData);
      }
    }
  };

  useEffect(() => {
    if (!isPreview) {
      fetchStoreProfile();
    }
  }, [isPreview, registrationNumber]);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="w-full bg-gradient-to-r from-white via-green-50 to-white shadow-lg"
        style={{
          height: '40px',
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
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors ml-1"
                >
                  Check Store
                </button>
              </span>
              {' | '}
              <span className="text-gray-700 font-bold mx-1">
                Registration: {registrationNumber}
              </span>
            </span>
          </div>
        </div>
      </div>

      <StoreProfileModal
        store={store}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}