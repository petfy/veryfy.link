import { Badge } from "@/components/ui/badge";

interface StoreDetailsSectionProps {
  store: {
    name: string;
    url: string;
    verification_status: string;
    created_at: string;
  };
}

export function StoreDetailsSection({ store }: StoreDetailsSectionProps) {
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
          <p className="text-sm text-muted-foreground">Submission Date</p>
          <p className="font-medium">
            {new Date(store.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}