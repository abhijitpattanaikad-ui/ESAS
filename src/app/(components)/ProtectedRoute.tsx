"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check localStorage for JWT token
    const token = localStorage.getItem("token");

    if (!token) {
      // No token? Redirect to login
      router.replace("/login");
    } else {
      // Token exists, allow access
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    // Optional: loading UI while verifying
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0f0f1a]">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
