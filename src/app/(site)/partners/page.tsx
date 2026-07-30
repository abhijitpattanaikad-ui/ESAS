import Image from "next/image";
import { brandService } from "@/app/(services)/brandService";

export const metadata = {
  title: "Our Partners",
  description: "Partners and sponsors of the GoEzPz platform.",
};

export default async function PartnersPage() {
  const result = await brandService.getAllBrands();
  const activeBrands = result.kind === "success" ? result.data.filter((brand) => brand.isActive) : [];

  return (
    <section className="relative min-h-screen bg-woodsmoke-950 bg-[image:--features-bg] bg-cover bg-center bg-no-repeat px-4 pb-20 pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-linear-to-b from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto">
        <div className="mb-10 text-center md:mb-16">
          <h1 className="heading-font px-4 text-2xl font-bold uppercase md:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-orange-400 via-jaffa-500 to-red-600 bg-clip-text text-transparent">
              Our partners
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium uppercase tracking-widest text-white/40 md:text-base">
            The brands and organizations making this possible.
          </p>
        </div>

        {result.kind === "error" || result.kind === "not-found" ? (
          <div role="alert" className="mx-auto max-w-2xl rounded-2xl border border-orange-400/25 bg-black/55 p-10 text-center">
            <h2 className="text-xl font-bold text-white">Partner data is temporarily unavailable</h2>
            <p className="mt-2 text-sm text-orange-100/70">Please refresh the page to try again.</p>
          </div>
        ) : activeBrands.length ? (
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {activeBrands.map((brand) => (
              <article
                key={brand._id}
                className="group flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0c0a11]/80 p-6 shadow-2xl backdrop-blur-md transition hover:border-white/20 hover:bg-white/5 md:p-8"
              >
                <div className="relative flex h-20 w-full items-center justify-center md:h-24">
                  <Image
                    src={brand.thumbnail}
                    alt={`${brand.name} logo`}
                    width={180}
                    height={80}
                    sizes="(max-width: 768px) 40vw, 180px"
                    className="object-contain grayscale opacity-70 transition group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </div>
                <h2 className="mt-4 text-center text-sm font-medium tracking-wide text-gray-400 transition-colors group-hover:text-white md:text-base">
                  {brand.name}
                </h2>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-black/40 p-10 text-center">
            <h2 className="text-xl font-bold text-white">Partners will be announced soon</h2>
          </div>
        )}
      </div>
    </section>
  );
}
