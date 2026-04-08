"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBadge, ShieldAlert, ShieldCheck, HardDrive } from "lucide-react";
import api from "@/lib/api";

type Analytics = {
  total_files: number;
  encrypted_files: number;
  high_sensitivity_files: number;
  low_sensitivity_files: number;
  total_data_processed_mb: number;
};

export default function AnalyticsCards() {
  const [data, setData] = useState<Analytics | null>(null);

  const fetchAnalytics = () => {
    api.get("/analytics").then((res) => setData(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-800 rounded-xl" />)}
  </div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Total Files</CardTitle>
          <FileBadge className="w-5 h-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.total_files}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Encrypted (HIGH)</CardTitle>
          <ShieldAlert className="w-5 h-5 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.encrypted_files}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Standard (LOW)</CardTitle>
          <ShieldCheck className="w-5 h-5 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.low_sensitivity_files}</div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-400">Data Processed</CardTitle>
          <HardDrive className="w-5 h-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-white">{data.total_data_processed_mb} MB</div>
        </CardContent>
      </Card>
    </div>
  );
}
