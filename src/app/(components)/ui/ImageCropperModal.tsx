"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import { Loader2, X } from "lucide-react";
import getCroppedImg from "@/app/(utils)/cropImage";

type CropArea = { x: number; y: number; width: number; height: number };

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio: number;
  isUploading: boolean;
}

const FOCUSABLE_SELECTOR = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ImageCropperModal({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio,
  isUploading,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [saveError, setSaveError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const zoomId = React.useId();

  const handleCropComplete = useCallback((_area: CropArea, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isUploading) {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [isOpen, isUploading, onClose]);

  async function handleSave() {
    if (!croppedAreaPixels) return;
    setSaveError("");
    try {
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImageFile) throw new Error("The image could not be cropped.");
      onCropComplete(croppedImageFile);
    } catch {
      setSaveError("We could not process this image. Choose another file or try again.");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl rounded-xl border border-white/10 bg-[#0c0a11] p-6 shadow-2xl"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close image editor"
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          disabled={isUploading}
        >
          <X aria-hidden="true" size={24} />
        </button>

        <h2 id={titleId} className="mb-4 text-xl font-bold text-white">Adjust image</h2>

        <div className="relative h-[min(400px,55vh)] w-full overflow-hidden rounded-lg bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <label id={zoomId} htmlFor={`${zoomId}-control`} className="text-sm font-medium text-gray-400">Zoom</label>
            <input
              id={`${zoomId}-control`}
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby={zoomId}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isUploading} className="rounded-lg px-4 py-2 font-medium text-gray-300 transition-colors hover:bg-white/5 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" onClick={() => void handleSave()} disabled={isUploading || !croppedAreaPixels} className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
              {isUploading ? <Loader2 aria-hidden="true" size={16} className="animate-spin motion-reduce:animate-none" /> : null}
              {isUploading ? "Uploading…" : "Save image"}
            </button>
          </div>
        </div>
        {saveError ? <p role="alert" className="mt-4 text-sm text-orange-400">{saveError}</p> : null}
      </div>
    </div>
  );
}
