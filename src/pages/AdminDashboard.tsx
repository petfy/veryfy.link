import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertOctagon, Store } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingVerifications: 0,
    pendingReports: 0,
    totalStores: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: pendingVerifications }, { count: pendingReports }, { count: totalStores }] =
        await Promise.all([
          supabase
            .from("stores")
            .select("*", { count: "exact" })
            .eq("verification_status", "pending"),
          supabase
            .from("scam_reports")
            .select("*", { count: "exact" })
            .eq("status", "pending"),
          supabase.from("stores").select("*", { count: "exact" }),
        ]);

      setStats({
        pendingVerifications: pendingVerifications || 0,
        pendingReports: pendingReports || 0,
        totalStores: totalStores || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verifications
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertOctagon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
