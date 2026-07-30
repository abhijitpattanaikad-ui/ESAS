export const GENERIC_RESET_MESSAGE =
  "If an account exists for that email, a password-reset link will be sent.";

export interface ForgotPasswordPublicResponse {
  status: number;
  message: string;
}

export function normalizeForgotPasswordResponse(status: number): ForgotPasswordPublicResponse {
  if (status === 429) {
    return { status: 429, message: "Too many reset requests. Please try again later." };
  }
  if (status >= 500) {
    return { status: 503, message: "Password reset is temporarily unavailable." };
  }
  return { status: 200, message: GENERIC_RESET_MESSAGE };
}
