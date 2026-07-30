import TournamentList from "@/app/(components)/shared/TournamentList";
import { tournamentService } from "@/app/(services)/tournamentService";

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

      <div className="container relative z-10 mx-auto">
        <div className="mb-10 text-center md:mb-16">
          <h1 className="heading-font px-4 text-2xl font-bold uppercase md:text-5xl lg:text-6xl">
            <span className="bg-linear-to-r from-orange-400 via-jaffa-500 to-red-600 bg-clip-text text-transparent">
              Explore tournaments
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium uppercase tracking-widest text-white/40 md:text-base">
            Find and join elite esports competitions in the region.
          </p>
        </div>

        {result.kind === "success" ? (
          <TournamentList initialTournaments={result.data} />
        ) : result.kind === "empty" ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-black/40 p-10 text-center">
            <h2 className="text-xl font-bold text-white">No tournaments are scheduled</h2>
            <p className="mt-2 text-sm text-white/55">New competitions will appear here when registration opens.</p>
          </div>
        ) : (
          <div role="alert" className="mx-auto max-w-2xl rounded-2xl border border-orange-400/25 bg-black/55 p-10 text-center">
            <h2 className="text-xl font-bold text-white">Tournament service unavailable</h2>
            <p className="mt-2 text-sm text-orange-100/70">
              We could not load reliable tournament data. Refresh this page rather than relying on cached or fabricated results.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
