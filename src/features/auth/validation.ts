export const TERMS_VERSION = "2026-07-29";

export interface SignupInput {
  email: string;
  username: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface SignupValue {
  email: string;
  username: string;
  phone: string;
  password: string;
  termsVersion: string;
  termsAcceptedAt: string;
}

export type SignupErrors = Partial<Record<"email" | "username" | "phoneNumber" | "password" | "confirmPassword" | "terms", string>>;
export type SignupValidation = { ok: true; value: SignupValue } | { ok: false; errors: SignupErrors };

export function normalizePhoneNumber(countryCode: string, phoneNumber: string): string | null {
  const callingCode = countryCode.replace(/\D/g, "");
  let national = phoneNumber.replace(/\D/g, "");
  if (national.startsWith("0")) national = national.slice(1);
  if (!callingCode || !national) return null;
  const combined = `${callingCode}${national}`;
  if (combined.length < 8 || combined.length > 15) return null;
  return `+${combined}`;
}

export function validateSignup(input: SignupInput, now = new Date()): SignupValidation {
  const errors: SignupErrors = {};
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();
  const phone = normalizePhoneNumber(input.countryCode, input.phoneNumber);

  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address";
  if (!/^[A-Za-z0-9._]{4,20}$/.test(username)) errors.username = "Use 4–20 letters, numbers, periods, or underscores";
  if (!phone) errors.phoneNumber = "Enter a valid international phone number";
  if (input.password.length < 8) errors.password = "Password must be at least 8 characters";
  if (input.password !== input.confirmPassword) errors.confirmPassword = "Passwords do not match";
  if (!input.acceptTerms) errors.terms = "You must accept the Terms and Privacy Policy";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      email,
      username,
      phone: phone!,
      password: input.password,
      termsVersion: TERMS_VERSION,
      termsAcceptedAt: now.toISOString(),
    },
  };
}
