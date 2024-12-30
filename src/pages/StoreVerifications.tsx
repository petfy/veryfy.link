import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StoreVerificationsTable } from "@/components/store-verifications/StoreVerificationsTable";
import { StoreVerificationDialog } from "@/components/store-verifications/StoreVerificationDialog";
import type { Store, Document } from "@/components/store-verifications/types";

export default function StoreVerifications() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchStores = async () => {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch stores",
      });
      return;
    }

    setStores(data || []);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchDocuments = async (storeId: string) => {
    const { data, error } = await supabase
      .from("verification_documents")
      .select("*")
      .eq("store_id", storeId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch documents",
      });
      return;
    }

    setDocuments(data || []);
  };

  const handleViewDetails = async (store: Store) => {
    setSelectedStore(store);
    await fetchDocuments(store.id);
    setIsDialogOpen(true);
  };

  const handleVerificationAction = async (
    storeId: string,
    status: "verified" | "rejected"
  ) => {
    const { error } = await supabase
      .from("stores")
      .update({ verification_status: status })
      .eq("id", storeId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${status} store`,
      });
      return;
    }

    toast({
      title: "Success",
      description: `Store ${status} successfully`,
    });

    setIsDialogOpen(false);
    fetchStores();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Store Verifications</h1>
        <Badge variant="secondary" className="text-sm">
          <ShieldCheck className="w-4 h-4 mr-1" />
          {stores.filter((s) => s.verification_status === "pending").length}{" "}
          Pending
        </Badge>
      </div>

      <StoreVerificationsTable
        stores={stores}
        onViewDetails={handleViewDetails}
      />

      <StoreVerificationDialog
        store={selectedStore}
        documents={documents}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onVerificationAction={handleVerificationAction}
      />
    </div>
  );
}