import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Store, Document } from "./types";
import { useEffect, useState } from "react";
import { generateVerifyUrl } from "@/lib/verification";
import { supabase } from "@/integrations/supabase/client";

interface StoreVerificationDialogProps {
  store: Store | null;
  documents: Document[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationAction: (storeId: string, status: "verified" | "rejected") => void;
}

export function StoreVerificationDialog({
  store,
  documents,
  isOpen,
  onOpenChange,
  onVerificationAction,
}: StoreVerificationDialogProps) {
  const [badges, setBadges] = useState<any[]>([]);

  const fetchBadges = async (storeId: string) => {
    const { data, error } = await supabase
      .from("verification_badges")
      .select("*")
      .eq("store_id", storeId);

    if (!error && data) {
      setBadges(data);
    }
  };

  useEffect(() => {
    if (store?.id && store.verification_status === "verified") {
      fetchBadges(store.id);
    }
  }, [store]);

  const getBadgeCode = (registrationNumber: string, type: "topbar" | "footer") => {
    const verifyUrl = generateVerifyUrl(registrationNumber);
    const componentName = type === "topbar" ? "VerifyTopBar" : "VerifyFooter";
    
    return `
import { ${componentName} } from '@verify-link/badges';

export default function VerificationBadge() {
  return (
    <${componentName}
      registrationNumber="${registrationNumber}"
      verifyUrl="${verifyUrl}"
    />
  );
}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Store Verification Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[600px] pr-4">
          {store && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Store Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Store Name</p>
                    <p className="font-medium">{store.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">URL</p>
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {store.url}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(store.verification_status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Submission Date
                    </p>
                    <p className="font-medium">
                      {new Date(store.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Verification Documents
                </h3>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium capitalize">
                          {doc.document_type.replace("_", " ")}
                        </p>
                        {getStatusBadge(doc.status)}
                      </div>
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {store.verification_status === "pending" && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={() =>
                      onVerificationAction(store.id, "rejected")
                    }
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={() =>
                      onVerificationAction(store.id, "verified")
                    }
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              )}

              {store.verification_status === "verified" && badges.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Verification Badges</h3>
                  <div className="space-y-4">
                    {badges.map((badge) => (
                      <div key={badge.id} className="p-4 border rounded-lg space-y-2">
                        <p className="font-medium capitalize">
                          {badge.badge_type} Badge - Registration: {badge.registration_number}
                        </p>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                          <code>{getBadgeCode(badge.registration_number, badge.badge_type)}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
