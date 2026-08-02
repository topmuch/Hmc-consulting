"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type UploadState = "idle" | "uploading" | "success" | "error";

type FileUploadProps = {
  /** Called when a file is uploaded successfully */
  onUploadComplete?: (url: string, filename: string) => void;
  /** Accepted file types (MIME types), defaults to common types */
  accept?: string;
  /** Whether the upload is disabled */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
};

export function FileUpload({
  onUploadComplete,
  accept = "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv",
  disabled = false,
  className,
}: FileUploadProps) {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const resetState = useCallback(() => {
    setState("idle");
    setProgress(0);
    setPreviewUrl(null);
    setFileName(null);
    setIsImage(false);
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (disabled) return;

      // Reset
      resetState();
      setFileName(file.name);

      // Check if it's an image for preview
      const imageType = file.type.startsWith("image/");
      setIsImage(imageType);

      // Create preview for images
      if (imageType) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      // Start upload
      setState("uploading");
      setProgress(10);

      try {
        const formData = new FormData();
        formData.append("file", file);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 15;
          });
        }, 200);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data?.error || "Échec de l'upload");
        }

        setProgress(100);
        setState("success");
        toast({
          title: "Fichier uploadé",
          description: `${file.name} a été téléchargé avec succès.`,
        });
        onUploadComplete?.(data.url, data.filename);
      } catch (err) {
        setState("error");
        setProgress(0);
        toast({
          title: "Erreur d'upload",
          description:
            err instanceof Error ? err.message : "Impossible d'uploader le fichier.",
          variant: "destructive",
        });
      }
    },
    [disabled, resetState, onUploadComplete, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input value so same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    },
    [handleFile]
  );

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer",
          dragOver
            ? "border-sky bg-sky/5"
            : "border-border hover:border-sky/50 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed",
          state === "success" && "border-emerald-500/50 bg-emerald-500/5",
          state === "error" && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Preview or icon */}
        {state === "idle" && (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Glissez-déposez un fichier ici
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ou cliquez pour parcourir
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Images, PDF, documents, tableurs — Max 10 Mo
            </p>
          </>
        )}

        {state === "uploading" && (
          <div className="w-full space-y-3">
            {/* File preview */}
            {isImage && previewUrl ? (
              <div className="relative mx-auto h-24 w-24 rounded-lg overflow-hidden border border-border">
                <Image
                  src={previewUrl}
                  alt="Aperçu"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <p className="text-sm font-medium text-foreground truncate max-w-xs mx-auto">
              {fileName}
            </p>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Upload en cours… {progress}%
            </p>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-2">
            {isImage && previewUrl ? (
              <div className="relative mx-auto h-24 w-24 rounded-lg overflow-hidden border border-emerald-500/30">
                <Image
                  src={previewUrl}
                  alt="Aperçu"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 mx-auto">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            )}
            <div className="flex items-center gap-1.5 justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-600">
                Fichier uploadé avec succès
              </p>
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-xs mx-auto">
              {fileName}
            </p>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mx-auto">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-sm font-medium text-destructive">
              Échec de l&apos;upload
            </p>
            <p className="text-xs text-muted-foreground">
              Veuillez réessayer avec un fichier valide.
            </p>
          </div>
        )}
      </div>

      {/* Actions after upload */}
      {(state === "success" || state === "error") && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              resetState();
            }}
          >
            {state === "success" ? "Uploader un autre fichier" : "Réessayer"}
          </Button>
        </div>
      )}
    </div>
  );
}
