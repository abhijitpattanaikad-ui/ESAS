// src/app/(auth)/verify/email/VerifyMailInner.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FloatingLabelInput } from "@/app/(components)/ui";

export default function VerifyMailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const queryToken = params.get("token");

  const [token, setToken] = useState<string | null>(queryToken);
  const [status, setStatus] = useState<
    "idle" | "verifying" | "success" | "failed" | "no-token"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // if token present in URL, trigger verification automatically
    if (token) {
      verifyEmail(token);
    } else {
      setStatus("no-token");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function safeParseResponse(res: Response) {
    // Try to parse JSON first, otherwise fallback to text
    try {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (jsonErr) {
      // not JSON — try text
      try {
        const text = await res.text();
        // put text into data.message so UI can use it
        return { ok: res.ok, status: res.status, data: { message: text } };
      } catch {
        return { ok: res.ok, status: res.status, data: {} };
      }
    }
  }

  async function verifyEmail(tkn: string) {
    setStatus("verifying");
    setErrorMsg(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/user/verify/email`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tkn}`,
          },
        }
      );

      // safe parse (JSON or plain text)
      const parsed = await safeParseResponse(res);
      const { status: httpStatus, data } = parsed;

      console.log("VERIFY response:", httpStatus, data);

      if (res.ok) {
        setStatus("success");
        toast.success(data?.message || "Email verified successfully!");
        setTimeout(() => router.push("/login"), 1500);
        return;
      }

      // not OK
      setStatus("failed");
      const message = data?.message || `Verification failed (status ${httpStatus})`;
      setErrorMsg(message);
      toast.error(message);
    } catch (err: any) {
      console.error("verifyEmail error:", err);
      setStatus("failed");
      setErrorMsg(err?.message || "Network error");
      toast.error("Network error. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center text-white p-4">
      <div className="w-full max-w-lg bg-[#1c1b29] p-8 rounded-xl shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Verify your email</h1>

        {status === "verifying" && <p className="text-sm text-gray-300 mb-4">Verifying your email…</p>}

        {status === "success" && (
          <>
            <p className="text-green-400 mb-4">Email verified successfully! Redirecting to login…</p>
            <p className="text-sm text-gray-400">If you are not redirected, <button onClick={() => router.push("/login")} className="underline text-[#ff4d6d]">click here</button>.</p>
          </>
        )}

        {/* {status === "failed" && (
          <>
            <p className="text-red-400 mb-2">Verification failed</p>
            {errorMsg && <p className="text-sm text-gray-300 mb-4">{errorMsg}</p>}
            <p className="text-sm text-gray-400 mb-4">
              Possible reasons: invalid or expired token. You can request a new verification mail from your account area (if available) or contact support.
            </p>
          </>
        )} */}

        {status === "failed" && (
          <>
            {errorMsg === "User already verified" ? (
              <p className="text-green-400 mb-2">{errorMsg}</p>
            ) : (
              <>
                <p className="text-red-400 mb-2">Verification failed</p>
                <p className="text-sm text-gray-300 mb-4">{errorMsg}</p>
              </>
            )}
          </>
        )}


        {status === "no-token" && (
          <>
            <p className="text-sm text-gray-300 mb-4">No verification token found in the link.</p>
            <p className="text-sm text-gray-400 mb-2">Paste token manually (if you received it in email):</p>

            <div className="flex gap-2 justify-center">
              <div className="w-full max-w-md">
                <FloatingLabelInput
                  label="Token"
                  value={token ?? ""}
                  onChange={(e) => setToken(e.target.value || null)}
                  className="text-sm"
                />
              </div>
              <button
                onClick={() => token && verifyEmail(token)}
                className="px-4 py-2 bg-[#ff4d6d] text-black rounded-md h-[48px]"
              >
                Verify
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              Or go back to <button onClick={() => router.push("/login")} className="underline text-[#ff4d6d]">Login</button>.
            </p>
          </>
        )}

        {status === "idle" && (
          <>
            <p className="text-sm text-gray-300 mb-4">Preparing to verify…</p>
            <button onClick={() => queryToken ? setToken(queryToken) : setStatus("no-token")} className="px-4 py-2 bg-[#ff4d6d] text-black rounded-md">
              Start Verification
            </button>
          </>
        )}
      </div>
    </div>
  );
}