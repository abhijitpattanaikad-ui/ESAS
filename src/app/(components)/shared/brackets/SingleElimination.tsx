"use client";

import React, { useRef, useCallback } from "react";
import { BracketMatch, MatchCard, CARD_H, CARD_W, Round, buildRounds } from "./BracketShared";

const MATCH_GAP     = 12;
const COL_GAP       = 80;
const BRANCH_X      = 20;
const ROUND_HDR_H   = 36;
const ROUND_HDR_MB  = 10;
const CARD_AREA_TOP = ROUND_HDR_H + ROUND_HDR_MB;

const VERTICAL_UNIT = CARD_H + MATCH_GAP;

function getMatchY(ri: number, slot: number): number {
  const gap = VERTICAL_UNIT * Math.pow(2, ri);
  return CARD_AREA_TOP + slot * gap + gap / 2;
}

// ─── Connector SVG ─────────────────────────────────────────────────────────────
const ConnectorSVG = ({ ri, matches, rounds, totalH, numMap }: {
  ri: number; matches: BracketMatch[]; rounds: Round[]; totalH: number;
  numMap: Record<string, number>;
}) => {
  const W = COL_GAP;
  const paths: string[] = [];
  const labels: { x: number; y: number; text: string }[] = [];

  const nextRoundMatches = rounds[ri + 1]?.matches || [];
  const outputtedParents = new Set<number>();

  matches.forEach((m) => {
    const slot = (m as any).gridSlot ?? 0;
    const parentSlot = Math.floor(slot / 2);
    const parentMatch = nextRoundMatches.find(pm => (pm as any).gridSlot === parentSlot);
    const fY = getMatchY(ri, slot);
    const tY = getMatchY(ri + 1, parentSlot);

    // Horizontal from current match to BRANCH_X
    paths.push(`M 0 ${fY} H ${BRANCH_X}`);
    
    // Vertical connection from current match Y to parent's Y level
    paths.push(`M ${BRANCH_X} ${fY} V ${tY}`);

    // Horizontal from BRANCH_X midpoint to target round
    if (!outputtedParents.has(parentSlot)) {
      paths.push(`M ${BRANCH_X} ${tY} H ${W}`);
      
      if (parentMatch) {
        const matchNum = numMap[String(parentMatch.id)];
        if (matchNum) {
          labels.push({ x: BRANCH_X + 5, y: tY, text: String(matchNum) });
        }
      }
      outputtedParents.add(parentSlot);
    }
  });

  return (
    <svg width={W} height={totalH} style={{ flexShrink: 0, display: "block", overflow: "visible" }}>
      {paths.map((d, i) => (
        <path key={i} d={d} stroke="rgba(255,255,255,0.3)" strokeWidth={1} fill="none" strokeLinecap="square" strokeLinejoin="miter" />
      ))}
      {labels.map((lbl, i) => (
        <text key={i} x={lbl.x} y={lbl.y} dy="0.35em" fill="#ffffff"
          style={{ fontSize: 11, fontWeight: 900, fontFamily: "'Outfit', sans-serif" }}>
          {lbl.text}
        </text>
      ))}
    </svg>
  );
};

// ─── Final arrow (short line pointing right, no box) ──────────────────────────
const FinalArrow = ({ totalH, finalY }: { totalH: number; finalY: number }) => {
  const W = 32;
  return (
    <svg width={W} height={totalH} style={{ flexShrink: 0, display: "block", overflow: "visible" }}>
      <path d={`M 0 ${finalY} H ${W}`} stroke="rgba(255,116,37,0.5)" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <polygon points={`${W},${finalY} ${W-6},${finalY-4} ${W-6},${finalY+4}`} fill="#ff7425" opacity={0.9} />
    </svg>
  );
};

// ─── Champion box (outside scroll, aligned with final match) ──────────────────
const ChampionBox = ({ name, finalY }: { name: string; finalY: number }) => {
  const BOX_H = 52;
  return (
    <div style={{
      flexShrink: 0,
      paddingTop: finalY - BOX_H / 2,
      boxSizing: "border-box",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 14px 8px 12px",
        borderRadius: 12,
        border: "1.5px solid rgba(255,116,37,0.65)",
        background: "linear-gradient(135deg, rgba(255,116,37,0.2) 0%, rgba(255,154,92,0.09) 100%)",
        boxShadow: "0 0 28px rgba(255,116,37,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}>
        <span style={{ fontSize: 22 }}>🏆</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#ff7425",
            fontFamily: "'Outfit', sans-serif",
          }}>Champion</span>
          <span style={{
            fontSize: 14, fontWeight: 800, color: "#ffffff",
            fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap",
          }}>{name}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Round header ──────────────────────────────────────────────────────────────
const RoundHeader = ({ title, series, width }: { title: string; series?: string | null; width: number }) => (
  <div style={{ position: "absolute", top: 0, left: 0, width, height: ROUND_HDR_H,
    background: "rgba(15,20,30,0.95)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 2,
    fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
    color: "#fff", fontFamily: "'Outfit',sans-serif", zIndex: 1 }}>
    <span>{title}</span>
    {series && (
      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "#ff7425",
        background: "rgba(255,116,37,0.12)", border: "1px solid rgba(255,116,37,0.3)",
        borderRadius: 4, padding: "1px 5px", lineHeight: 1.4 }}>
        {series}
      </span>
    )}
  </div>
);

