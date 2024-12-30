import { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScamReportForm } from "@/components/scam-reports/ScamReportForm";
import { ScamReportTable, type ScamReport } from "@/components/scam-reports/ScamReportTable";

export default function ScamReports() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const { toast } = useToast();

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from("scam_reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch scam reports",
      });
      return;
    }

    setReports(data || []);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scam Reports</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Report Scam</Button>
          </DialogTrigger>
          <ScamReportForm onSuccess={fetchReports} />
        </Dialog>
      </div>
      <ScamReportTable reports={reports} />
    </div>
  );
}