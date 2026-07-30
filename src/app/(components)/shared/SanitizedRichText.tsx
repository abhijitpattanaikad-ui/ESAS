"use client";

import { useEffect, useState } from "react";
import { sanitizeRichHtml } from "@/lib/security/sanitizeHtml";

export function SanitizedRichText({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    setSanitizedHtml(sanitizeRichHtml(html));
  }, [html]);

  if (!sanitizedHtml) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
