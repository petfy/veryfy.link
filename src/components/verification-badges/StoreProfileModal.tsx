import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { Store } from "../store-verifications/types";

interface StoreProfileModalProps {
  store: Store | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoreProfileModal({ store, isOpen, onOpenChange }: StoreProfileModalProps) {
  if (!store) return null;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="w-full transition-all duration-300 ease-in-out"
    >
      <CollapsibleContent className="bg-white border-t border-b shadow-lg py-6 px-4 space-y-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
        <div className="max-w-4xl mx-auto">
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
          <div className="mt-4 space-y-2">
            <Badge variant="secondary" className="mb-2">
              Verified Store
            </Badge>
            <p className="text-sm text-muted-foreground">
              This store has been verified by Veryfy and meets our security and trust standards.
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}