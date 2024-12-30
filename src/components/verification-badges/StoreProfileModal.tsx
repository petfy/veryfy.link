import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Store } from "../store-verifications/types";

interface StoreProfileModalProps {
  store: Store | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isPreview?: boolean;
  position?: "top" | "bottom";
}

const demoStore: Store = {
  id: "demo-id",
  user_id: "demo-user",
  name: "Demo Store",
  url: "https://demo-store.com",
  verification_status: "verified",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
  logo_url: null
};

export function StoreProfileModal({ 
  store, 
  isOpen, 
  onOpenChange, 
  isPreview = false,
  position = "top" 
}: StoreProfileModalProps) {
  console.log("StoreProfileModal rendered with:", {
    store,
    isOpen,
    isPreview
  });

  const displayStore = isPreview ? demoStore : store;

  if (!displayStore) {
    console.log("No store data available");
    return null;
  }

  const modalPosition = position === "bottom" ? "bottom-full mb-1" : "top-full mt-1";

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="w-full transition-all duration-500 ease-in-out"
    >
      <CollapsibleContent 
        className={`absolute ${modalPosition} left-0 right-0 bg-white border shadow-lg py-6 px-4 space-y-4 z-[60] data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up`}
      >
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
              {displayStore.logo_url ? (
                <img src={displayStore.logo_url} alt={displayStore.name} className="object-cover" />
              ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-2xl font-semibold">
                  {displayStore.name[0]}
                </div>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{displayStore.name}</h3>
              <a 
                href={displayStore.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {displayStore.url}
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
                  Status: {displayStore.verification_status}
                </p>
                <p className="text-sm text-muted-foreground">
                  Verified since: {new Date(displayStore.created_at).toLocaleDateString()}
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