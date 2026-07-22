// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "sonner";
import { barlow, exo } from "./fonts";
import Script from "next/script";

export const metadata: Metadata = {
  title: "xEsports - The Future of Play",
  description: "Join the future of competitive gaming with community tournaments, prizes, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${exo.variable}`}>
      <body className={`font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WJXXVRRW"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>`
        }} />
        
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
        >
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WJXXVRRW');`}
        </Script>

        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}