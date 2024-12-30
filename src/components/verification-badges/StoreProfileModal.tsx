import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Store } from "../store-verifications/types";

interface StoreProfileModalProps {
  store: Store | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoreProfileModal({ store, isOpen, onOpenChange }: StoreProfileModalProps) {
  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verified Store Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <div className="space-y-2">
            <Badge variant="secondary" className="mb-2">
              Verified Store
            </Badge>
            <p className="text-sm text-muted-foreground">
              This store has been verified by Veryfy and meets our security and trust standards.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}