import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Store, Document } from "./types";
import { useEffect, useState } from "react";
import { generateVerifyUrl } from "@/lib/verification";
import { supabase } from "@/integrations/supabase/client";
import { VerifyTopBar } from "../verification-badges";
import { VerifyFooter } from "../verification-badges";
import { BadgeCodeDisplay } from "../verification-badges/BadgeCodeDisplay";
import { StoreDetailsSection } from "../verification-badges/StoreDetailsSection";
import { DocumentsSection } from "../verification-badges/DocumentsSection";

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
    const { data: verificationData } = await supabase
      .from("stores")
      .select(`
        verification_badges (
          id,
          registration_number,
          badge_type
        )
      `)
      .eq("id", storeId)
      .single();

    if (verificationData?.verification_badges) {
      setBadges(verificationData.verification_badges);
    }
  };

  useEffect(() => {
    if (store?.id && store.verification_status === "verified") {
      fetchBadges(store.id);
    }
  }, [store]);

  const getBadgeCode = (registrationNumber: string, type: "topbar" | "footer") => {
    const verifyUrl = generateVerifyUrl(registrationNumber);
    
    const code = `<!-- Veryfy ${type === "topbar" ? "Top Bar" : "Footer"} Badge -->
<script>
  (function() {
    // Create container element
    const container = document.createElement('div');
    container.id = 'verify-link-${type}';
    ${type === "topbar" ? "document.body.insertBefore(container, document.body.firstChild);" : "document.body.appendChild(container);"}
    
    // Load Verify.link badge script
    const script = document.createElement('script');
    script.src = 'https://veryfy.link/badge/${type}.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-registration', '${registrationNumber}');
    script.setAttribute('data-verify-url', '${verifyUrl}');
    document.head.appendChild(script);
  })();
</script>`;

    return code;
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
              <StoreDetailsSection store={store} />
              <DocumentsSection documents={documents} />

              {store.verification_status === "pending" && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => onVerificationAction(store.id, "rejected")}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button onClick={() => onVerificationAction(store.id, "verified")}>
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              )}

              {store.verification_status === "verified" && badges.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Verification Badges</h3>
                  <div className="space-y-6">
                    {badges.map((badge) => (
                      <BadgeCodeDisplay
                        key={badge.id}
                        title={`${badge.badge_type} Badge - Registration: ${badge.registration_number}`}
                        code={getBadgeCode(badge.registration_number, badge.badge_type)}
                        preview={
                          badge.badge_type === "topbar" ? (
                            <div className="w-full">
                              <VerifyTopBar
                                registrationNumber={badge.registration_number}
                                verifyUrl={generateVerifyUrl(badge.registration_number)}
                              />
                            </div>
                          ) : (
                            <VerifyFooter
                              registrationNumber={badge.registration_number}
                              verifyUrl={generateVerifyUrl(badge.registration_number)}
                            />
                          )
                        }
                      />
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