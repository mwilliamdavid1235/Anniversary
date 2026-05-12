"use client";

import { useState, useCallback } from "react";
import type { Playlist, SpotifyPlaylistResult } from "@/types";

interface PlaylistCardProps {
  playlist: Playlist;
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "results"; results: SpotifyPlaylistResult[] }
  | { status: "playing"; playlist: SpotifyPlaylistResult }
  | { status: "error"; message: string };

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const [state, setState] = useState<State>({ status: "idle" });

  const findPlaylist = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch(
        `/api/spotify/search?q=${encodeURIComponent(playlist.spotifyQuery)}&limit=5`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");

      if (data.results.length === 0) {
        setState({ status: "error", message: "No playlists found. Try Spotify directly." });
        return;
      }

      // Auto-select the top result for a seamless experience
      setState({ status: "playing", playlist: data.results[0] });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  }, [playlist.spotifyQuery]);

  const embedUrl = `https://open.spotify.com/embed/playlist/${
    state.status === "playing" ? state.playlist.id : ""
  }?utm_source=generator&theme=0`;

  return (
    <div
      className="mt-5 rounded-xl border overflow-hidden"
      style={{
        borderColor: "#1E3319",
        background: "rgba(109,184,126,0.04)",
      }}
    >
      {/* Card header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-[#1E3319]">
        {/* Music note icon */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{
            width: 32,
            height: 32,
            background: "rgba(109,184,126,0.12)",
            border: "1px solid #2D4D28",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6DB87E" strokeWidth="1.5">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[9px] tracking-[0.18em] uppercase" style={{ color: "#6DB87E" }}>
            Playlist
          </p>
          <p className="font-display italic leading-tight truncate" style={{ fontSize: "16px", color: "#E2D9C6" }}>
            {playlist.label}
          </p>
        </div>

        {/* Mood tag */}
        <span
          className="text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded flex-shrink-0"
          style={{
            color: "#3D6B47",
            background: "rgba(61,107,71,0.2)",
            border: "1px solid #2D4D28",
          }}
        >
          {playlist.mood.split(" ").slice(0, 2).join(" ")}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        {state.status === "idle" && (
          <button
            onClick={findPlaylist}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all duration-150 active:scale-[0.98]"
            style={{
              background: "rgba(29,185,84,0.1)",
              border: "1px solid rgba(29,185,84,0.2)",
              color: "#1DB954",
              fontSize: "12px",
              letterSpacing: "0.05em",
            }}
          >
            {/* Spotify logo */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Find on Spotify
          </button>
        )}

        {state.status === "loading" && (
          <div className="flex items-center justify-center gap-2 py-2">
            <div
              className="animate-spin rounded-full"
              style={{
                width: 14,
                height: 14,
                border: "1.5px solid #2D4D28",
                borderTopColor: "#1DB954",
              }}
            />
            <span className="text-[11px] tracking-[0.06em]" style={{ color: "#6E8A74" }}>
              Searching Spotify…
            </span>
          </div>
        )}

        {state.status === "playing" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] tracking-[0.12em] uppercase" style={{ color: "#6E8A74" }}>
                Now playing
              </span>
              <button
                onClick={() => setState({ status: "idle" })}
                className="text-[9px] tracking-[0.08em] uppercase transition-colors"
                style={{
                  color: "#3A5040",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Change
              </button>
            </div>
            <iframe
              src={embedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="spotify-frame"
              title={`Spotify: ${state.playlist.name}`}
            />
          </div>
        )}

        {state.status === "error" && (
          <div className="text-center py-2">
            <p className="text-[11px] mb-2" style={{ color: "#6E8A74" }}>
              {state.message}
            </p>
            <button
              onClick={() => setState({ status: "idle" })}
              className="text-[10px] tracking-[0.1em] uppercase"
              style={{
                color: "#C49A45",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
