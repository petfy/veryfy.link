import { Badge } from "@/components/ui/badge";
import { Document } from "../store-verifications/types";

interface DocumentsSectionProps {
  documents: Document[];
}

export function DocumentsSection({ documents }: DocumentsSectionProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "default",
      verified: "secondary",
      rejected: "destructive",
    };

    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Verification Documents</h3>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="p-4 border rounded-lg space-y-2">
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
  );
}