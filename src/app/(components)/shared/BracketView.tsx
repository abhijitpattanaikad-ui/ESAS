"use client";

import React, { useEffect, useRef, useState } from "react";
import { bracketService, BracketData } from "@/app/(services)/bracketService";
import { adaptBracketData } from "@/app/(utils)/bracketAdapter";
import { SingleElimination } from "./brackets/SingleElimination";
import { DoubleElimination } from "./brackets/DoubleElimination";
import { RoundRobin } from "./brackets/RoundRobin";
import { Loader2, AlertCircle, Maximize2, Minimize2 } from "lucide-react";

interface BracketViewProps {
  tournamentId: string;
  format?: string;
}

export const BracketView = ({ tournamentId, format }: BracketViewProps) => {
  const [data, setData] = useState<BracketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const bracketContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBrackets() {
      try {
        setLoading(true);
        const bracketData = await bracketService.getBracketsByTournamentId(tournamentId, format);
        if (bracketData) {
          const adapted = adaptBracketData(bracketData);
          setData(adapted);
        } else {
          setError("No bracket information available yet.");
        }
      } catch (err) {
        console.error("Error fetching brackets:", err);
        setError("Failed to load bracket data.");
      } finally {
        setLoading(false);
      }
    }

    if (tournamentId) {
      fetchBrackets();
    }
  }, [tournamentId]);

  // Sync isFullscreen state with browser fullscreen changes (e.g. user presses Esc)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!bracketContainerRef.current) return;
    if (!document.fullscreenElement) {
      await bracketContainerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <Loader2 className="w-10 h-10 text-jaffa-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Generating Bracket Layout...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Bracket Data Unavailable</h3>
        <p className="text-gray-500 max-w-sm">{error || "Information for bracket will be available soon."}</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Header row — title + fullscreen button */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1 bg-jaffa-500 rounded-full"></div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-white flex-1">
          {data.type.replace(/Bracket$/, "").replace(/([A-Z])/g, ' $1').trim()}
        </h2>

        {/* Fullscreen toggle button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,116,37,0.35)",
            background: isFullscreen ? "rgba(255,116,37,0.15)" : "rgba(255,255,255,0.05)",
            color: isFullscreen ? "#ff7425" : "#94a3b8",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,116,37,0.15)";
            (e.currentTarget as HTMLButtonElement).style.color = "#ff7425";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,116,37,0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = isFullscreen
              ? "rgba(255,116,37,0.15)"
              : "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLButtonElement).style.color = isFullscreen ? "#ff7425" : "#94a3b8";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,116,37,0.35)";
          }}
        >
          {isFullscreen ? (
            <Minimize2 size={14} />
          ) : (
            <Maximize2 size={14} />
          )}
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* Bracket container — fullscreen target */}
      <div
        ref={bracketContainerRef}
        className="w-full min-h-[600px] bg-black/20 rounded-xl border border-white/5 relative"
        style={{
          overflow: isFullscreen ? "auto" : "hidden",
          // In fullscreen mode: fill the screen with a dark background
          ...(isFullscreen && {
            background: "#0b0f18",
            borderRadius: 0,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "24px",
          }),
        }}
      >
        {/* Fullscreen exit hint */}
        {isFullscreen && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 4, height: 24, background: "#ff7425", borderRadius: 4 }} />
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#ffffff",
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {data.type.replace(/Bracket$/, "").replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <button
              onClick={toggleFullscreen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,116,37,0.4)",
                background: "rgba(255,116,37,0.12)",
                color: "#ff7425",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              <Minimize2 size={14} />
              Exit Fullscreen
            </button>
          </div>
        )}

        {data.type === "SingleEliminationBracket" && data.matches && (
          <SingleElimination matches={data.matches} />
        )}

        {data.type === "DoubleEliminationBracket" && (
          <DoubleElimination
            upperMatches={data.upperMatches || []}
            lowerMatches={data.lowerMatches || []}
          />
        )}

        {data.type === "roundrobin" && data.standings && (
          <RoundRobin standings={data.standings} />
        )}
      </div>
    </div>
  );
};
