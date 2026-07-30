"use client";

import React from "react";
import { 
  BracketMatch, 
  MatchCard, 
  CARD_H, 
  CARD_W,
  Round,
  buildRounds
} from "./BracketShared";

// ─── Constants ────────────────────────────────────────────────────────────────
const SLOT_H = 110;       // px per base slot
const COL_GAP = 50;      // connector column width
const HEADER_H = 36;     // round header height
const HEADER_MB = 12;    // margin below header
const CARD_AREA_TOP = HEADER_H + HEADER_MB;

// ─── SVG Connector ────────────────────────────────────────────────────────────
// Re-using the logic from SingleElimination but as a component
const ConnectorSVG = ({
  totalH,
  fromCount,
  fromSlotH,
  toSlotH,
  isLBIntermediate = false // If true, it's a straight connector (round with same number of matches)
}: {
  totalH: number;
  fromCount: number;
  fromSlotH: number;
  toSlotH: number;
  isLBIntermediate?: boolean;
}) => {
  const W = COL_GAP;
  const midX = W / 2;
  const paths: string[] = [];
  const arrowYs: number[] = [];

  if (isLBIntermediate) {
    // Round N and N+1 have same match count (e.g. LB R1 -> LB R2)
    // Straight line from each match to the next
    for (let i = 0; i < fromCount; i++) {
        const y = CARD_AREA_TOP + i * fromSlotH + fromSlotH / 2;
        paths.push(`M 0 ${y} H ${W}`);
        arrowYs.push(y);
    }
  } else {
    // Standard 2-to-1 merge
    const pairs = fromCount / 2;
    for (let i = 0; i < pairs; i++) {
      const topIdx = i * 2;
      const botIdx = i * 2 + 1;
      const topY = CARD_AREA_TOP + topIdx * fromSlotH + fromSlotH / 2;
      const botY = CARD_AREA_TOP + botIdx * fromSlotH + fromSlotH / 2;
      const targetY = CARD_AREA_TOP + i * toSlotH + toSlotH / 2;

      paths.push(`M 0 ${topY} H ${midX}`);
      paths.push(`M ${midX} ${topY} V ${botY}`);
      paths.push(`M 0 ${botY} H ${midX}`);
      paths.push(`M ${midX} ${targetY} H ${W}`);
      arrowYs.push(targetY);
    }
  }

  return (
    <svg width={W} height={totalH} style={{ flexShrink: 0, display: "block", overflow: "visible" }}>
      {paths.map((d, idx) => (
        <path key={idx} d={d} stroke="#2c344a" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {arrowYs.map((y, i) => (
        <polygon key={`arrow-${i}`} points={`${W},${y} ${W - 6},${y - 4} ${W - 6},${y + 4}`} fill="#ff7425" opacity={0.9} />
      ))}
    </svg>
  );
};

// ─── Bracket Section Renderer ─────────────────────────────────────────────────
const BracketSection = ({ title, rounds, isLower = false }: { title: string, rounds: Round[], isLower?: boolean }) => {
    if (rounds.length === 0) return null;
    
    // Calculate total height needed based on first round
    const firstRoundCount = rounds[0].matches.length;
    // For LB, sometimes the rounds have the same count. 
    // We use the first round as the baseline height.
    const totalH = CARD_AREA_TOP + firstRoundCount * SLOT_H + 24;

    return (
        <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="h-6 w-1 bg-jaffa-500 rounded-full"></div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white/40">
                    {title}
                </h3>
            </div>
            
            <div className="flex flex-row items-start overflow-x-auto pb-4 scrollbar-hide" style={{ minHeight: totalH }}>
                {rounds.map((round, roundIdx) => {
                    // Logic for slot height:
                    // UB: 2^0, 2^1, 2^2...
                    // LB: 2^0, 2^0, 2^1, 2^1, 2^2, 2^2...
                    let power = roundIdx;
                    if (isLower) {
                        power = Math.floor(roundIdx / 2);
                    }
                    const slotsPerMatch = Math.pow(2, power);
                    const slotH = SLOT_H * slotsPerMatch;

                    // Determine if next round merges or stays straight (LB specificity)
                    const nextRound = rounds[roundIdx + 1];
                    const isIntermediate = isLower && (roundIdx % 2 === 0) && nextRound && nextRound.matches.length === round.matches.length;

                    return (
                        <React.Fragment key={round.title}>
                            <div style={{ position: "relative", width: CARD_W, flexShrink: 0, height: totalH }}>
                                {/* Header */}
                                <div className="absolute top-0 left-0 right-0 h-[HEADER_H] bg-[#0f141e] border border-white/5 rounded-md flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-white/60 z-10" style={{ height: HEADER_H }}>
                                    {round.title}
                                </div>

                                {/* Matches */}
                                {round.matches.map((match, matchIdx) => {
                                    const slotTop = CARD_AREA_TOP + matchIdx * slotH;
                                    const cardTop = slotTop + (slotH - CARD_H) / 2;
                                    return (
                                        <MatchCard
                                            key={match.id}
                                            match={match}
                                            style={{ position: "absolute", top: cardTop, left: 0 }}
                                        />
                                    );
                                })}
                            </div>

                            {/* Connector */}
                            {roundIdx < rounds.length - 1 && (
                                <ConnectorSVG
                                    totalH={totalH}
                                    fromCount={round.matches.length}
                                    fromSlotH={slotH}
                                    toSlotH={isIntermediate ? slotH : slotH * 2}
                                    isLBIntermediate={isIntermediate}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const DoubleElimination = ({
  upperMatches,
  lowerMatches,
}: {
  upperMatches: BracketMatch[];
  lowerMatches: BracketMatch[];
}) => {
  // Separate Grand Finals from Upper Bracket if needed, 
  // or just let buildRounds handle it based on tournamentRoundText.
  
  // 1. Process Upper Bracket
  const ubRounds = buildRounds(upperMatches || []);
  
  // 2. Process Lower Bracket
  // Note: some APIs return LB rounds already sorted. buildRounds might need 
  // careful adjustment if LB logic differs, but usually grouping by text is fine.
  const lbRounds = buildRounds(lowerMatches || []);

  return (
    <div className="w-full animate-in fade-in duration-500">
        {/* Upper Bracket Section */}
        <BracketSection title="Winners Bracket" rounds={ubRounds} />
        
        {/* Lower Bracket Section */}
        <BracketSection title="Losers Bracket" rounds={lbRounds} isLower />
        
        <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
    </div>
  );
};
