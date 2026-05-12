export type EventType = "travel" | "lodging" | "restaurant" | "activity";

export interface EventLink {
  label: string;
  href: string;
  kind: "waze" | "website" | "menu" | "reserve" | "phone" | "tickets";
}

export interface EventOption {
  id: string;
  name: string;
  description: string;
  links: EventLink[];
}

export interface Playlist {
  id: string;
  label: string;         // e.g. "For the drive up"
  mood: string;          // e.g. "indie folk road trip"
  spotifyQuery: string;  // search query for Spotify API
  spotifyPlaylistId?: string; // pre-seeded Spotify playlist ID (optional)
}

export interface TripEvent {
  id: string;
  time: string;          // "15:00"
  title: string;
  type: EventType;
  description: string;
  note?: string;         // confirmation / green note
  links?: EventLink[];
  options?: EventOption[]; // mutually exclusive choices
  playlist?: Playlist;   // inline playlist card
}

export interface TripDay {
  id: string;
  dayNumber: number;      // 1 | 2 | 3
  label: string;          // "Friday"
  date: string;           // "2026-06-06"
  events: TripEvent[];
}

export interface Trip {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate: string;
  days: TripDay[];
}

// Spotify API types
export interface SpotifyPlaylistResult {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  externalUrl: string;
  trackCount: number;
  owner: string;
}
