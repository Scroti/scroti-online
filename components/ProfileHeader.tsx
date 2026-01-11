"use client";

interface ProfileHeaderProps {
  headerImage?: string;
  displayName: string;
  bio?: string;
  accentColor?: string;
}

export default function ProfileHeader({
  headerImage,
  displayName,
  bio,
  accentColor = "#065f46",
}: ProfileHeaderProps) {
  return (
    <div className="relative w-full">
      {/* Header Image */}
      {headerImage ? (
        <div className="relative w-full h-[400px] sm:h-[500px]">
          <img
            src={headerImage}
            alt="Header"
            className="w-full h-full object-cover"
            style={{
              objectFit: "cover",
            }}
          />
          {/* Circular fade overlay - pronounced radial vignette from top center */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 200% 400% at 50% 0%, transparent 0%, transparent 8%, rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0.45) 40%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 0.9) 75%, black 100%)`,
              zIndex: 1,
            }}
          />
          {/* Additional bottom overlay for better text contrast - matches reference image */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2/5"
            style={{
              background:
                "linear-gradient(to top, black 0%, rgba(0, 0, 0, 0.9) 40%, rgba(0, 0, 0, 0.6) 70%, transparent 100%)",
              zIndex: 2,
            }}
          />

          {/* Profile Info Overlay - positioned above all overlays, moved lower */}
          <div
            className="absolute bottom-0 left-0 right-0 p-8 pb-4"
            style={{
              zIndex: 10,
              transform:
                "translateY(30px)",
            }}
          >
            <div className="max-w-md mx-auto text-center">
              <h1
                className="text-5xl sm:text-6xl font-extrabold mb-3 tracking-tight"
                style={{
                  color: accentColor,
                  textShadow: `0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px ${accentColor}40, 0 0 80px ${accentColor}20`,
                }}
              >
                {displayName}
              </h1>
              {bio && (
                <p
                  className="text-lg sm:text-xl font-medium opacity-95"
                  style={{
                    color: accentColor,
                    textShadow:
                      "0 2px 10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {bio}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // No header image - show name and bio at top
        <div className="relative w-full py-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <h1
              className="text-5xl sm:text-6xl font-extrabold mb-3 tracking-tight"
              style={{
                color: accentColor,
                textShadow: `0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px ${accentColor}40`,
              }}
            >
              {displayName}
            </h1>
            {bio && (
              <p
                className="text-lg sm:text-xl font-medium opacity-95"
                style={{
                  color: accentColor,
                  textShadow:
                    "0 2px 10px rgba(0, 0, 0, 0.7)",
                }}
              >
                {bio}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
