// src/app/(components)/dashboard/page.tsx
"use client";

import React from "react";
import {motion} from "framer-motion";
import DashboardCarousel from "./DashboardCarousel";
import FeaturedEvents from "@/app/(components)/landing/FeaturedEvents";
import ProtectedRoute from "@/app/(components)/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-woodsmoke-950 text-white">
        
        <motion.div
          initial={{opacity: 0, y: 18}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.2}}
          transition={{duration: 0.6, ease: [0.25, 0.1, 0.25, 1]}}
          className=""
        >
          {/* Section 1 - Combo Carousel */}
          <section className="mx-auto px-6 md:px-10 lg:px-12 py-10">
            <DashboardCarousel/>
          </section>
          {/* Section 2 - Featured Events (with CTA) */}
          <motion.section
            initial={{opacity: 0, y: 18}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, amount: 0.2}}
            transition={{duration: 0.6, delay: 0.12}}
          >
            <FeaturedEvents showCTA />
          </motion.section>
        </motion.div>
      </main>
    </ProtectedRoute>
  );
}