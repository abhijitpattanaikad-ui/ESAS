const DEFAULT_COUNTRY_CODE = "+971";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function firstString(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = cleanString(record[key]);
    if (value) return value;
  }
  return "";
}

function cleanCallingCode(value: unknown): string {
  const digits = cleanString(value).replace(/\D/g, "");
  return digits ? `+${digits}` : DEFAULT_COUNTRY_CODE;
}

function cleanBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  if (typeof value === "number") return value === 1;
  return false;
}

function unwrapProfile(value: unknown): Record<string, unknown> {
  const root = asRecord(value);
  const data = asRecord(root.data);
  const user = asRecord(root.user);
  return Object.keys(data).length ? data : Object.keys(user).length ? user : root;
}

function boundedString(record: Record<string, unknown>, key: string, maxLength: number): string | null {
  const value = record[key];
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned.length <= maxLength ? cleaned : null;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  dob: string;
  phone: string;
  email: string;
  country: string;
  countryCode: string;
  city: string;
  aboutMe: string;
  discordLink: string;
  twitchLink: string;
  youtubeLink: string;
  instagramLink: string;
  xLink: string;
  profileImage: string;
  coverImage: string;
  emailVerified: boolean;
}

export interface ProfileForm {
  firstName: string;
  lastName: string;
  userName: string;
  dob: string;
  contact: string;
  email: string;
  country: string;
  countryCode: string;
  city: string;
  aboutMe: string;
  discord: string;
  twitch: string;
  youtube: string;
  instagram: string;
  x: string;
}

export interface ProfileUpdatePayload {
  firstName: string;
  lastName: string;
  username: string;
  dob: string;
  phone: string;
  country: string;
  countryCode: string;
  city: string;
  aboutMe: string;
  discordLink: string;
  twitchLink: string;
  youtubeLink: string;
  instagramLink: string;
  xLink: string;
}

export interface ProfileImageResponse {
  profileImage?: string;
  coverImage?: string;
  data?: {
    profileImage?: string;
    coverImage?: string;
  };
}

export function emptyUserProfile(): UserProfile {
  return {
    firstName: "",
    lastName: "",
    username: "",
    dob: "",
    phone: "",
    email: "",
    country: "",
    countryCode: DEFAULT_COUNTRY_CODE,
    city: "",
    aboutMe: "",
    discordLink: "",
    twitchLink: "",
    youtubeLink: "",
    instagramLink: "",
    xLink: "",
    profileImage: "",
    coverImage: "",
    emailVerified: false,
  };
}

export function parseUserProfile(value: unknown): UserProfile {
  const record = unwrapProfile(value);
  return {
    firstName: firstString(record, "firstName", "firstname"),
    lastName: firstString(record, "lastName", "lastname"),
    username: firstString(record, "username", "userName"),
    dob: firstString(record, "dob", "dateOfBirth"),
    phone: firstString(record, "phone", "contact", "phoneNumber"),
    email: firstString(record, "email"),
    country: firstString(record, "country"),
    countryCode: cleanCallingCode(record.countryCode),
    city: firstString(record, "city"),
    aboutMe: firstString(record, "aboutMe", "bio"),
    discordLink: firstString(record, "discordLink", "discord"),
    twitchLink: firstString(record, "twitchLink", "twitch"),
    youtubeLink: firstString(record, "youtubeLink", "youtube"),
    instagramLink: firstString(record, "instagramLink", "instagram"),
    xLink: firstString(record, "xLink", "twitterLink", "twitter", "x"),
    profileImage: firstString(record, "profileImage", "avatar", "avatarUrl"),
    coverImage: firstString(record, "coverImage", "banner", "bannerImage"),
    emailVerified: cleanBoolean(record.emailVerified ?? record.isEmailVerified),
  };
}

export function profileToForm(profile: UserProfile): ProfileForm {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    userName: profile.username,
    dob: profile.dob,
    contact: profile.phone,
    email: profile.email,
    country: profile.country,
    countryCode: profile.countryCode,
    city: profile.city,
    aboutMe: profile.aboutMe,
    discord: profile.discordLink,
    twitch: profile.twitchLink,
    youtube: profile.youtubeLink,
    instagram: profile.instagramLink,
    x: profile.xLink,
  };
}

export function profileFormToPayload(form: ProfileForm): ProfileUpdatePayload {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    username: form.userName.trim(),
    dob: form.dob.trim(),
    phone: form.contact.trim(),
    country: form.country.trim(),
    countryCode: cleanCallingCode(form.countryCode),
    city: form.city.trim(),
    aboutMe: form.aboutMe.trim(),
    discordLink: form.discord.trim(),
    twitchLink: form.twitch.trim(),
    youtubeLink: form.youtube.trim(),
    instagramLink: form.instagram.trim(),
    xLink: form.x.trim(),
  };
}

export function parseProfileUpdatePayload(value: unknown): ProfileUpdatePayload | null {
  const record = asRecord(value);
  const firstName = boundedString(record, "firstName", 80);
  const lastName = boundedString(record, "lastName", 80);
  const username = boundedString(record, "username", 20);
  const dob = boundedString(record, "dob", 10);
  const phone = boundedString(record, "phone", 32);
  const country = boundedString(record, "country", 100);
  const countryCode = boundedString(record, "countryCode", 8);
  const city = boundedString(record, "city", 100);
  const aboutMe = boundedString(record, "aboutMe", 500);
  const discordLink = boundedString(record, "discordLink", 300);
  const twitchLink = boundedString(record, "twitchLink", 300);
  const youtubeLink = boundedString(record, "youtubeLink", 300);
  const instagramLink = boundedString(record, "instagramLink", 300);
  const xLink = boundedString(record, "xLink", 300);

  const values = [
    firstName,
    lastName,
    username,
    dob,
    phone,
    country,
    countryCode,
    city,
    aboutMe,
    discordLink,
    twitchLink,
    youtubeLink,
    instagramLink,
    xLink,
  ];
  if (values.some((item) => item === null)) return null;
  if (!username || !/^[A-Za-z0-9._-]{4,20}$/.test(username)) return null;
  if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  if (!countryCode || !/^\+\d{1,4}$/.test(countryCode)) return null;
  if (phone && !/^[0-9+()\-\s]{4,32}$/.test(phone)) return null;

  return {
    firstName: firstName!,
    lastName: lastName!,
    username,
    dob: dob!,
    phone: phone!,
    country: country!,
    countryCode,
    city: city!,
    aboutMe: aboutMe!,
    discordLink: discordLink!,
    twitchLink: twitchLink!,
    youtubeLink: youtubeLink!,
    instagramLink: instagramLink!,
    xLink: xLink!,
  };
}

export function parseProfileImageResponse(value: unknown): { profileImage?: string; coverImage?: string } {
  const record = asRecord(value);
  const nested = asRecord(record.data);
  const profileImage = firstString(record, "profileImage") || firstString(nested, "profileImage");
  const coverImage = firstString(record, "coverImage") || firstString(nested, "coverImage");
  return {
    ...(profileImage ? { profileImage } : {}),
    ...(coverImage ? { coverImage } : {}),
  };
}
