"use client";

import { Link } from "@/types";
import Image from "next/image";
import { FaMusic } from "react-icons/fa";

interface LinkButtonProps {
  link: Link;
  accentColor?: string;
}

export default function LinkButton({
  link,
  accentColor = "#065f46",
}: LinkButtonProps) {
  const handleClick = () => {
    if (link.url) {
      window.open(
        link.url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const isSpotify =
    link.type === "spotify" ||
    link.url?.includes("spotify.com") ||
    link.url?.includes(
      "open.spotify.com"
    );

  // Extract Spotify title and artist if it's a Spotify link
  const getSpotifyInfo = () => {
    if (
      isSpotify &&
      link.title.includes("-")
    ) {
      const parts =
        link.title.split("-");
      return {
        title: parts[0].trim(),
        artist: parts
          .slice(1)
          .join("-")
          .trim(),
      };
    }
    return {
      title: link.title,
      artist: link.description || "",
    };
  };

  const spotifyInfo = isSpotify
    ? getSpotifyInfo()
    : null;

  if (!link.url) {
    return null;
  }

  return (
    <div
      onClick={handleClick}
      className="relative w-full max-w-md mx-auto cursor-pointer group"
    >
      <div
        className="relative flex items-center gap-4 p-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
        style={{
          backgroundColor:
            "rgba(0, 0, 0, 0.5)",
          border: `1px solid ${accentColor}33`,
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 0px ${accentColor}33`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor =
            accentColor + "66";
          e.currentTarget.style.boxShadow = `0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px ${accentColor}33`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor =
            accentColor + "33";
          e.currentTarget.style.boxShadow = `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 0 0px ${accentColor}33`;
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${accentColor}08 0%, transparent 100%)`,
          }}
        />

        {link.thumbnail && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
            <Image
              src={link.thumbnail}
              alt={link.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        {isSpotify &&
          !link.thumbnail && (
            <div
              className="relative w-20 h-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-black/60 to-black/40 border flex items-center justify-center shadow-lg ring-1 ring-white/10 transition-all group-hover:ring-white/20"
              style={{
                color: accentColor,
                borderColor:
                  accentColor + "40",
              }}
            >
              <FaMusic
                size={28}
                className="drop-shadow-lg"
              />
            </div>
          )}
        {!link.thumbnail &&
          !isSpotify && (
            <div
              className="relative w-20 h-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-black/60 to-black/40 border flex items-center justify-center shadow-lg ring-1 ring-white/10 transition-all group-hover:ring-white/20"
              style={{
                borderColor:
                  accentColor + "40",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl blur-sm group-hover:blur-none transition-all duration-300"
                style={{
                  backgroundColor:
                    accentColor,
                  opacity: 0.4,
                }}
              />
              <div
                className="absolute w-6 h-6 rounded-lg"
                style={{
                  backgroundColor:
                    accentColor,
                  opacity: 0.6,
                }}
              />
            </div>
          )}
        <div className="flex-1 min-w-0 relative z-10">
          <h3
            className="font-semibold text-base truncate text-white mb-1 group-hover:text-gray-50 transition-colors"
            style={{
              textShadow:
                "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {spotifyInfo
              ? spotifyInfo.title
              : link.title}
          </h3>
          {(spotifyInfo?.artist ||
            link.description) && (
            <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors">
              {spotifyInfo
                ? spotifyInfo.artist
                : link.description}
            </p>
          )}
        </div>
        <div
          className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-all duration-300 relative z-10"
          style={{ color: accentColor }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
