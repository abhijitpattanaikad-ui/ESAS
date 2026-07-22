"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Gamepad2, Users, Shield, Clock, Calendar, 
  Share2, ChevronDown, CheckCircle2, Ticket, ChevronLeft,
  Monitor, Globe, Trophy, MapPin
} from "lucide-react";
import { intervalToDuration, isAfter, parseISO } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { BracketView } from "@/app/(components)/shared/BracketView";
import dynamic from "next/dynamic";
import { tournamentService } from "@/app/(services)/tournamentService";
import type { ApiTournament } from "@/app/(types)/event";
import { ExGlowButton, ExIconBrackets } from "@/app/(components)/ui";

const DynamicBracketView = dynamic(() => Promise.resolve(BracketView), { ssr: false });

export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [tournament, setTournament] = useState<ApiTournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const id = params?.id as string;
      if (!id) return;
      
      const data = await tournamentService.getTournamentById(id);
      setTournament(data);
      setLoading(false);
    }
    loadData();
  }, [params]);

  useEffect(() => {
    if (!tournament || !tournament.schedule) return;

    const timer = setInterval(() => {
      const h = (tournament.heading || "").toLowerCase();
      const s = tournament.schedule;

      let targetDateStr = s.registrationStart;
      if (h.includes("registration ends")) targetDateStr = s.registrationEnd;
      else if (h.includes("tournament starts")) targetDateStr = s.tournamentStart;
      else if (h.includes("tournament ends")) targetDateStr = s.tournamentEnd;

      if (!targetDateStr) return;

      const targetDate = parseISO(targetDateStr);
      const now = new Date();

      if (isAfter(now, targetDate)) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const duration = intervalToDuration({ start: now, end: targetDate });
      setTimeLeft({
        days: duration.days || 0,
        hours: duration.hours || 0,
        minutes: duration.minutes || 0,
        seconds: duration.seconds || 0
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tournament]);

  const formatTime = (unit: number) => unit.toString().padStart(2, "0");

  const formatDateTime = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "TBA";
    const date = new Date(dateStr);
    const day = date.getDate();
    const dayFormatted = day.toString().padStart(2, "0");
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || Math.floor(day % 100 / 10) === 1) ? 0 : day % 10];
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dayFormatted}${suffix} ${month} ${year}, ${time}`;
  };

  const tabs = ["OVERVIEW", "PARTICIPANTS", "PRIZES", "RULES", "BRACKET", "STANDINGS"];

  const handleJoin = async () => {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    if (!token || token === "undefined" || token === "null") {
      router.push("/login");
      return;
    }

    if (!tournament?._id) return;

    setIsJoining(true);
    const result = await tournamentService.joinTournament(tournament._id);
    setIsJoining(false);

    if (result.success) {
      toast.success("Successfully joined the tournament!");
      const data = await tournamentService.getTournamentById(params?.id as string);
      setTournament(data);
    } else {
      toast.error(result.message || "Failed to join tournament");
    }
  };

  const handleLeave = async () => {
    let token = "";
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token") || "";
    }

    if (!token || token === "undefined" || token === "null") {
      router.push("/login");
      return;
    }

    if (!tournament?._id) return;

    setIsLeaving(true);
    const result = await tournamentService.leaveTournament(tournament._id);
    setIsLeaving(false);

    if (result.success) {
      toast.success("Successfully left the tournament!");
      const data = await tournamentService.getTournamentById(params?.id as string);
      setTournament(data);
    } else {
      toast.error(result.message || "Failed to leave tournament");
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-background min-h-screen flex items-center justify-center pb-20">
        <div className="w-12 h-12 border-4 border-jaffa-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="w-full bg-background min-h-screen text-white flex flex-col items-center justify-center pb-20">
        <h2 className="text-2xl font-bold mb-4">Tournament Not Found</h2>
        <button onClick={() => router.back()} className="text-jaffa-500 hover:text-jaffa-400">Go Back</button>
      </div>
    );
  }

  const now = new Date();
  const isRegistrationOpen = (tournament.schedule?.registrationStart 
    ? now >= new Date(tournament.schedule.registrationStart)
    : true) && (tournament.schedule?.registrationEnd 
    ? now <= new Date(tournament.schedule.registrationEnd)
    : true);
  
  const hasJoined = tournament.joinStatus && tournament.joinStatus !== "not-joined";
  
  const isJoinDisabled = isJoining || !isRegistrationOpen || hasJoined || tournament.status === "Completed" || tournament.buttonText === "Registration Ended";
  const isLeaveDisabled = isLeaving || tournament.status === "Completed";

  return (
    <div className="w-full bg-background min-h-screen text-white pb-20">
      <div className="relative w-full h-28 md:h-72 lg:h-126 md:overflow-hidden">
        <div 
          className="absolute inset-0 bg-[#0a0f18] bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: `url('${tournament.assets?.mobileBanner || tournament.assets?.desktopBanner || "/images/events/pubgm.jpg"}')` }}
        />
        <div 
          className="absolute inset-0 bg-[#0a0f18] bg-cover bg-center hidden md:block" 
          style={{ backgroundImage: `url('${tournament.assets?.desktopBanner || "/images/events/pubgm.jpg"}')` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent"></div>
        <div className="container mx-auto absolute inset-0 p-3 flex flex-col justify-between md:px-8 md:py-12">
          <div className="flex justify-start">
            <button onClick={() => router.back()}
              className="w-10 h-10 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors pointer-events-auto cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-jaffa-500/30 bg-black/50 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-2xl overflow-hidden">
                {tournament.assets?.logo ? (
                  <img src={tournament.assets.logo} alt="Tournament Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-2xl md:text-5xl text-white italic tracking-tighter">
                    {tournament.name?.substring(0, 4).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-6 md:mt-0 p-4 md:px-8 relative z-10 border-b border-white/10">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 md:gap-4">
          <div className="min-w-0 flex-1">
            {/* Brands Section */}
            {tournament.sponsors && tournament.sponsors.length > 0 && (
              <div className="flex items-center gap-3 mb-4">
                {tournament.sponsors.map((sponsor) => (
                  <div key={sponsor._id} className="h-8 px-3 bg-white/5 rounded-md overflow-hidden border border-white/5 hover:border-jaffa-500/50 transition-colors cursor-pointer flex items-center justify-center group" title={sponsor.name}>
                    <img 
                      src={sponsor.thumbnail} 
                      alt={sponsor.name} 
                      className="max-h-4 max-w-[80px] object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black tracking-widest text-jaffa-500 uppercase bg-jaffa-500/10 px-2 py-0.5 rounded">
                {tournament.message || `${tournament.status || "Upcoming"} ${tournament.text ? `- ${tournament.text}` : ""}`}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#BDBDBD] uppercase">
                {tournament.schedule?.tournamentStart ? new Date(tournament.schedule.tournamentStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : ""}
              </span>
            </div>
            <h4 className="text-2xl md:text-4xl font-black heading-font text-white tracking-tight uppercase">
              {tournament.name}
            </h4>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <span className="font-medium">Organized by</span>
              <span className="text-jaffa-500 font-bold hover:text-jaffa-400 cursor-pointer transition-colors flex items-center gap-1 uppercase">
                {tournament.organisedBy || "FACEIT"}
                <CheckCircle2 className="w-4 h-4 text-jaffa-500 shrink-0" />
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight">
              <span className="text-white/60">{tournament.heading || "Check-in close"}:</span>
              <span className="text-jaffa-500 font-black tabular-nums">
                {timeLeft.days > 0 && `${formatTime(timeLeft.days)}d `}
                {timeLeft.hours > 0 && `${formatTime(timeLeft.hours)}h `}
                {formatTime(timeLeft.minutes)}m
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {hasJoined ? (
                <ExGlowButton onClick={handleLeave} disabled={isLeaveDisabled} className="min-w-[200px]! text-sm! from-red-600! to-red-800! border-red-500/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                  {isLeaving ? "LEAVING..." : "LEAVE TOURNAMENT"}
                </ExGlowButton>
              ) : (
                <ExGlowButton onClick={handleJoin} disabled={isJoinDisabled} className="min-w-[200px]! text-sm!">
                  {isJoining ? "JOINING..." : (tournament.buttonText || "JOIN TOURNAMENT")}
                </ExGlowButton>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-4 md:gap-8 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-bold tracking-wider relative transition-colors cursor-pointer ${
                activeTab === tab 
                  ? "text-jaffa-500" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {tab}
                {tab === "PARTICIPANTS" && (
                  <span className="bg-white/10 text-xs px-1.5 py-0.5 rounded text-white font-normal">
                    {tournament.participatedPlayers?.length || 0}
                  </span>
                )}
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-jaffa-500" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8 flex flex-col">
          
          {activeTab === "OVERVIEW" && (
            <>
              <section>
                <h2 className="text-xl font-bold heading-font mb-4">Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="flex items-start gap-3">
                    <Gamepad2 className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Game</div>
                      <div className="text-sm font-semibold mt-1">{tournament.game?.name || "N/A"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mode</div>
                      <div className="text-sm font-semibold mt-1">
                        {tournament.mode === "duelSolo" ? "1v1" : tournament.mode || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ExIconBrackets className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Format</div>
                      <div className="text-sm font-semibold mt-1">{tournament.format || "N/A"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Platform</div>
                      <div className="text-sm font-semibold mt-1 uppercase">{tournament.platform || "N/A"}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</div>
                      <div className="text-sm font-semibold mt-1">{tournament.isOnline ? "Online" : "Offline"}</div>
                    </div>
                  </div>
                  {!tournament.isOnline && tournament.city && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">City</div>
                        <div className="text-sm font-semibold mt-1 capitalize">{tournament.city}</div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
              {tournament.description && (
                <section className="bg-woodsmoke-900/40 border border-white/5 rounded-xl p-5 md:p-6 overflow-hidden">
                  <div 
                    className="tournament-html-content"
                    dangerouslySetInnerHTML={{ __html: tournament.description }}
                  />
                </section>
              )}
            </>
          )}

          {activeTab === "PARTICIPANTS" && (
            <section className="bg-woodsmoke-900/40 border border-white/5 rounded-xl p-5 md:p-6">
              <h2 className="text-xl font-bold heading-font mb-6">Participants</h2>
              {tournament.participatedPlayers && tournament.participatedPlayers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tournament.participatedPlayers.map((player: any, index: number) => (
                    <div key={player._id || index} className="flex items-center gap-4 bg-black/40 p-3 rounded-lg border border-white/5 hover:border-jaffa-500/30 transition-colors">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 flex items-center justify-center">
                        {player.profileImage ? (
                          <img src={player.profileImage} alt={player.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-gray-400">
                            {player.username?.charAt(0).toUpperCase() || "?"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{player.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No participants yet.
                </div>
              )}
            </section>
          )}



          {activeTab === "RULES" && (
            <section className="bg-woodsmoke-900/40 border border-white/5 rounded-xl p-5 md:p-6 overflow-hidden">
              {tournament.rules ? (
                <div 
                  className="tournament-html-content"
                  dangerouslySetInnerHTML={{ __html: tournament.rules }}
                />
              ) : tournament.rulesLink ? (
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <h2 className="text-2xl font-bold heading-font mb-2 text-white/50">RULES</h2>
                  <p className="text-gray-400">Please refer to the official rules document below.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <h2 className="text-2xl font-bold heading-font mb-2 text-white/50">RULES</h2>
                  <p className="text-gray-500">Information for rules will be available soon.</p>
                </div>
              )}
              {tournament.rulesLink && (
                <div className={`flex justify-center ${tournament.rules ? 'mt-8 pt-6 border-t border-white/10' : 'mt-4'}`}>
                  <a 
                    href={tournament.rulesLink.startsWith('http') ? tournament.rulesLink : `https://${tournament.rulesLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-jaffa-500 hover:text-jaffa-400 font-bold transition-colors"
                  >
                    View Official Rules Document
                  </a>
                </div>
              )}
            </section>
          )}

          {(activeTab === "PRIZES" || activeTab === "STANDINGS") && (
            <section className="bg-woodsmoke-900/40 border border-white/5 rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold heading-font mb-2 text-white/50">{activeTab}</h2>
              <p className="text-gray-500">Information for {activeTab.toLowerCase()} will be available soon.</p>
            </section>
          )}

          {activeTab === "BRACKET" && (
            <section className="bg-woodsmoke-900/40 border border-white/5 rounded-xl p-5 md:p-8">
              <DynamicBracketView tournamentId={params?.id as string} format={tournament?.format} />
            </section>
          )}

        </div>
        <div className="lg:col-span-4 space-y-8">
          <section>
            <h2 className="text-xl font-bold heading-font mb-4">Schedule</h2>
            <div className="border border-white/10 rounded-xl overflow-hidden bg-woodsmoke-900/30 divide-y divide-white/5">
              <div className="flex items-center gap-3 p-4">
                <Calendar className="w-5 h-5 text-jaffa-500" />
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Registration Starts</div>
                  <div className="text-sm font-bold mt-0.5 text-white">
                    {formatDateTime(tournament.schedule?.registrationStart)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <Calendar className="w-5 h-5 text-jaffa-500" />
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Registration Ends</div>
                  <div className="text-sm font-bold mt-0.5 text-white">
                    {formatDateTime(tournament.schedule?.registrationEnd)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <Calendar className="w-5 h-5 text-jaffa-500" />
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tournament Starts</div>
                  <div className="text-sm font-bold mt-0.5 text-white">
                    {formatDateTime(tournament.schedule?.tournamentStart)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <Calendar className="w-5 h-5 text-jaffa-500" />
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tournament Ends</div>
                  <div className="text-sm font-bold mt-0.5 text-white">
                    {formatDateTime(tournament.schedule?.tournamentEnd)}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {tournament.prizePool && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold heading-font">Prize Pool</h2>
              </div>
              <div className="border border-white/10 rounded-xl overflow-hidden bg-woodsmoke-900/30 text-center p-6">
                <div className="text-3xl font-black text-jaffa-500 tracking-tight">
                  {Number(tournament.prizePool).toLocaleString()}
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase mt-1">Total Reward</div>
              </div>
            </section>
          )}
          <section>
            <h2 className="text-xl font-bold heading-font mb-4">Requirements</h2>
            <div className="border border-white/10 rounded-xl divide-y divide-white/5 bg-woodsmoke-900/30 overflow-hidden text-[#BDBDBD]">
              <div className="flex items-center justify-between gap-2 p-4">
                <span className="text-sm font-bold shrink-0">Region</span>
                <span className="text-sm">{tournament.regions || "Any"}</span>
              </div>

              {tournament.allowedCountries && tournament.allowedCountries.length > 0 && (
                <div className="flex flex-col gap-2 p-4">
                  <span className="text-sm font-bold shrink-0">Country Eligible</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tournament.allowedCountries.map((country, index) => (
                      <span key={index} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 font-medium">
                        {country.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>


        </div>
      </div>

    </div>
  );
}