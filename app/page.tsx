"use client";

import LinkButton from "@/components/LinkButton";
import ProfileHeader from "@/components/ProfileHeader";
import SocialIcons from "@/components/SocialIcons";
import {
  createOrUpdateProfile,
  getProfile,
} from "@/lib/firestore";
import { Profile } from "@/types";
import {
  useEffect,
  useState,
} from "react";

export default function Home() {
  const [profile, setProfile] =
    useState<Profile | null>(null);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    // For now, use 'default' as profile ID. You can change this to get from URL params
    const profileId = "default";

    const loadProfile = async () => {
      try {
        const data = await getProfile(
          profileId
        );
        if (data) {
          // If profile exists but doesn't have headerImage or has old colors, update it
          const needsUpdate =
            !data.headerImage ||
            data.accentColor ===
              "#ff8a95" ||
            data.accentColor ===
              "#10b981" ||
            data.accentColor ===
              "#047857";
          if (needsUpdate) {
            const updatedProfile = {
              ...data,
              headerImage:
                data.headerImage ||
                "https://scontent.fotp3-2.fna.fbcdn.net/v/t39.30808-6/290760470_5028323290624050_1786948569604189641_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5PcLElJGwwoQ7kNvwE6dE-4&_nc_oc=AdlDMOpu8LHpS-cNRKI8b1ltSSl3YiOwAMDYC7F_TV8LQFzJ2Uq84dDfOE-RX5XRZVI&_nc_zt=23&_nc_ht=scontent.fotp3-2.fna&_nc_gid=ZeT8p7vEzSZIhkUC9p_u9Q&oh=00_Afr5l38q1eny1ghYNWsP738IuiGct61nnCun8GWg_3ae5g&oe=69660202",
              accentColor: "#065f46",
            };
            await createOrUpdateProfile(
              profileId,
              updatedProfile
            );
            setProfile(updatedProfile);
          } else {
            setProfile(data);
          }
        } else {
          // Create default profile if none exists
          const defaultProfile = {
            id: profileId,
            username: "scroti.online",
            displayName:
              "scroti.online",
            bio: "",
            accentColor: "#065f46",
            backgroundColor: "#000000",
            headerImage:
              "https://scontent.fotp3-2.fna.fbcdn.net/v/t39.30808-6/290760470_5028323290624050_1786948569604189641_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5PcLElJGwwoQ7kNvwE6dE-4&_nc_oc=AdlDMOpu8LHpS-cNRKI8b1ltSSl3YiOwAMDYC7F_TV8LQFzJ2Uq84dDfOE-RX5XRZVI&_nc_zt=23&_nc_ht=scontent.fotp3-2.fna&_nc_gid=ZeT8p7vEzSZIhkUC9p_u9Q&oh=00_Afr5l38q1eny1ghYNWsP738IuiGct61nnCun8GWg_3ae5g&oe=69660202",
            links: [],
            socialLinks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          await createOrUpdateProfile(
            profileId,
            defaultProfile
          );
          setProfile(defaultProfile);
        }
      } catch (err) {
        setError(
          "Failed to load profile"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">
          Error loading profile
        </div>
      </div>
    );
  }

  // Sort links by order
  const sortedLinks = [
    ...profile.links,
  ].sort((a, b) => a.order - b.order);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor:
          profile.backgroundColor ||
          "#000000",
      }}
    >
      {/* Header Section */}
      <ProfileHeader
        headerImage={
          profile.headerImage
        }
        displayName={
          profile.displayName
        }
        bio={profile.bio}
        accentColor={
          profile.accentColor
        }
      />

      {/* Content Section */}
      <div className="px-4 py-8 max-w-md mx-auto space-y-4">
        {/* Social Icons */}
        {profile.socialLinks.length >
          0 && (
          <div className="py-4 animate-fade-in">
            <SocialIcons
              socialLinks={
                profile.socialLinks
              }
              color={
                profile.accentColor
              }
            />
          </div>
        )}

        {/* Links */}
        <div className="space-y-4">
          {sortedLinks.map(
            (link, index) => (
              <div
                key={link.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${
                    index * 50
                  }ms`,
                  animationFillMode:
                    "both",
                }}
              >
                <LinkButton
                  link={link}
                  accentColor={
                    profile.accentColor
                  }
                />
              </div>
            )
          )}
        </div>

        {/* Copyright Footer */}
        <div className="pt-16 pb-10 text-center">
          <p
            className="text-xs font-medium tracking-wide"
            style={{
              color:
                "rgba(255, 255, 255, 0.3)",
            }}
          >
            © {new Date().getFullYear()}{" "}
            scroti.online. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
