"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface Participant {
  id: string;
  name: string;
  resultText?: string | null;
  isWinner?: boolean;
  status?: string | null;
  seed?: number;   // bracket seeding position shown to the left of the row
}

export interface BracketMatch {
  id: string | number;
  nextMatchId?: string | number | null;
  nextLooserMatchId?: string | number | null;
  tournamentRoundText?: string;
  seriesText?: string | null;
  startTime?: string;
  state?: string;
  participants: Participant[];
}

export interface Round {
  title: string;
  series?: string | null;
  matches: BracketMatch[];
}

export const CARD_H = 64;
export const CARD_W = 196;

/**
 * Groups matches by round text and performs tree alignment so parents and children align visually.
 */
export function buildRounds(matches: BracketMatch[]): Round[] {
  const map: Record<string, BracketMatch[]> = {};
  matches.forEach((m) => {
    const key = m.tournamentRoundText || "Round";
    if (!map[key]) map[key] = [];
    map[key].push(m);
  });

  // Initial sort by match count (descending)
  const sortedRounds = Object.entries(map)
    .sort(([, a], [, b]) => b.length - a.length)
    .map(([title, ms]) => ({
      title,
      series: ms[0]?.seriesText ?? null,
      matches: ms,
    }));

  if (sortedRounds.length < 2) return sortedRounds;

  // Perform tree alignment: sort matches in round N based on where they point to in round N+1
  // We work backwards from the final round
  for (let i = sortedRounds.length - 2; i >= 0; i--) {
    const currentRound = sortedRounds[i];
    const nextRoundMatches = sortedRounds[i + 1].matches;

    const alignedMatches: BracketMatch[] = [];
    const usedIds = new Set<string | number>();

    nextRoundMatches.forEach((parent) => {
      // Find matches in current round that feed into this parent
      const feeders = currentRound.matches.filter(
        (m) => m.nextMatchId != null && String(m.nextMatchId) === String(parent.id)
      );
      feeders.forEach((f) => {
        alignedMatches.push(f);
        usedIds.add(f.id);
      });
    });

    // Add any matches that weren't picked up (orphans or matches with null nextMatchId)
    const orphans = currentRound.matches.filter((m) => !usedIds.has(m.id));
    alignedMatches.push(...orphans);

    currentRound.matches = alignedMatches;
  }

  return sortedRounds;
}

export const PlayerRow = ({ player, isDone }: { player?: Participant; isDone: boolean }) => {
  const isWinner = isDone && player?.isWinner;
  const isLoser  = isDone && player && !player.isWinner;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        height: CARD_H / 2,
        background: isWinner ? "rgba(255,116,37,0.13)" : "transparent",
        transition: "background 0.2s",
        position: "relative",
      }}
    >
      {/* Seed badge — positioned on the left inside the card */}
      {player?.seed != null && (
        <div
          style={{
            minWidth: 20,
            height: CARD_H / 2 - 8,
            background: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 800,
            color: "#ffffff",
            fontFamily: "'Outfit', sans-serif",
            marginRight: 10,
            borderRadius: 2,
          }}
        >
          {player.seed}
        </div>
      )}

      <span
        style={{
          fontSize: 12,
          fontWeight: isWinner ? 700 : 600,
          color: isWinner ? "#ff7425" : "#ffffff",
          fontFamily: "'Outfit', sans-serif",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
          marginRight: 8,
          opacity: isLoser ? 0.5 : 1,
        }}
      >
        {player?.name || "TBD"}
      </span>
      {player?.resultText != null && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "#fff",
            background: isWinner ? "#ff7425" : "rgba(255,255,255,0.1)",
            borderRadius: 4,
            padding: "2px 7px",
            minWidth: 22,
            textAlign: "center",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          {player.resultText}
        </span>
      )}
    </div>
  );
};

