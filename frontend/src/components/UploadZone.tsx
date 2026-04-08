"use client";
import { useCallback, useState } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import { motion } from "framer-motion";

export default function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStatus("idle");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (e) {
      console.error(e);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
        isDragOver ? "border-blue-500 bg-blue-500/10 scale-[1.01]" : "border-slate-700 bg-slate-900/50 hover:bg-slate-900"
      }`}
    >
      <input
        type="file"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      
      <div className="flex flex-col items-center space-y-4 pointer-events-none">
        {uploadStatus === "success" ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </motion.div>
        ) : (
          <UploadCloud className={`w-16 h-16 ${isUploading ? "text-blue-500 animate-bounce" : "text-slate-400"}`} />
        )}
        <div className="text-center">
          <p className="text-lg font-medium text-slate-200">
            {isUploading ? "Uploading & Encrypting..." : uploadStatus === "success" ? "Upload Complete!" : "Drag & Drop your files here"}
          </p>
          {!isUploading && uploadStatus !== "success" && (
            <p className="text-sm text-slate-500 mt-1">or click to browse local files</p>
          )}
        </div>
      </div>
    </div>
  );
}
