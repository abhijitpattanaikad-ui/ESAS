import Link from "next/link";
import TournamentList from "@/app/(components)/shared/TournamentList";
import { tournamentService } from "@/app/(services)/tournamentService";
import { buttonStyles, GlassCard } from "@/components/ui";

export const metadata = {
  title: "Tournaments",
  description: "Explore current and upcoming GoEzPz tournaments.",
};

export default async function TournamentsPage() {
  const result = await tournamentService.getAllTournaments();

  return (
    <section className="relative min-h-screen bg-woodsmoke-950 bg-[image:--features-bg] bg-cover bg-center bg-no-repeat px-4 pb-20 pt-24 md:pt-32">
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[40%] bg-linear-to-b from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-linear-to-t from-woodsmoke-950 via-woodsmoke-950/60 to-transparent pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 md:mb-14">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-300">Compete with GoEzPz</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Explore tournaments</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200/80">
            Search current and past GoEzPz competitions by tournament, game, or status.
          </p>
        </div>

        {result.kind === "success" ? (
          <TournamentList initialTournaments={result.data} />
        ) : result.kind === "empty" ? (
          <GlassCard className="mx-auto max-w-2xl p-10 text-center">
            <h2 className="text-xl font-bold text-white">No tournaments are listed</h2>
            <p className="mt-2 text-sm text-slate-300/80">The tournament catalogue is currently empty.</p>
            <Link href="/" className={buttonStyles({ variant: "secondary", className: "mt-5" })}>Return home</Link>
          </GlassCard>
        ) : (
          <GlassCard as="div" className="mx-auto max-w-2xl border-orange-400/25 p-10 text-center">
            <div role="alert">
              <h2 className="text-xl font-bold text-white">Tournament service unavailable</h2>
              <p className="mt-2 text-sm text-orange-100/75">
                We could not load reliable tournament data.
              </p>
              <Link href="/tournaments" className={buttonStyles({ variant: "secondary", className: "mt-5" })}>Refresh tournaments</Link>
            </div>
          </GlassCard>
        )}
      </div>
    </section>
  );
}