// ─── Match Details Modal ────────────────────────────────────────────────────────
const MatchDetailsModal = ({
  match,
  onClose,
  matchNumber,
}: {
  match: BracketMatch;
  onClose: () => void;
  matchNumber?: number;
}) => {
  const isDone =
    match.state === "DONE" ||
    match.state === "SCORE_DONE" ||
    match.state === "WALK_OVER" ||
    match.state === "COMPLETED";

  const p1 = match.participants?.[0];
  const p2 = match.participants?.[1];

  const getStateLabel = (state?: string) => {
    switch (state) {
      case "DONE":
      case "SCORE_DONE":
      case "COMPLETED":
        return { label: "Completed", color: "#22c55e" };
      case "WALK_OVER":
        return { label: "Walk Over", color: "#f59e0b" };
      case "SCHEDULED":
        return { label: "Scheduled", color: "#60a5fa" };
      case "NO_SHOW":
        return { label: "No Show", color: "#ef4444" };
      default:
        return { label: state || "Unknown", color: "#94a3b8" };
    }
  };

  const stateInfo = getStateLabel(match.state);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Render via portal so the modal sits directly on document.body,
  // escaping any parent overflow/transform/z-index stacking context.
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 9998,
          animation: "fadeInBackdrop 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: 420,
          maxWidth: "calc(100vw - 32px)",
          background: "linear-gradient(145deg, #0f141e 0%, #1a2035 100%)",
          border: "1px solid rgba(255,116,37,0.25)",
          borderRadius: 16,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)",
          animation: "slideUpModal 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          overflow: "hidden",
        }}
      >
        {/* Orange accent top bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg, #ff7425, #ff9a5c)" }} />

        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#ff7425",
                fontFamily: "'Outfit', sans-serif",
                marginBottom: 4,
              }}
            >
              {match.tournamentRoundText
                ? `Round ${match.tournamentRoundText}`
                : "Match Details"}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#ffffff",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Match #{matchNumber ?? (String(match.id).replace(/[^0-9]/g, "").slice(-4) || "—")}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              lineHeight: 1,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,116,37,0.2)";
              (e.currentTarget as HTMLButtonElement).style.color = "#ff7425";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,116,37,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            ×
          </button>
        </div>

        {/* Match status + time */}
        <div
          style={{
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: stateInfo.color,
              background: `${stateInfo.color}1a`,
              border: `1px solid ${stateInfo.color}40`,
              borderRadius: 20,
              padding: "3px 10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {stateInfo.label}
          </span>
          {match.startTime && (
            <span
              style={{
                fontSize: 12,
                color: "#64748b",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              📅 {match.startTime}
            </span>
          )}
        </div>

        {/* VS section */}
        <div style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            {/* Player 1 */}
            <div
              style={{
                flex: 1,
                background: p1?.isWinner && isDone
                  ? "linear-gradient(135deg, rgba(255,116,37,0.12), rgba(255,116,37,0.04))"
                  : "rgba(255,255,255,0.03)",
                border: p1?.isWinner && isDone
                  ? "1px solid rgba(255,116,37,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "16px 14px",
                textAlign: "center",
                position: "relative",
                transition: "all 0.2s",
              }}
            >
              {p1?.isWinner && isDone && (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 16,
                  }}
                >
                  👑
                </div>
              )}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff7425, #ff9a5c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 auto 10px",
                  fontFamily: "'Outfit', sans-serif",
                  opacity: isDone && !p1?.isWinner ? 0.45 : 1,
                }}
              >
                {(p1?.name || "TBD")[0].toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: p1?.isWinner && isDone ? "#ff7425" : "#ffffff",
                  fontFamily: "'Outfit', sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  opacity: isDone && !p1?.isWinner ? 0.5 : 1,
                }}
              >
                {p1?.name || "TBD"}
              </div>
              {p1?.resultText != null && (
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: p1?.isWinner && isDone ? "#ff7425" : "#94a3b8",
                    fontFamily: "'Outfit', sans-serif",
                    marginTop: 6,
                  }}
                >
                  {p1.resultText}
                </div>
              )}
              {p1?.status && (
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    fontFamily: "'Outfit', sans-serif",
                    marginTop: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {p1.status.replace(/_/g, " ")}
                </div>
              )}
            </div>

            {/* VS divider */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#ff7425",
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: "0.05em",
                flexShrink: 0,
              }}
            >
              VS
            </div>

            {/* Player 2 */}
            <div
              style={{
                flex: 1,
                background: p2?.isWinner && isDone
                  ? "linear-gradient(135deg, rgba(255,116,37,0.12), rgba(255,116,37,0.04))"
                  : "rgba(255,255,255,0.03)",
                border: p2?.isWinner && isDone
                  ? "1px solid rgba(255,116,37,0.3)"
                  : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: "16px 14px",
                textAlign: "center",
                position: "relative",
                transition: "all 0.2s",
              }}
            >
              {p2?.isWinner && isDone && (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 16,
                  }}
                >
                  👑
                </div>
              )}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 auto 10px",
                  fontFamily: "'Outfit', sans-serif",
                  opacity: isDone && !p2?.isWinner ? 0.45 : 1,
                }}
              >
                {(p2?.name || "TBD")[0].toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: p2?.isWinner && isDone ? "#ff7425" : "#ffffff",
                  fontFamily: "'Outfit', sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  opacity: isDone && !p2?.isWinner ? 0.5 : 1,
                }}
              >
                {p2?.name || "TBD"}
              </div>
              {p2?.resultText != null && (
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: p2?.isWinner && isDone ? "#ff7425" : "#94a3b8",
                    fontFamily: "'Outfit', sans-serif",
                    marginTop: 6,
                  }}
                >
                  {p2.resultText}
                </div>
              )}
              {p2?.status && (
                <div
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    fontFamily: "'Outfit', sans-serif",
                    marginTop: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {p2.status.replace(/_/g, " ")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid rgba(255,116,37,0.35)",
              background: "rgba(255,116,37,0.1)",
              color: "#ff7425",
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#ff7425";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,116,37,0.1)";
              (e.currentTarget as HTMLButtonElement).style.color = "#ff7425";
            }}
          >
            Close
          </button>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { opacity: 0; transform: translate(-50%, -46%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>, (document.fullscreenElement ?? document.body) as Element
  );
};
// ─── Match Card ────────────────────────────────────────────────────────────────
export const MatchCard = ({ match, style, matchNumber }: { match: BracketMatch; style?: React.CSSProperties; matchNumber?: number }) => {
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isDone =
    match.state === "DONE" ||
    match.state === "SCORE_DONE" ||
    match.state === "WALK_OVER" ||
    match.state === "COMPLETED";

  const p1 = match.participants?.[0];
  const p2 = match.participants?.[1];

  return (
    <>
      {/* Outer wrapper owns the hover — covers card + button area below */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          width: CARD_W,
          /* Extend hit-area downward to cover the button (card height + gap + button height) */
          paddingBottom: hovered ? 36 : 0,
          boxSizing: "border-box",
          ...style,
        }}
      >
        {/* The visible card */}
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            borderRadius: 8,
            overflow: "hidden",
            border: hovered
              ? "1px solid rgba(255,116,37,0.45)"
              : "1px solid rgba(255,255,255,0.09)",
            background: "#12171f",
            boxSizing: "border-box",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: hovered
              ? "0 0 0 2px rgba(255,116,37,0.12), 0 8px 24px rgba(0,0,0,0.4)"
              : "none",
          }}
        >
          <PlayerRow player={p1} isDone={isDone} />
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
          <PlayerRow player={p2} isDone={isDone} />
        </div>

        {/* Hover button — sits inside the same hover zone, below the card */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              top: CARD_H + 6,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              animation: "popIn 0.18s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 6,
                border: "1px solid rgba(255,116,37,0.5)",
                background: "rgba(15,20,30,0.97)",
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                transition: "background 0.15s",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,116,37,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(15,20,30,0.97)";
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff7425"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Match Details
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <MatchDetailsModal match={match} onClose={() => setModalOpen(false)} matchNumber={matchNumber} />
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.85); }
          to   { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>
    </>
  );
};
