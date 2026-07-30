"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { ExIconX, ExIconDiscord, ExIconTwitch } from "@/app/(components)/ui";
import { userService } from "@/app/(services)/userService";
import { toast } from "sonner";
import ImageCropperModal from "@/app/(components)/ui/ImageCropperModal";
import { getCode } from "country-list";

/**
 * Helper to convert a country code (e.g., "CA", "US") or common country name 
 * to its corresponding flag emoji.
 */
const getFlagEmoji = (country: string) => {
  if (!country) return "🇨🇦"; // Default to Canada flag
  
  // Mapping for common abbreviations or names that might not be in the ISO list
  const overrides: Record<string, string> = {
    "USA": "US",
    "United States": "US",
    "UK": "GB",
    "United Kingdom": "GB",
    "UAE": "AE",
    "United Arab Emirates": "AE",
    "Ontario": "CA",
    "ON": "CA"
  };

  // 1. Check overrides
  // 2. Try to get code from name via library
  // 3. If it's already 2 characters, assume it's a code
  const code = overrides[country] || getCode(country) || (country.length === 2 ? country : null);
  
  if (!code) return "🌐"; // Global icon for unknown

  try {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "🌐";
  }
}

export default function ProfileHeader({ initialData, onUpdate }: { initialData?: any, onUpdate?: () => void }) {
  const [banner, setBanner] = useState(initialData?.coverImage || "/images/byClient/hero.jpg");
  const [avatar, setAvatar] = useState(initialData?.profileImage || "/images/byClient/defaultProfile.png");
  const [userData, setUserData] = useState<any>(initialData || null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [cropType, setCropType] = useState<'banner' | 'avatar'>('banner');

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setUserData(initialData);
      if (initialData.coverImage) setBanner(initialData.coverImage);
      if (initialData.profileImage) setAvatar(initialData.profileImage);
    }
  }, [initialData]);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, isBanner: boolean) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCropImageSrc(e.target.result as string);
          setCropType(isBanner ? 'banner' : 'avatar');
          setCropModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input value so the same file can be selected again
    event.target.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    const isBanner = cropType === 'banner';
    
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        if (isBanner) {
          setBanner(e.target.result as string);
        } else {
          setAvatar(e.target.result as string);
        }
      }
    };
    reader.readAsDataURL(croppedFile);

    // Perform actual upload
    if (isBanner) setIsUploadingBanner(true);
    else setIsUploadingAvatar(true);

    const type = isBanner ? 'cover' : 'profile';
    const result = await userService.uploadImage(croppedFile, type);

    if (isBanner) setIsUploadingBanner(false);
    else setIsUploadingAvatar(false);
    setCropModalOpen(false);

    if (result.success) {
      toast.success(`${isBanner ? 'Banner' : 'Profile picture'} updated successfully!`);
      
      // Dispatch event with data to update global header instantly
      const updateData = isBanner 
        ? { coverImage: result.data.coverImage } 
        : { profileImage: result.data.profileImage };
        
      window.dispatchEvent(new CustomEvent("profileUpdate", { detail: updateData }));
      
      if (onUpdate) onUpdate();
      
      // Update state with the actual CDN URL from response if available
      if (isBanner && result.data.coverImage) {
        setBanner(result.data.coverImage);
      } else if (!isBanner && result.data.profileImage) {
        setAvatar(result.data.profileImage);
      }
    } else {
      toast.error(result.message || "Failed to upload image");
    }
  };
  
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/5 bg-[#0c0a11]">
      <input
        type="file"
        ref={bannerInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, true)}
      />
      <input
        type="file"
        ref={avatarInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e, false)}
      />
      
      {/* Banner Image */}
      <div className="relative h-64 w-full sm:h-80">
        <Image
          src={banner}
          alt="Profile Banner"
          fill
          className="object-cover opacity-60"
          priority
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.style.backgroundColor = '#1a0505';
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0c0a11] via-transparent to-transparent" />
        
        {/* Change Banner Button */}
        <button
          className="absolute top-4 right-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => bannerInputRef.current?.click()}
          disabled={isUploadingBanner}
        >
          {isUploadingBanner ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Camera size={16} />
          )}
          {isUploadingBanner ? "Uploading..." : "Change Banner"}
        </button>
      </div>
      
      {/* Profile Info Overlay */}
      <div className="relative px-6 pb-6 pt-0 sm:px-12">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:-mt-16 sm:gap-8">
          {/* Avatar Container */}
          <div className="relative group h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-[#0c0a11] bg-gray-800 shadow-2xl sm:h-40 sm:w-40">
            <Image
              src={avatar}
              alt={userData?.username || "Super Sanchez"}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.style.backgroundColor = "#333";
              }}
            />
            {/* Change Avatar Overlay */}
            <button
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? (
                <Loader2 size={24} className="text-white animate-spin" />
              ) : (
                <Camera size={24} className="text-white drop-shadow-md" />
              )}
            </button>
          </div>
          
          {/* Text Info */}
          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:pb-2 sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {userData?.username || "Super Sanchez"}
            </h1>
            <div className="mt-2 flex items-baseline gap-2 text-gray-400">
              <span className="text-sm font-medium">{userData?.city || "Toronto"}, {userData?.country || "Canada"}</span>
              <span className="text-sm" title={userData?.country || "Canada"}>
                {getFlagEmoji(userData?.country || "CA")}
              </span>
            </div>
            
            {/* Social Icons */}
            <div className="mt-4 flex items-center gap-4 text-gray-400">
              <button className="hover:text-purple-500 transition-colors cursor-pointer">
                <ExIconTwitch size={20} />
              </button>
              <button className="hover:text-blue-400 transition-colors cursor-pointer">
                <ExIconDiscord size={20} />
              </button>
              <button className="hover:text-white transition-colors cursor-pointer">
                <ExIconX size={18} />
              </button>
            </div>
          </div>
        </div>
      
      </div>
      
      {cropModalOpen && (
        <ImageCropperModal
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={cropType === 'banner' ? 3 : 1}
          isUploading={isUploadingBanner || isUploadingAvatar}
        />
      )}
    </div>
  );
}