// ─── Main ──────────────────────────────────────────────────────────────────────
export const SingleElimination = ({ matches }: { matches: BracketMatch[] }) => {
  if (!matches || matches.length === 0) return null;
  const rounds = buildRounds(matches);
  if (rounds.length === 0) return null;

  // ─── Absolute Grid Slot Assignment ──────────────────────────────────────────
  // Trace backwards from final to assign consistent slots (0, 1, 2...)
  const lastRound = rounds[rounds.length - 1];
  lastRound.matches.forEach((m, i) => { (m as any).gridSlot = i; });

  for (let ri = rounds.length - 1; ri > 0; ri--) {
    const curr = rounds[ri];
    const prev = rounds[ri - 1];
    curr.matches.forEach(m => {
      const pSlot = (m as any).gridSlot ?? 0;
      const children = prev.matches.filter(pm => String(pm.nextMatchId) === String(m.id));
      
      children.forEach(c => {
        // Determine if this child feeds participant 0 or 1 of the parent
        const p0Id = m.participants?.[0]?.id;
        const feedsP0 = c.participants?.some(cp => cp.isWinner && String(cp.id) === String(p0Id)) 
                     || (children.length === 2 && children.indexOf(c) === 0);
        
        (c as any).gridSlot = pSlot * 2 + (feedsP0 ? 0 : 1);
      });
    });
  }

  const scrollRef  = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    scrollRef.current?.setPointerCapture(e.pointerId);
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !scrollRef.current) return;
    scrollRef.current.scrollLeft = scrollLeft.current - (e.clientX - startX.current);
  }, []);
  const stopDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    scrollRef.current?.releasePointerCapture(e.pointerId);
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  const maxSlots = Math.pow(2, rounds.length - 1);
  const totalH = maxSlots * VERTICAL_UNIT + CARD_AREA_TOP + 40;

  let num = 0;
  const numMap: Record<string, number> = {};
  rounds.forEach(r => r.matches.forEach(m => { numMap[String(m.id)] = ++num; }));

  const seedMap: Record<string, number> = {};
  let seed = 1;
  rounds[0].matches.forEach(m => {
    [m.participants?.[0], m.participants?.[1]].forEach(p => {
      if (p) seedMap[String(p.id)] = seed;
      seed++;
    });
  });

  const finalRound  = rounds[rounds.length - 1];
  const finalMatch  = finalRound?.matches[0];
  const finalY      = getMatchY(rounds.length - 1, 0);
  const champion    = finalMatch?.participants?.find(p => p.isWinner)?.name;

  return (
    <>
      <style>{`
        .bk-scroll::-webkit-scrollbar{display:none}
        .bk-scroll{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      {/* Outer flex row: [scrollable bracket] [final arrow] [champion box] */}
      <div style={{ display: "flex", alignItems: "flex-start", minHeight: totalH }}>

        {/* Clip wrapper — only clips horizontally, not vertically */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          {/* Scrollable bracket */}
          <div ref={scrollRef} className="bk-scroll"
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            onPointerUp={stopDrag} onPointerCancel={stopDrag}
            style={{ display: "flex", alignItems: "flex-start",
              overflowX: "auto", overflowY: "visible", minHeight: totalH,
              padding: "32px 60px 24px 44px", cursor: "grab", userSelect: "none" }}>

          {rounds.map((round, ri) => (
            <React.Fragment key={round.title}>
              <div style={{ position: "relative", width: CARD_W, flexShrink: 0,
                height: totalH, overflow: "visible", zIndex: 1 }}>
                <RoundHeader title={round.title} series={round.series} width={CARD_W} />
                {round.matches.map((match) => {
                  const slot = (match as any).gridSlot ?? 0;
                  const top = getMatchY(ri, slot) - CARD_H / 2;
                  const mws = ri === 0
                    ? { ...match, participants: (match.participants || []).map(p => ({ ...p, seed: seedMap[String(p.id)] })) }
                    : match;
                  return (
                    <div key={match.id} style={{ position: "absolute", top, left: 0 }}>
                      {/* Round 1 Match Number (shows to the left of the card) */}
                      {ri === 0 && (
                        <div style={{
                          position: "absolute",
                          left: -28,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 11,
                          fontWeight: 900,
                          color: "rgba(255,255,255,0.4)",
                          fontFamily: "'Outfit', sans-serif"
                        }}>
                          {numMap[String(match.id)]}
                        </div>
                      )}
                      <MatchCard match={mws}
                        matchNumber={numMap[String(match.id)]} />
                    </div>
                  );
                })}
              </div>

              {ri < rounds.length - 1 ? (
                <ConnectorSVG ri={ri} matches={round.matches} rounds={rounds} totalH={totalH} numMap={numMap} />
              ) : null}
            </React.Fragment>
          ))}

          {/* Final arrow + champion box — now inside the scroll, following the final round */}
          {finalMatch && (
            <div style={{ display: "flex", alignItems: "flex-start", flexShrink: 0 }}>
              <FinalArrow totalH={totalH} finalY={finalY} />
              {champion && <ChampionBox name={champion} finalY={finalY} />}
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};
