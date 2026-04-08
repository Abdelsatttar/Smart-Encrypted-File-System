"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type FileRecord = {
  id: number;
  filename: string;
  original_size: number;
  sensitivity: "HIGH" | "LOW";
  is_encrypted: number;
  upload_date: string;
};

export default function FileList() {
  const [files, setFiles] = useState<FileRecord[]>([]);

  const fetchFiles = () => {
    api.get("/files").then((res) => setFiles(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-slate-950">
          <TableRow className="border-slate-800 hover:bg-slate-950/50">
            <TableHead className="text-slate-400 font-medium py-4">Filename</TableHead>
            <TableHead className="text-slate-400 font-medium py-4">Size (KB)</TableHead>
            <TableHead className="text-slate-400 font-medium py-4">Classification</TableHead>
            <TableHead className="text-slate-400 font-medium py-4">Status</TableHead>
            <TableHead className="text-slate-400 font-medium py-4 text-right">Upload Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id} className="border-slate-800 hover:bg-slate-800/80 transition-colors">
              <TableCell className="font-medium text-slate-200">{file.filename}</TableCell>
              <TableCell className="text-slate-400">{(file.original_size / 1024).toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={file.sensitivity === "HIGH" ? "text-red-400 border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]" : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"}>
                  {file.sensitivity}
                </Badge>
              </TableCell>
              <TableCell>
                {file.is_encrypted ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]">Encrypted</Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-800/50">Standard</Badge>
                )}
              </TableCell>
              <TableCell className="text-slate-400 text-right">
                {new Date(file.upload_date + "Z").toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
          {files.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                No files have been encrypted or stored yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
