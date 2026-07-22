// src/app/(auth)/verify/email/page.tsx
'use client';

import { Suspense } from 'react';
import VerifyMailInner from './VerifyMailInner';

export default function VerifyMailPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Verifying your email…</div>}>
      <VerifyMailInner />
    </Suspense>
  );
}