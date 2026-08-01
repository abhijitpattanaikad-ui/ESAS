import {
  ExIconBrackets,
  ExIconTeam,
  ExIconTournamentType,
  ExIconTrophy,
} from "@/app/(components)/ui";
import { GlassCard, SectionHeading } from "@/components/ui";

const benefits = [
  {
    title: "Find tournaments",
    description: "Browse the live tournament catalogue and focus on the competitions that fit how you play.",
    icon: ExIconTrophy,
  },
  {
    title: "Know what to expect",
    description: "Review available game, schedule, format, and status details before deciding to compete.",
    icon: ExIconTournamentType,
  },
  {
    title: "Follow every round",
    description: "Keep the tournament overview and bracket within reach as the competition moves forward.",
    icon: ExIconBrackets,
  },
  {
    title: "Choose your format",
    description: "Explore solo and team competitions when those formats are available in the tournament field.",
    icon: ExIconTeam,
  },
];

export default function CoreFeatures() {
  return (
    <section aria-labelledby="why-goezpz-title" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="A clearer path to competition"
          title={<span id="why-goezpz-title">Why GoEzPz</span>}
          description="Everything on the public journey is arranged to help you discover a tournament, understand it, and decide what comes next."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title, description, icon: Icon }) => (
            <GlassCard as="li" key={title} className="h-full p-5">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-300/20 bg-orange-400/10 text-orange-300">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200/75">{description}</p>
            </GlassCard>
          ))}
        </ul>
      </div>
    </section>
  );
}
