// src/app/reset/password/page.tsx
"use client";

import { Suspense } from "react";
import ResetPasswordInner from "@/app/reset/password/ResetPasswordInner";

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}