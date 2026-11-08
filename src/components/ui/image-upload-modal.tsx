"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Camera, UploadCloud, RotateCcw, Check, Loader2, Video, AlertCircle } from "lucide-react";
import { Modal } from "./modal";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { uploadStoreAsset, AssetFolder } from "@/lib/storage/image-storage-service";
import { useLanguage } from "@/lib/i18n/language-context";

export interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUploaded: (url: string) => void;
  folder: AssetFolder;
  storeSlug: string;
  title?: string;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen, onClose, onImageUploaded, folder, storeSlug, title,
}) => {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [tab, setTab] = useState<"upload" | "camera">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsStreaming(false);
  }, []);

  const clearSelection = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
  }, [previewUrl]);

  const handleClose = useCallback(() => {
    if (isUploading) return;
    stopCamera();
    clearSelection();
    onClose();
  }, [isUploading, stopCamera, clearSelection, onClose]);

  useEffect(() => {
    if (!isOpen) { stopCamera(); clearSelection(); }
  }, [isOpen, stopCamera, clearSelection]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(isAr ? "يرجى اختيار ملف صورة صالح" : "Please select an image file");
      return;
    }
    stopCamera();
    clearSelection();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const startLiveCamera = async () => {
    try {
      stopCamera();
      if (!navigator?.mediaDevices?.getUserMedia) throw new Error();
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
      setIsStreaming(true);
      setError(null);
    } catch {
      setIsStreaming(false);
      cameraInputRef.current?.click();
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const cvs = document.createElement("canvas");
    cvs.width = v.videoWidth || 640;
    cvs.height = v.videoHeight || 480;
    cvs.getContext("2d")?.drawImage(v, 0, 0, cvs.width, cvs.height);
    cvs.toBlob((b) => {
      if (b) handleFile(new File([b], `snap_${Date.now()}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.85);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadStoreAsset(selectedFile, folder, storeSlug);
      onImageUploaded(url);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : isAr ? "فشل الرفع" : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title || (isAr ? "رفع صورة" : "Upload Image")}>
      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" /><span className="text-start">{error}</span>
          </div>
        )}
        {previewUrl ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 min-h-[200px] max-h-64 flex items-center justify-center p-2">
              <img src={previewUrl} alt="Preview" className="max-h-60 max-w-full object-contain rounded-xl" />
            </div>
            {isUploading ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-700 dark:text-brand-300 text-sm font-medium">
                <Loader2 className="w-5 h-5 animate-spin" /><span>{isAr ? "جارٍ ضغط ورفع الصورة..." : "Compressing and uploading..."}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button type="button" onClick={handleUpload} className="flex-1 gap-2"><Check className="w-5 h-5" /><span>{isAr ? "تأكيد الرفع" : "Confirm Upload"}</span></Button>
                <Button type="button" variant="outline" onClick={clearSelection} className="gap-2"><RotateCcw className="w-4 h-4" /><span>{isAr ? "إعادة" : "Retake"}</span></Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
              <button type="button" onClick={() => { stopCamera(); setTab("upload"); }} className={cn("flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg min-h-[44px]", tab === "upload" ? "bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 shadow-xs" : "text-neutral-500")}>
                <UploadCloud className="w-4 h-4" /><span>{isAr ? "رفع من الجهاز" : "Upload File"}</span>
              </button>
              <button type="button" onClick={() => setTab("camera")} className={cn("flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg min-h-[44px]", tab === "camera" ? "bg-white dark:bg-neutral-900 text-brand-600 dark:text-brand-400 shadow-xs" : "text-neutral-500")}>
                <Camera className="w-4 h-4" /><span>{isAr ? "الكاميرا" : "Camera"}</span>
              </button>
            </div>
            {tab === "upload" ? (
              <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }} onClick={() => fileInputRef.current?.click()} className={cn("flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer text-center min-h-[190px]", isDragging ? "border-brand-500 bg-brand-50/50" : "border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40")}>
                <UploadCloud className="w-10 h-10 text-neutral-400 mb-2" /><p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{isAr ? "اضغط لاختيار صورة أو اسحبها هنا" : "Click to select or drag image here"}</p>
                <p className="text-xs text-neutral-400 mt-1">{isAr ? "حد أقصى 5 ميجابايت (PNG, JPG, WebP)" : "Max 5MB (PNG, JPG, WebP)"}</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
            ) : isStreaming ? (
              <div className="space-y-3">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-52 object-cover rounded-2xl bg-black" />
                <Button type="button" onClick={takeSnapshot} className="w-full gap-2 min-h-[44px]"><Camera className="w-5 h-5" /><span>{isAr ? "التقاط الصورة" : "Capture Photo"}</span></Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/40 space-y-3 text-center">
                <Camera className="w-10 h-10 text-brand-600 dark:text-brand-400" /><p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{isAr ? "التقاط صورة عبر الكاميرا" : "Capture with camera"}</p>
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                  <Button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-1 gap-2"><Camera className="w-4 h-4" /><span>{isAr ? "فتح الكاميرا" : "Open Camera"}</span></Button>
                  <Button type="button" variant="outline" onClick={startLiveCamera} className="flex-1 gap-2"><Video className="w-4 h-4" /><span>{isAr ? "معاينة حية" : "Live Stream"}</span></Button>
                </div>
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
