// src/app/fonts.ts
import { Barlow, Exo } from "next/font/google";

export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

export const exo = Exo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-exo",
  display: "swap",
});