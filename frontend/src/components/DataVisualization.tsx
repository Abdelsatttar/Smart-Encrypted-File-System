"use client";

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DownloadCloud, Shield, HardDrive, ArrowRight } from 'lucide-react';

const COLORS = ['#ef4444', '#10b981']; // Red, Emerald

type FileRecord = {
  id: number;
  sensitivity: "HIGH" | "LOW";
  upload_date: string;
};

type Analytics = {
  total_files: number;
  high_sensitivity_files: number;
  low_sensitivity_files: number;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl z-50">
        <p className="font-semibold text-slate-100 mb-1">{data.name || payload[0].name}</p>
        {data.value !== undefined && data.count !== undefined && (
          <p className="text-sm text-slate-300">
            <span className="text-slate-400">Share:</span> {data.value.toFixed(1)}% / {data.count} Files
          </p>
        )}
        {data.time && (
          <p className="text-sm text-slate-300">
            <span className="text-slate-400">Processing:</span> {data.time}
          </p>
        )}
        {data.status && (
          <p className="text-sm text-slate-300">
            <span className="text-slate-400">Status:</span> 
            <span className={data.status === 'Encrypted' ? 'text-emerald-400 ml-1' : 'text-slate-300 ml-1'}>{data.status}</span>
          </p>
        )}
        {/* Fallback for Tooltip on Bar chart which doesn't use the pie schema */}
        {data.count === undefined && payload.map((p:any) => (
            <p key={p.dataKey} className="text-sm" style={{color: p.color}}>
                {p.name}: {p.value} Files
            </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DataVisualization() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);

  const fetchData = async () => {
    try {
      const [analyticsRes, filesRes] = await Promise.all([
        api.get("/analytics"),
        api.get("/files")
      ]);
      setAnalytics(analyticsRes.data);
      setFiles(filesRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const pieData = useMemo(() => {
    if (!analytics) return [];
    const total = Math.max(1, analytics.total_files);
    return [
      { 
        name: 'High-Sensitivity', 
        value: (analytics.high_sensitivity_files / total) * 100, 
        count: analytics.high_sensitivity_files, 
        time: 'AES Encrypt: ~0.5s', 
        status: 'Encrypted' 
      },
      { 
        name: 'Low-Sensitivity', 
        value: (analytics.low_sensitivity_files / total) * 100, 
        count: analytics.low_sensitivity_files, 
        time: 'Process: ~0.1s', 
        status: 'Standard Storage' 
      },
    ].filter(d => d.count > 0);
  }, [analytics]);

  const barData = useMemo(() => {
    if (!files.length) return [];
    
    const days: Record<string, { name: string, High: number, Low: number }> = {
      "Mon": { name: "Mon", High: 0, Low: 0 },
      "Tue": { name: "Tue", High: 0, Low: 0 },
      "Wed": { name: "Wed", High: 0, Low: 0 },
      "Thu": { name: "Thu", High: 0, Low: 0 },
      "Fri": { name: "Fri", High: 0, Low: 0 },
      "Sat": { name: "Sat", High: 0, Low: 0 },
      "Sun": { name: "Sun", High: 0, Low: 0 },
    };

    files.forEach(file => {
      const date = new Date(file.upload_date + "Z");
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      if (days[dayName]) {
        if (file.sensitivity === "HIGH") days[dayName].High += 1;
        else days[dayName].Low += 1;
      }
    });

    return Object.values(days);
  }, [files]);

  return (
    <div className="space-y-6">
      {/* Visual Workflow Flowchart Style Section */}
      <Card className="bg-slate-900/40 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex flex-col items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex-1 hover:bg-slate-800 transition-colors cursor-default relative group">
               <DownloadCloud className="w-8 h-8 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-medium text-slate-200">1. File Monitor</p>
               <p className="text-xs text-slate-400 text-center mt-1">Classifies files by heuristics</p>
             </div>
             
             <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block animate-pulse" />
             
             <div className="flex flex-col items-center p-4 bg-red-900/10 rounded-xl border border-red-900/30 flex-1 relative overflow-hidden hover:bg-red-900/20 transition-colors cursor-default group">
               <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 blur-xl rounded-full" />
               <Shield className="w-8 h-8 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-medium text-red-200">2. Encryption Module</p>
               <p className="text-xs text-red-400/70 text-center mt-1">Encrypts High-sensitivity data</p>
             </div>

             <ArrowRight className="w-6 h-6 text-slate-600 hidden md:block animate-pulse" />

             <div className="flex flex-col items-center p-4 bg-emerald-900/10 rounded-xl border border-emerald-900/30 flex-1 hover:bg-emerald-900/20 transition-colors cursor-default group">
               <HardDrive className="w-8 h-8 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
               <p className="text-sm font-medium text-emerald-200">3. Secure Storage</p>
               <p className="text-xs text-emerald-400/70 text-center mt-1">Categorized logical partitioning</p>
             </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie/Donut Chart */}
        <Card className="bg-slate-900/40 border-slate-800 h-[350px]">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">Distribution by Sensitivity</CardTitle>
            <CardDescription className="text-slate-400">Ratio of encrypted vs. standard allocations</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {analytics?.total_files === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-500">No files uploaded yet</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'High-Sensitivity' ? COLORS[0] : COLORS[1]} />
                    ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#94a3b8' }}/>
                </PieChart>
                </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="bg-slate-900/40 border-slate-800 h-[350px]">
          <CardHeader>
            <CardTitle className="text-lg text-slate-200">Upload Volume Trends</CardTitle>
            <CardDescription className="text-slate-400">Files processed correctly during operations</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            {files.length === 0 ? (
                 <div className="flex items-center justify-center h-full text-slate-500">No files uploaded yet</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis stroke="#64748b" tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1e293b'}} content={<CustomTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
                    <Bar dataKey="High" name="High Sensitivity" stackId="a" fill="#ef4444" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Low" name="Low Sensitivity" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
