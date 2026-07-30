import React from "react";
import Image from "next/image";
import { brandService } from "@/app/(services)/brandService";

export const metadata = {
  title: "Our Partners | XeSports",
  description: "Partners and sponsors of the XeSports Platform",
};

export default async function PartnersPage() {
  const brands = await brandService.getAllBrands();
  const activeBrands = brands.filter((brand) => brand.isActive);

  return (
    <section className="relative py-12 md:py-20 bg-woodsmoke-950 px-4 bg-[image:--features-bg] bg-cover bg-center bg-no-repeat min-h-screen pt-24 md:pt-32">
      {/* Dark Overlays for premium look */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-linear-to-b from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />

      <div className="container mx-auto z-10 relative">
        {/* Page Title with Gradient */}
        <div className="mb-10 md:mb-16 text-center">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold heading-font uppercase px-4">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-jaffa-500 to-red-600">
              OUR PARTNERS
            </span>
          </h1>
          <p className="text-white/40 mt-4 text-sm md:text-base font-medium max-w-2xl mx-auto uppercase tracking-widest">
            The brands and organizations making this possible.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 px-4 max-w-6xl mx-auto">
          {activeBrands.length > 0 ? (
            activeBrands.map((brand) => (
              <div 
                key={brand._id}
                className="bg-[#0c0a11]/80 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col items-center justify-center hover:scale-[1.03] hover:border-white/20 hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="relative w-full h-20 md:h-24 flex items-center justify-center">
                  <Image
                    src={brand.thumbnail}
                    alt={brand.name}
                    width={180}
                    height={80}
                    className="object-contain grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <h3 className="mt-4 text-gray-400 group-hover:text-white transition-colors font-medium text-sm md:text-base tracking-wide text-center">
                  {brand.name}
                </h3>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl font-bold text-white/40 italic">Check back soon to see our partners!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
