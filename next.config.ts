import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },        // Spotify artwork
      { protocol: "https", hostname: "mosaic.scdn.co" },   // Spotify mosaic art
      { protocol: "https", hostname: "image-cdn-ak.spotifycdn.com" },
    ],
  },

  async headers() {
    return [
      {
        // Allow Spotify embed iframes
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://i.scdn.co https://mosaic.scdn.co https://image-cdn-ak.spotifycdn.com",
              "frame-src https://open.spotify.com",
              "connect-src 'self' https://api.spotify.com https://accounts.spotify.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
