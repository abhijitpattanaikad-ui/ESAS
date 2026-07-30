export type EventStatus = "live" | "upcoming" | "completed";
export type EventMode = "online" | "offline";

export interface TournamentEvent {
  id: string;
  name: string;
  game: string;
  organizer: string;
  date: string;
  prizePool: string;
  participants: number;
  maxParticipants: number;
  status: EventStatus;
  mode: EventMode;
  imageUrl: string;
  format: string;
  tournamentType: string;
}

export interface ApiTournamentAssets {
  logo?: string;
  thumbnail?: string;
  desktopBanner?: string;
  mobileBanner?: string;
}

export interface ApiGameAssets {
  thumbnail?: string;
  desktopBanner?: string;
  mobileBanner?: string;
}

export interface ApiGame {
  name: string;
  shortName?: string;
  assets?: ApiGameAssets;
}

export interface ApiSchedule {
  registrationStart?: string;
  registrationEnd?: string;
  tournamentStart?: string;
  tournamentEnd?: string;
}

export type ApiTournamentStatus = "Upcoming" | "Ongoing" | "Completed" | "Registration Open" | "Starting Soon" | "Status unavailable";

export interface ApiSponsor {
  _id: string;
  name: string;
  thumbnail?: string;
}

export interface ApiParticipant {
  _id?: string;
  username?: string;
  profileImage?: string;
}

export interface ApiTournament {
  _id?: string;
  name: string;
  isDraft: boolean;
  status: ApiTournamentStatus;
  heading?: string;
  text?: string;
  assets: ApiTournamentAssets;
  game: ApiGame;
  schedule: ApiSchedule;
  isOnline?: boolean;
  city?: string;
  country?: string;
  regions?: string;
  mode?: string;
  format?: string;
  platform?: string;
  prizePool?: string | number;
  description?: string;
  shortDescription?: string;
  rules?: string;
  prizes?: unknown[];
  rulesLink?: string;
  joinStatus?: string;
  message?: string;
  buttonText?: string;
  participatedPlayers?: ApiParticipant[];
  sponsors?: ApiSponsor[];
  competition?: string;
  allowedCountries?: string[];
  organisedBy?: string;
}
