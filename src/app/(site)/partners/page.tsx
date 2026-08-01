import Image from "next/image";
import { brandService } from "@/app/(services)/brandService";
import { GlassCard } from "@/components/ui";

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

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">Alongside GoEzPz</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Our partners</h1>
          <p className="mt-4 text-base text-slate-200/80">
            The brands and organizations currently represented in the GoEzPz partner catalogue.
          </p>
        </div>

        {result.kind === "error" || result.kind === "not-found" ? (
          <GlassCard as="div" className="mx-auto max-w-2xl border-orange-400/25 p-10 text-center">
            <div role="alert">
              <h2 className="text-xl font-bold text-white">Partner data is temporarily unavailable</h2>
              <p className="mt-2 text-sm text-orange-100/75">
                We could not load reliable partner data. Please refresh the page to try again.
              </p>
            </div>
          </GlassCard>
        ) : activeBrands.length ? (
          <ul aria-label="GoEzPz partners" className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {activeBrands.map((brand) => (
              <GlassCard
                as="li"
                key={brand._id}
                className="flex min-h-44 flex-col items-center justify-center p-5 text-center transition-transform duration-200 hover:-translate-y-1 hover:border-orange-300/35 motion-reduce:transform-none md:min-h-52 md:p-7"
              >
                <div className="relative flex h-20 w-full items-center justify-center md:h-24">
                  <Image
                    src={brand.thumbnail}
                    alt={`${brand.name} logo`}
                    width={180}
                    height={80}
                    sizes="(max-width: 768px) 40vw, 180px"
                    className="max-h-full w-auto max-w-full object-contain"
                  />
                </div>
                <h2 className="mt-4 text-sm font-medium tracking-wide text-slate-100 md:text-base">
                  {brand.name}
                </h2>
              </GlassCard>
            ))}
          </ul>
        ) : (
          <GlassCard className="mx-auto max-w-2xl p-10 text-center">
            <h2 className="text-xl font-bold text-white">Partners will be announced soon</h2>
            <p className="mt-2 text-sm text-slate-300/80">There are no active partners to show right now.</p>
          </GlassCard>
        )}
      </div>
    </section>
  );
}
