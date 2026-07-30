// src/app/(utils)/bracketAdapter.ts

export const adaptBracketData = (rawData: any) => {
  if (!rawData) return null;

  let upperMatches: any[] = [];
  let lowerMatches: any[] = [];
  let flatMatches: any[] = [];
  let bracketType = rawData.type || "SingleEliminationBracket";

  // 1. Identification and Extraction
  if ((rawData.upper && rawData.lower) || (rawData.upperMatches && rawData.lowerMatches)) {
    upperMatches = rawData.upper || rawData.upperMatches;
    lowerMatches = rawData.lower || rawData.lowerMatches;
    bracketType = "DoubleEliminationBracket";
  } else if (rawData.matches) {
    flatMatches = rawData.matches;
  } else if (rawData.rounds) {
    rawData.rounds.forEach((round: any, roundIndex: number) => {
      (round.matches || []).forEach((match: any) => {
        flatMatches.push({
          ...match,
          tournamentRoundText: match.roundText || round.name || round.title || `Round ${roundIndex + 1}`,
          seriesText: round.series || match.series || null,
        });
      });
    });
  } else if (Array.isArray(rawData)) {
    // Check if it's an array of rounds or a flat array of matches
    if (rawData.length > 0 && rawData[0].matches) {
      rawData.forEach((round: any, roundIndex: number) => {
        (round.matches || []).forEach((match: any) => {
          flatMatches.push({
            ...match,
            tournamentRoundText: `Round ${round.round || roundIndex + 1}`,
          });
        });
      });
    } else {
      flatMatches = rawData;
    }
  }

  // Pre-process matches to normalize alternative schema fields (_id, opponents, competitor.username)
  const normalizeMatchFields = (ms: any[]) => {
    return ms.map((m) => {
      const id = m.id || m._id;
      let participants = m.participants;

      if (!participants && m.opponents) {
        participants = m.opponents.map((opp: any) => ({
          id: opp.competitor?._id || opp.id,
          name: opp.competitor?.username || opp.source || opp.name || "TBD",
          resultText: opp.score !== undefined && opp.score !== null ? String(opp.score) : opp.resultText,
          isWinner: opp.result === "win" || opp.isWinner,
        }));
      }

      return {
        ...m,
        id,
        participants: participants || [],
      };
    });
  };

  upperMatches = normalizeMatchFields(upperMatches);
  lowerMatches = normalizeMatchFields(lowerMatches);
  flatMatches = normalizeMatchFields(flatMatches);

  // 2. Name Map for Propagation
  const nameMap: Record<string, string> = {};
  const collectNames = (ms: any[]) => {
    ms.forEach((m) => {
      (m.participants || []).forEach((p: any) => {
        if (p.id && p.name && p.name !== "TBD") {
          nameMap[String(p.id)] = p.name;
        }
      });
    });
  };

  collectNames(upperMatches);
  collectNames(lowerMatches);
  collectNames(flatMatches);

  // 3. Sanitization Utility
  const sanitize = (ms: any[]) =>
    ms.map((m) => ({
      ...m,
      participants: (m.participants || []).map((p: any, idx: number) => {
        let id = p.id;
        // G-Loot and other libraries crash on null IDs
        if (id === null || id === undefined) {
          id = `tbd-${m.id}-${idx}`;
        }
        return {
          ...p,
          id,
          name: p.name || nameMap[String(id)] || "TBD",
        };
      }),
    }));

  // 4. Return Normalized Shape
  if (bracketType === "DoubleEliminationBracket") {
    return {
      ...rawData,
      type: bracketType,
      upperMatches: sanitize(upperMatches),
      lowerMatches: sanitize(lowerMatches),
    };
  }

  return {
    ...rawData,
    type: bracketType,
    matches: sanitize(flatMatches),
  };
};
