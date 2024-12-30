import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Store } from "../store-verifications/types";

interface StoreProfileModalProps {
  store: Store | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoreProfileModal({ store, isOpen, onOpenChange }: StoreProfileModalProps) {
  console.log("StoreProfileModal rendered with:", {
    store,
    isOpen,
  });

  if (!store) {
    console.log("No store data available");
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="w-full transition-all duration-500 ease-in-out"
    >
      <CollapsibleContent className="bg-white border-t border-b shadow-lg py-6 px-4 space-y-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close details"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>

          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.name} className="object-cover" />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-2xl font-semibold">
                  {store.name[0]}
                </div>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{store.name}</h3>
              <a 
                href={store.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {store.url}
              </a>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-2">Verification Details</h4>
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                  Verified Store
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Status: {store.verification_status}
                </p>
                <p className="text-sm text-muted-foreground">
                  Verified since: {new Date(store.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Store Information</h4>
              <p className="text-sm text-muted-foreground">
                This store has been verified by Veryfy and meets our security and trust standards.
              </p>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}