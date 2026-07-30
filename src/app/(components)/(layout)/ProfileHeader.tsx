"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { ExIconDiscord, ExIconTwitch, ExIconX } from "@/app/(components)/ui";
import { userService } from "@/app/(services)/userService";
import type { UserProfile } from "@/features/profile/contracts";
import { toast } from "sonner";
import ImageCropperModal from "@/app/(components)/ui/ImageCropperModal";
import { getCode } from "country-list";

const FALLBACK_BANNER = "/images/byClient/hero.jpg";
const FALLBACK_AVATAR = "/images/byClient/defaultProfile.png";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const getFlagEmoji = (country: string): string => {
  if (!country) return "🌐";
  const overrides: Record<string, string> = {
    USA: "US",
    "United States": "US",
    UK: "GB",
    "United Kingdom": "GB",
    UAE: "AE",
    "United Arab Emirates": "AE",
  };
  const code = overrides[country] || getCode(country) || (country.length === 2 ? country : undefined);
  if (!code) return "🌐";
  const codePoints = code.toUpperCase().split("").map((character) => 127397 + character.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

function socialUrl(value: string, baseUrl?: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : baseUrl
      ? `${baseUrl}${trimmed.replace(/^@/, "")}`
      : "";
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

interface ProfileHeaderProps {
  initialData: UserProfile;
  onUpdate?: () => void | Promise<void>;
}

export default function ProfileHeader({ initialData, onUpdate }: ProfileHeaderProps) {
  const [banner, setBanner] = useState(initialData.coverImage || FALLBACK_BANNER);
  const [avatar, setAvatar] = useState(initialData.profileImage || FALLBACK_AVATAR);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [cropType, setCropType] = useState<"banner" | "avatar">("banner");
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBanner(initialData.coverImage || FALLBACK_BANNER);
    setAvatar(initialData.profileImage || FALLBACK_AVATAR);
  }, [initialData.coverImage, initialData.profileImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, isBanner: boolean) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) {
      toast.error("Upload a valid image smaller than 8 MiB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setCropImageSrc(reader.result);
      setCropType(isBanner ? "banner" : "avatar");
      setCropModalOpen(true);
    };
    reader.onerror = () => toast.error("The selected image could not be read.");
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile: File) => {
    const isBanner = cropType === "banner";
    const previousImage = isBanner ? banner : avatar;
    const preview = await fileToDataUrl(croppedFile).catch(() => null);
    if (!preview) {
      toast.error("The cropped image could not be prepared.");
      return;
    }

    if (isBanner) {
      setBanner(preview);
      setIsUploadingBanner(true);
    } else {
      setAvatar(preview);
      setIsUploadingAvatar(true);
    }

    try {
      const result = await userService.uploadImage(croppedFile, isBanner ? "cover" : "profile");
      if (!result.success) {
        if (isBanner) setBanner(previousImage);
        else setAvatar(previousImage);
        toast.error(result.message || "Failed to upload image.");
        return;
      }

      const storedImage = isBanner ? result.data.coverImage : result.data.profileImage;
      if (storedImage) {
        if (isBanner) setBanner(storedImage);
        else setAvatar(storedImage);
      }
      window.dispatchEvent(new CustomEvent("profileUpdate", {
        detail: isBanner ? { coverImage: storedImage } : { profileImage: storedImage },
      }));
      toast.success(`${isBanner ? "Banner" : "Profile picture"} updated successfully.`);
      await onUpdate?.();
      setCropModalOpen(false);
    } finally {
      if (isBanner) setIsUploadingBanner(false);
      else setIsUploadingAvatar(false);
    }
  };

  const displayName = initialData.username
    || [initialData.firstName, initialData.lastName].filter(Boolean).join(" ")
    || "Player";
  const location = [initialData.city, initialData.country].filter(Boolean).join(", ");
  const socialCandidates: Array<{ label: string; href: string | null; icon: ReactNode }> = [
    { label: "Twitch", href: socialUrl(initialData.twitchLink, "https://twitch.tv/"), icon: <ExIconTwitch size={20} /> },
    { label: "Discord", href: socialUrl(initialData.discordLink), icon: <ExIconDiscord size={20} /> },
    { label: "X", href: socialUrl(initialData.xLink, "https://x.com/"), icon: <ExIconX size={18} /> },
  ];
  const socials = socialCandidates.filter(
    (item): item is { label: string; href: string; icon: ReactNode } => item.href !== null,
  );

  return (
    <section className="relative w-full overflow-hidden rounded-xl border border-white/5 bg-[#0c0a11]" aria-labelledby="profile-name">
      <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(event) => handleFileChange(event, true)} />
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(event) => handleFileChange(event, false)} />

      <div className="relative h-64 w-full sm:h-80">
        <Image src={banner} alt="Profile banner" fill sizes="(max-width: 1024px) 100vw, 896px" className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-linear-to-t from-[#0c0a11] via-transparent to-transparent" />
        <button
          type="button"
          className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => bannerInputRef.current?.click()}
          disabled={isUploadingBanner}
        >
          {isUploadingBanner ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Camera size={16} aria-hidden="true" />}
          {isUploadingBanner ? "Uploading…" : "Change banner"}
        </button>
      </div>

      <div className="relative px-6 pb-6 pt-0 sm:px-12">
        <div className="flex flex-col items-center gap-6 sm:-mt-16 sm:flex-row sm:items-end sm:gap-8">
          <div className="group relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-[#0c0a11] bg-gray-800 shadow-2xl sm:h-40 sm:w-40">
            <Image src={avatar} alt={`${displayName} profile picture`} fill sizes="160px" className="object-cover" />
            <button
              type="button"
              aria-label="Change profile picture"
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? <Loader2 size={24} className="animate-spin text-white" aria-hidden="true" /> : <Camera size={24} className="text-white" aria-hidden="true" />}
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:pb-2 sm:text-left">
            <h1 id="profile-name" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{displayName}</h1>
            {location ? (
              <div className="mt-2 flex items-baseline gap-2 text-gray-400">
                <span className="text-sm font-medium">{location}</span>
                <span className="text-sm" title={initialData.country || "Location"} aria-label={initialData.country || "Location not specified"}>
                  {getFlagEmoji(initialData.country)}
                </span>
              </div>
            ) : null}
            {socials.length ? (
              <div className="mt-4 flex items-center gap-4 text-gray-400" aria-label="Social profiles">
                {socials.map((social) => (
                  <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${social.label} profile`} className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
                    {social.icon}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <ImageCropperModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={cropType === "banner" ? 3 : 1}
        isUploading={isUploadingBanner || isUploadingAvatar}
      />
    </section>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Invalid file result"));
    reader.onerror = () => reject(reader.error ?? new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}
