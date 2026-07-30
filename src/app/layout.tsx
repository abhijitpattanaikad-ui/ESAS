import type { Metadata } from "next";
import React from "react";
import { Toaster } from "sonner";
import ConsentManager from "./(components)/privacy/ConsentManager";
import { barlow, exo } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "XeSports — The Future of Play",
    template: "%s | XeSports",
  },
  description: "Join competitive gaming tournaments, communities, and live esports experiences.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${barlow.variable} ${exo.variable}`}>
      <body className="font-sans antialiased">
        <Toaster position="top-right" richColors />
        {children}
        <ConsentManager />
      </body>
    </html>
  );
}
