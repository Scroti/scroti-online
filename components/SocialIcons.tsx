"use client";

import { SocialLink } from "@/types";
import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSoundcloud,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import {
  SiApplemusic,
  SiKick,
  SiMedium,
  SiRevolut,
} from "react-icons/si";

interface SocialIconsProps {
  socialLinks: SocialLink[];
  color?: string;
}

export default function SocialIcons({
  socialLinks,
  color = "#065f46",
}: SocialIconsProps) {
  const getIcon = (
    platform: string
  ) => {
    switch (platform) {
      case "instagram":
        return (
          <FaInstagram size={20} />
        );
      case "tiktok":
        return <FaTiktok size={20} />;
      case "youtube":
        return <FaYoutube size={20} />;
      case "spotify":
        return <FaSpotify size={20} />;
      case "twitter":
        return <FaTwitter size={20} />;
      case "facebook":
        return <FaFacebook size={20} />;
      case "linkedin":
        return <FaLinkedin size={20} />;
      case "snapchat":
        return <FaSnapchat size={20} />;
      case "pinterest":
        return (
          <FaPinterest size={20} />
        );
      case "twitch":
        return <FaTwitch size={20} />;
      case "discord":
        return <FaDiscord size={20} />;
      case "reddit":
        return <FaReddit size={20} />;
      case "github":
        return <FaGithub size={20} />;
      case "dribbble":
        return <FaDribbble size={20} />;
      case "behance":
        return <FaBehance size={20} />;
      case "medium":
        return <SiMedium size={20} />;
      case "telegram":
        return <FaTelegram size={20} />;
      case "whatsapp":
        return <FaWhatsapp size={20} />;
      case "soundcloud":
        return (
          <FaSoundcloud size={20} />
        );
      case "applemusic":
        return (
          <SiApplemusic size={20} />
        );
      case "kick":
        return <SiKick size={20} />;
      case "revolut":
        return <SiRevolut size={20} />;
      default:
        return <FaGlobe size={20} />;
    }
  };

  if (socialLinks.length === 0)
    return null;

  return (
    <div className="flex items-center justify-center gap-5 flex-wrap">
      {socialLinks.map(
        (social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative transition-all duration-300 hover:scale-110 group"
            style={{ color }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
              style={{
                backgroundColor: color,
                transform: "scale(1.5)",
              }}
            />
            <div
              className="relative p-3 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg"
              style={{
                backgroundColor:
                  "rgba(0, 0, 0, 0.3)",
                border: `1px solid ${color}33`,
                boxShadow: `0 0 0 0px ${color}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  color + "66";
                e.currentTarget.style.boxShadow = `0 0 20px ${color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  color + "33";
                e.currentTarget.style.boxShadow = `0 0 0 0px ${color}33`;
              }}
            >
              {getIcon(social.platform)}
            </div>
          </a>
        )
      )}
    </div>
  );
}
