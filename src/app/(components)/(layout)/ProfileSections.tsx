"use client";

import React from "react";
import Image from "next/image";
import { Plus, BadgeCheck, Youtube, Instagram, Loader2, Save } from "lucide-react";
import { ExIconDiscord, ExIconTwitch, ExIconX, FloatingLabelInput, FloatingLabelTextArea, ExGlowButton } from "@/app/(components)/ui";
import { userService } from "@/app/(services)/userService";
import { toast } from "sonner";

export function AboutSection({ userData }: { userData?: any }) {
  return (
    <div className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">About</h2>
      <div className="mt-4 rounded-xl border border-white/5 bg-[#0c0a11] p-6 shadow-xl">
        <p className="text-sm leading-relaxed text-gray-300">
          Hi, I&apos;m {userData?.firstName || userData?.username || "Super Sanchez"}.{" "}
          {userData?.aboutMe || "Just a casual gamer with more than 3k followers. I like to play 1st person shooter and sometimes crash enemies in MOBA games. I'm from sunny and warm Toronto, Canada. You should expect great video content. I stream and I do video compilations of best and worst moments from games that I play. All you support is welcomed and appreciate it. Thank you for stopping by. Cheers!"}
        </p>
      </div>
    </div>
  );
}

const GAMES_DATA = [
  { id: 1, name: "Assetto Corsa", image: "/images/games/assettocorsa.jpg" },
  { id: 2, name: "Counter-Strike 2", image: "/images/games/cs2.jpg" },
  { id: 3, name: "F1 25", image: "/images/games/f125.webp" },
  { id: 4, name: "Forza Motorsport 26", image: "/images/games/fc26.webp" },
];

export function ProfileTabs({ userData, onUpdate }: { userData?: any, onUpdate?: () => void }) {
  const [activeTab, setActiveTab] = React.useState<'games' | 'profile'>('profile');
  
  // State for form fields
  const [formData, setFormData] = React.useState({
    firstName: userData?.firstName || "Super",
    lastName: userData?.lastName || "Sanchez",
    userName: userData?.username || "SuperSanchez",
    dob: userData?.dob || "1995-05-15",
    contact: userData?.contact || "+1 (555) 123-4567",
    email: userData?.email || "super.sanchez@example.com",
    country: userData?.country || "Canada",
    city: userData?.city || "Toronto",
    aboutMe: userData?.aboutMe || "Just a casual gamer with more than 3k followers. I like to play 1st person shooter and sometimes crash enemies in MOBA games.",
    discord: userData?.discord || "sanchez#1234",
    twitch: userData?.twitch || "supersanchez",
    youtube: userData?.youtube || "SuperSanchezPlays",
    instagram: userData?.instagram || "super.sanchez.official"
  });

  // Update form data when userData changes
  React.useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || prev.firstName,
        lastName: userData.lastName || prev.lastName,
        userName: userData.username || prev.userName,
        email: userData.email || prev.email,
        country: userData.country || prev.country,
        city: userData.city || prev.city,
        aboutMe: userData.aboutMe || prev.aboutMe,
        dob: userData.dob || prev.dob,
        contact: userData.phone || userData.contact || prev.contact,
        discord: userData.discordLink || userData.discord || prev.discord,
        twitch: userData.twitchLink || userData.twitch || prev.twitch,
        youtube: userData.youtubeLink || userData.youtube || prev.youtube,
        instagram: userData.instagramLink || userData.instagram || prev.instagram,
      }));
    }
  }, [userData]);
  
  const isEmailVerified = true;
  
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      // Map local form state to API payload
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.userName,
        aboutMe: formData.aboutMe,
        phone: formData.contact,
        country: formData.country,
        countryCode: "+1", // Defaulting to +1, could be made dynamic
        city: formData.city,
        dob: formData.dob,
        discordLink: formData.discord,
        twitchLink: formData.twitch,
        youtubeLink: formData.youtube,
        instagramLink: formData.instagram
      };

      const result = await userService.updateProfile(payload);
      
      if (result.success) {
        toast.success("Profile updated successfully!");
        // Dispatch event with data to update global header instantly
        window.dispatchEvent(new CustomEvent("profileUpdate", { 
          detail: { username: payload.username } 
        }));
        if (onUpdate) onUpdate();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="mt-8">
      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-white/10 pb-4">
        {/* <button
          onClick={() => setActiveTab('games')}
          className={`text-sm font-semibold uppercase tracking-wider transition-colors outline-none cursor-pointer ${activeTab === 'games' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Games
        </button> */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`text-sm font-semibold uppercase tracking-wider transition-colors outline-none cursor-pointer ${activeTab === 'profile' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Profile
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'games' ? (
          <div className="flex flex-wrap gap-4 rounded-xl border border-white/5 bg-[#0c0a11] p-6 shadow-xl">
            {GAMES_DATA.map((game) => (
              <div
                key={game.id}
                className="group relative h-48 w-32 overflow-hidden rounded-lg border border-white/10 bg-gray-900 transition-transform hover:scale-105 sm:h-56 sm:w-36"
              >
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.style.backgroundColor = "#222";
                  }}
                />
                <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/80 via-transparent to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-white uppercase">{game.name}</span>
                </div>
              </div>
            ))}
            
            {/* Add Game Button */}
            <button className="flex h-48 w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10 bg-white/5 transition-all hover:bg-white/10 sm:h-56 sm:w-36 cursor-pointer">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Add Game</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="rounded-xl border border-white/5 bg-[#0c0a11] p-6 shadow-xl">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Personal Info</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="dob"
                    label="DOB"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="contact"
                    label="Contact"
                    type="tel"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="userName"
                    label="User Name"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <FloatingLabelInput
                      id="email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      endAdornment={isEmailVerified && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" title="Verified">
                          <BadgeCheck size={18} />
                        </div>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="country"
                    label="Country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <FloatingLabelInput
                    id="city"
                    label="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <FloatingLabelTextArea
                    id="aboutMe"
                    label="About Me"
                    rows={4}
                    value={formData.aboutMe}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Socials */}
            <div className="rounded-xl border border-white/5 bg-[#0c0a11] p-6 shadow-xl">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Socials</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <ExIconDiscord size={18} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase">Discord</span>
                  </div>
                  <FloatingLabelInput
                    id="discord"
                    label="Username"
                    value={formData.discord}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <ExIconTwitch size={18} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase">Twitch</span>
                  </div>
                  <FloatingLabelInput
                    id="twitch"
                    label="Username"
                    value={formData.twitch}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Youtube size={18} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase">YouTube</span>
                  </div>
                  <FloatingLabelInput
                    id="youtube"
                    label="Channel URL"
                    value={formData.youtube}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <Instagram size={18} className="text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 uppercase">Instagram</span>
                  </div>
                  <FloatingLabelInput
                    id="instagram"
                    label="Handle"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <ExGlowButton
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                {isUpdating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isUpdating ? "Saving..." : "Save Profile"}
              </ExGlowButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}