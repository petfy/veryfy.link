import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Eye, ShieldCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Store = {
  id: string;
  name: string;
  url: string;
  verification_status: string;
  created_at: string;
  user_id: string;
};

type Document = {
  id: string;
  document_type: string;
  document_url: string;
  status: string;
};

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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "default",
      verified: "secondary",
      rejected: "destructive",
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>
                  <a
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {store.url}
                  </a>
                </TableCell>
                <TableCell>{getStatusBadge(store.verification_status)}</TableCell>
                <TableCell>
                  {new Date(store.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(store)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Store Verification Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[600px] pr-4">
            {selectedStore && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Store Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Store Name</p>
                      <p className="font-medium">{selectedStore.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">URL</p>
                      <a
                        href={selectedStore.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {selectedStore.url}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      {getStatusBadge(selectedStore.verification_status)}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Submission Date
                      </p>
                      <p className="font-medium">
                        {new Date(selectedStore.created_at).toLocaleDateString()}
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

                {selectedStore.verification_status === "pending" && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleVerificationAction(selectedStore.id, "rejected")
                      }
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      onClick={() =>
                        handleVerificationAction(selectedStore.id, "verified")
                      }
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}