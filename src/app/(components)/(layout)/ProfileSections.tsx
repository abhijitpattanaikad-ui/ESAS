"use client";

import React from "react";
import { BadgeCheck, Instagram, Loader2, Save, Youtube } from "lucide-react";
import {
  ExGlowButton,
  ExIconDiscord,
  ExIconTwitch,
  ExIconX,
  FloatingLabelInput,
  FloatingLabelPhoneInput,
  FloatingLabelTextArea,
} from "@/app/(components)/ui";
import { userService } from "@/app/(services)/userService";
import {
  type ProfileForm,
  type UserProfile,
  profileFormToPayload,
  profileToForm,
} from "@/features/profile/contracts";
import { toast } from "sonner";

interface ProfileSectionProps {
  userData: UserProfile;
  onUpdate?: () => void | Promise<void>;
}

export function AboutSection({ userData }: Pick<ProfileSectionProps, "userData">) {
  const displayName = userData.firstName || userData.username;
  return (
    <section className="mt-8" aria-labelledby="profile-about-heading">
      <h2 id="profile-about-heading" className="text-sm font-semibold uppercase tracking-wider text-gray-400">About</h2>
      <div className="mt-4 rounded-xl border border-white/5 bg-[#0c0a11] p-6 shadow-xl">
        <p className="text-sm leading-relaxed text-gray-300">
          {userData.aboutMe
            ? `${displayName ? `${displayName}: ` : ""}${userData.aboutMe}`
            : "No bio has been added yet."}
        </p>
      </div>
    </section>
  );
}

export function ProfileTabs({ userData, onUpdate }: ProfileSectionProps) {
  const [formData, setFormData] = React.useState<ProfileForm>(() => profileToForm(userData));
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    setFormData(profileToForm(userData));
  }, [userData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.id as keyof ProfileForm;
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSave = async () => {
    if (isUpdating) return;
    if (!formData.userName.trim()) {
      toast.error("Username is required.");
      return;
    }

    setIsUpdating(true);
    try {
      const payload = profileFormToPayload(formData);
      const result = await userService.updateProfile(payload);

      if (!result.success) {
        toast.error(result.message || "Failed to update profile.");
        return;
      }

      toast.success("Profile updated successfully.");
      window.dispatchEvent(new CustomEvent("profileUpdate", { detail: { username: payload.username } }));
      await onUpdate?.();
    } catch (error) {
      console.error("Profile update failed", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="mt-8" aria-labelledby="profile-details-heading">
      <div className="border-b border-white/10 pb-4">
        <h2 id="profile-details-heading" className="text-sm font-semibold uppercase tracking-wider text-white">Profile</h2>
      </div>

      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-white/5 bg-[#0c0a11] p-6 shadow-xl">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Personal information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FloatingLabelInput id="firstName" label="First name" value={formData.firstName} onChange={handleChange} autoComplete="given-name" />
            <FloatingLabelInput id="lastName" label="Last name" value={formData.lastName} onChange={handleChange} autoComplete="family-name" />
            <FloatingLabelInput id="dob" label="Date of birth" type="date" value={formData.dob} onChange={handleChange} autoComplete="bday" />
            <FloatingLabelPhoneInput
              id="contact"
              label="Contact number"
              value={formData.contact}
              onChange={handleChange}
              countryCode={formData.countryCode}
              onCountryChange={(countryCode) => setFormData((current) => ({ ...current, countryCode }))}
              autoComplete="tel-national"
            />
            <FloatingLabelInput id="userName" label="Username" value={formData.userName} onChange={handleChange} autoComplete="username" required />
            <div className="relative">
              <FloatingLabelInput
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                readOnly
                aria-readonly="true"
                autoComplete="email"
                endAdornment={userData.emailVerified ? (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" title="Email verified" aria-label="Email verified">
                    <BadgeCheck size={18} aria-hidden="true" />
                  </span>
                ) : undefined}
              />
            </div>
            <FloatingLabelInput id="country" label="Country" value={formData.country} onChange={handleChange} autoComplete="country-name" />
            <FloatingLabelInput id="city" label="City" value={formData.city} onChange={handleChange} autoComplete="address-level2" />
            <div className="sm:col-span-2">
              <FloatingLabelTextArea id="aboutMe" label="About me" rows={4} value={formData.aboutMe} onChange={handleChange} maxLength={500} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#0c0a11] p-6 shadow-xl">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Social profiles</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <SocialField icon={<ExIconDiscord size={18} />} title="Discord" field="discord" label="Username or profile URL" value={formData.discord} onChange={handleChange} />
            <SocialField icon={<ExIconTwitch size={18} />} title="Twitch" field="twitch" label="Channel URL" value={formData.twitch} onChange={handleChange} />
            <SocialField icon={<Youtube size={18} />} title="YouTube" field="youtube" label="Channel URL" value={formData.youtube} onChange={handleChange} />
            <SocialField icon={<Instagram size={18} />} title="Instagram" field="instagram" label="Profile URL or handle" value={formData.instagram} onChange={handleChange} />
            <SocialField icon={<ExIconX size={18} />} title="X" field="x" label="Profile URL or handle" value={formData.x} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end">
          <ExGlowButton onClick={handleSave} disabled={isUpdating} className="flex items-center gap-2">
            {isUpdating ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
            {isUpdating ? "Saving…" : "Save profile"}
          </ExGlowButton>
        </div>
      </div>
    </section>
  );
}

function SocialField({
  icon,
  title,
  field,
  label,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  field: keyof Pick<ProfileForm, "discord" | "twitch" | "youtube" | "instagram" | "x">;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-gray-400">
        {icon}
        <span className="text-xs font-medium uppercase">{title}</span>
      </div>
      <FloatingLabelInput id={field} label={label} value={value} onChange={onChange} inputMode="url" />
    </div>
  );
}
