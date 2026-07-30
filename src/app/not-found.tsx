// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-900 text-center px-4">
      {/* small inline styles for the glow effect */}
      <style>{`
        /* soft pulsing glow for the primary button */
        @keyframes btnGlow {
          0% { box-shadow: 0 0 0 0 rgba(255,77,109,0.18); transform: translateY(0); }
          50% { box-shadow: 0 8px 30px -6px rgba(255,77,109,0.28); transform: translateY(-2px); }
          100% { box-shadow: 0 0 0 0 rgba(255,77,109,0.18); transform: translateY(0); }
        }

        .btn-glow {
          animation: btnGlow 1800ms ease-in-out infinite;
        }

        /* small "press start" micro effect on hover/focus (text flicker) */
        @keyframes textFlicker {
          0% { opacity: 1; filter: brightness(1); }
          50% { opacity: 0.92; filter: brightness(1.06); }
          100% { opacity: 1; filter: brightness(1); }
        }
        .press-start:hover .ps-text,
        .press-start:focus .ps-text {
          animation: textFlicker 420ms linear 2;
        }
      `}</style>

      <section className="max-w-lg w-full border border-white/10 rounded-2xl p-8 bg-gradient-to-b from-neutral-800/70 to-neutral-900 shadow-2xl">
        <h1 className="text-5xl font-extrabold text-white mb-3">404</h1>

        <h2 className="text-xl text-[#ff4d6d] font-semibold mb-2">Page Not Found</h2>

        <p className="text-white/70 mb-6">
          Looks like this level doesn’t exist — maybe you took a wrong turn or the server lagged.
        </p>

        <p className="text-white/60 italic mb-8">
          <span className="text-white font-medium">Gamers don’t die</span> — they respawn.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Primary button with glow + "press start" vibe */}
          <Link
            href="/"
            className="press-start inline-flex items-center justify-center px-5 py-2.5 rounded-full text-white font-semibold bg-gradient-to-r from-[#ff4d6d] to-[#ff7a59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4d6d]/30"
            aria-label="Go Home"
          >
            <span className="btn-glow px-4 py-1 rounded-full">Go Home</span>
            <span className="ml-3 ps-text text-xs uppercase tracking-wider text-white/90">Press Start</span>
          </Link>

          {/* Secondary */}
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/20 text-white/80 hover:text-white transition"
            aria-label="Respawn"
          >
            Respawn
          </Link>
        </div>
      </section>
    </main>
  );
}
