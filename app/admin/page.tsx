"use client";

import LinkButton from "@/components/LinkButton";
import SocialIcons from "@/components/SocialIcons";
import {
  createOrUpdateProfile,
  getProfile,
  updateLinks,
  updateSocialLinks,
} from "@/lib/firestore";
import { uploadImage } from "@/lib/storage";
import {
  Link,
  Profile,
  SocialLink,
} from "@/types";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";

export default function AdminPage() {
  const router = useRouter();
  const [
    authenticated,
    setAuthenticated,
  ] = useState(false);
  const [
    checkingAuth,
    setCheckingAuth,
  ] = useState(true);
  const [profile, setProfile] =
    useState<Profile | null>(null);
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [activeTab, setActiveTab] =
    useState<
      "profile" | "links" | "social"
    >("profile");
  const [editedLink, setEditedLink] =
    useState<Link | null>(null);
  const [
    editedSocial,
    setEditedSocial,
  ] = useState<SocialLink | null>(null);

  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authStatus =
        sessionStorage.getItem(
          "admin_authenticated"
        );
      const adminCode =
        sessionStorage.getItem(
          "admin_code"
        );

      // Default admin code - you can change this or use environment variable
      const expectedCode =
        process.env
          .NEXT_PUBLIC_ADMIN_CODE ||
        "scroti2024";

      if (
        authStatus === "true" &&
        adminCode === expectedCode
      ) {
        setAuthenticated(true);
        setCheckingAuth(false);
      } else {
        // Redirect to auth page
        router.push("/admin/auth");
      }
    }
  }, [router]);

  useEffect(() => {
    if (!authenticated || checkingAuth)
      return;

    const profileId = "default";
    const loadProfile = async () => {
      try {
        const data = await getProfile(
          profileId
        );
        if (data) {
          setProfile(data);
        } else {
          const defaultProfile: Profile =
            {
              id: profileId,
              username: "scroti.online",
              displayName:
                "scroti.online",
              bio: "",
              accentColor: "#065f46",
              backgroundColor:
                "#000000",
              headerImage:
                "https://instagram.fotp3-3.fna.fbcdn.net/v/t51.2885-19/607652122_18551324362031125_4448876388606374672_n.jpg?stp=dst-jpg_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fotp3-3.fna.fbcdn.net&_nc_cat=101&_nc_oc=Q6cZ2QHNoQFAx3T3i6Z2yY6g_w_jcKKV5K8Ct3TlzOiUrKRMxeX87XhvvIB8o00H6iu9ZtQ&_nc_ohc=wUQ85eryivEQ7kNvwEJ8-Xx&_nc_gid=qR06IfTFkSQo86Yl9-FaCw&edm=APoiHPcBAAAA&ccb=7-5&oh=00_AfpYoDYvzjc7CW2bmeC2x4Oju9mQKUi8dLomqzpFGlYE3A&oe=69662B23&_nc_sid=22de04",
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
        console.error(
          "Error loading profile:",
          err
        );
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [authenticated, checkingAuth]);

  const saveProfile = async (
    updates: Partial<Profile>
  ) => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = {
        ...profile,
        ...updates,
      };
      await createOrUpdateProfile(
        profile.id,
        updated
      );
      setProfile(updated);
    } catch (err) {
      console.error(
        "Error saving profile:",
        err
      );
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (
    file: File,
    type: "header" | "profile"
  ) => {
    if (!profile) return;
    setSaving(true);
    try {
      const path = `profiles/${
        profile.id
      }/${type}/${Date.now()}_${
        file.name
      }`;
      const url = await uploadImage(
        file,
        path
      );
      if (url) {
        await saveProfile(
          type === "header"
            ? { headerImage: url }
            : { profileImage: url }
        );
      }
    } catch (err) {
      console.error(
        "Error uploading image:",
        err
      );
      alert("Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const HeaderImageUpload = () => {
    const {
      getRootProps,
      getInputProps,
      isDragActive,
    } = useDropzone({
      accept: { "image/*": [] },
      onDrop: (acceptedFiles) => {
        if (acceptedFiles[0]) {
          handleImageUpload(
            acceptedFiles[0],
            "header"
          );
        }
      },
      multiple: false,
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-400">
          {profile?.headerImage
            ? "Click or drag to replace header image"
            : "Click or drag to upload header image"}
        </p>
        {profile?.headerImage && (
          <img
            src={profile.headerImage}
            alt="Header"
            className="mt-4 max-h-48 mx-auto rounded"
          />
        )}
      </div>
    );
  };

  const addLink = () => {
    if (!profile) return;
    const newLink: Link = {
      id: Date.now().toString(),
      title: "New Link",
      url: "",
      type: "link",
      order:
        profile.links.length > 0
          ? Math.max(
              ...profile.links.map(
                (l) => l.order
              )
            ) + 1
          : 0,
    };
    setEditedLink(newLink);
  };

  const moveLink = async (
    linkId: string,
    direction: "up" | "down"
  ) => {
    if (!profile) return;
    const linkIndex =
      profile.links.findIndex(
        (l) => l.id === linkId
      );
    if (linkIndex === -1) return;

    if (
      direction === "up" &&
      linkIndex === 0
    )
      return;
    if (
      direction === "down" &&
      linkIndex ===
        profile.links.length - 1
    )
      return;

    const newIndex =
      direction === "up"
        ? linkIndex - 1
        : linkIndex + 1;
    const updatedLinks = [
      ...profile.links,
    ];
    [
      updatedLinks[linkIndex],
      updatedLinks[newIndex],
    ] = [
      updatedLinks[newIndex],
      updatedLinks[linkIndex],
    ];

    // Update order values
    updatedLinks.forEach(
      (link, index) => {
        link.order = index;
      }
    );

    setSaving(true);
    try {
      await updateLinks(
        profile.id,
        updatedLinks
      );
      setProfile({
        ...profile,
        links: updatedLinks,
      });
    } catch (err) {
      console.error(
        "Error reordering links:",
        err
      );
      alert("Failed to reorder links");
    } finally {
      setSaving(false);
    }
  };

  const saveLink = async () => {
    if (!profile || !editedLink) return;
    setSaving(true);
    try {
      const updatedLinks =
        editedLink.id &&
        profile.links.find(
          (l) => l.id === editedLink.id
        )
          ? profile.links.map((l) =>
              l.id === editedLink.id
                ? editedLink
                : l
            )
          : [
              ...profile.links,
              editedLink,
            ];
      await updateLinks(
        profile.id,
        updatedLinks
      );
      setProfile({
        ...profile,
        links: updatedLinks,
      });
      setEditedLink(null);
    } catch (err) {
      console.error(
        "Error saving link:",
        err
      );
      alert("Failed to save link");
    } finally {
      setSaving(false);
    }
  };

  const deleteLink = async (
    linkId: string
  ) => {
    if (!profile) return;
    setSaving(true);
    try {
      const updatedLinks =
        profile.links.filter(
          (l) => l.id !== linkId
        );
      await updateLinks(
        profile.id,
        updatedLinks
      );
      setProfile({
        ...profile,
        links: updatedLinks,
      });
    } catch (err) {
      console.error(
        "Error deleting link:",
        err
      );
      alert("Failed to delete link");
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    const newSocial: SocialLink = {
      platform: "instagram",
      url: "",
    };
    setEditedSocial(newSocial);
  };

  const saveSocialLink = async () => {
    if (!profile || !editedSocial)
      return;
    setSaving(true);
    try {
      const updatedSocialLinks =
        editedSocial.platform &&
        profile.socialLinks.find(
          (s) =>
            s.platform ===
            editedSocial.platform
        )
          ? profile.socialLinks.map(
              (s) =>
                s.platform ===
                editedSocial.platform
                  ? editedSocial
                  : s
            )
          : [
              ...profile.socialLinks,
              editedSocial,
            ];
      await updateSocialLinks(
        profile.id,
        updatedSocialLinks
      );
      setProfile({
        ...profile,
        socialLinks: updatedSocialLinks,
      });
      setEditedSocial(null);
    } catch (err) {
      console.error(
        "Error saving social link:",
        err
      );
      alert(
        "Failed to save social link"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSocialLink = async (
    platform: string
  ) => {
    if (!profile) return;
    setSaving(true);
    try {
      const updatedSocialLinks =
        profile.socialLinks.filter(
          (s) => s.platform !== platform
        );
      await updateSocialLinks(
        profile.id,
        updatedSocialLinks
      );
      setProfile({
        ...profile,
        socialLinks: updatedSocialLinks,
      });
    } catch (err) {
      console.error(
        "Error deleting social link:",
        err
      );
      alert(
        "Failed to delete social link"
      );
    } finally {
      setSaving(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect to /admin/auth
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Error loading profile
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          Admin Panel
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() =>
              setActiveTab("profile")
            }
            className={`pb-2 px-4 ${
              activeTab === "profile"
                ? "border-b-2 border-blue-500"
                : ""
            }`}
          >
            Profile Settings
          </button>
          <button
            onClick={() =>
              setActiveTab("links")
            }
            className={`pb-2 px-4 ${
              activeTab === "links"
                ? "border-b-2 border-blue-500"
                : ""
            }`}
          >
            Links
          </button>
          <button
            onClick={() =>
              setActiveTab("social")
            }
            className={`pb-2 px-4 ${
              activeTab === "social"
                ? "border-b-2 border-blue-500"
                : ""
            }`}
          >
            Social Links
          </button>
        </div>

        {/* Profile Settings Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <label className="block mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={
                  profile.displayName
                }
                onChange={(e) =>
                  saveProfile({
                    displayName:
                      e.target.value,
                  })
                }
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
              />
            </div>

            <div>
              <label className="block mb-2">
                Bio
              </label>
              <input
                type="text"
                value={
                  profile.bio || ""
                }
                onChange={(e) =>
                  saveProfile({
                    bio: e.target.value,
                  })
                }
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
              />
            </div>

            <div>
              <label className="block mb-2">
                Accent Color
              </label>
              <div className="flex gap-4">
                <input
                  type="color"
                  value={
                    profile.accentColor
                  }
                  onChange={(e) =>
                    saveProfile({
                      accentColor:
                        e.target.value,
                    })
                  }
                  className="w-20 h-10 cursor-pointer"
                />
                <input
                  type="text"
                  value={
                    profile.accentColor
                  }
                  onChange={(e) =>
                    saveProfile({
                      accentColor:
                        e.target.value,
                    })
                  }
                  className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">
                Background Color
              </label>
              <div className="flex gap-4">
                <input
                  type="color"
                  value={
                    profile.backgroundColor
                  }
                  onChange={(e) =>
                    saveProfile({
                      backgroundColor:
                        e.target.value,
                    })
                  }
                  className="w-20 h-10 cursor-pointer"
                />
                <input
                  type="text"
                  value={
                    profile.backgroundColor
                  }
                  onChange={(e) =>
                    saveProfile({
                      backgroundColor:
                        e.target.value,
                    })
                  }
                  className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">
                Header Image
              </label>
              <HeaderImageUpload />
            </div>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === "links" && (
          <div className="space-y-4">
            <button
              onClick={addLink}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Add New Link
            </button>

            {editedLink && (
              <div className="p-4 bg-gray-800 rounded border border-gray-700 space-y-4">
                <div>
                  <label className="block mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={
                      editedLink.title
                    }
                    onChange={(e) =>
                      setEditedLink({
                        ...editedLink,
                        title:
                          e.target
                            .value,
                      })
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={
                      editedLink.url
                    }
                    onChange={(e) =>
                      setEditedLink({
                        ...editedLink,
                        url: e.target
                          .value,
                      })
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">
                    Description
                    (Optional)
                  </label>
                  <input
                    type="text"
                    value={
                      editedLink.description ||
                      ""
                    }
                    onChange={(e) =>
                      setEditedLink({
                        ...editedLink,
                        description:
                          e.target
                            .value,
                      })
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2">
                    Thumbnail URL
                    (Optional)
                  </label>
                  <input
                    type="url"
                    value={
                      editedLink.thumbnail ||
                      ""
                    }
                    onChange={(e) =>
                      setEditedLink({
                        ...editedLink,
                        thumbnail:
                          e.target
                            .value,
                      })
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveLink}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      setEditedLink(
                        null
                      )
                    }
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {profile.links
                .sort(
                  (a, b) =>
                    a.order - b.order
                )
                .map((link, index) => (
                  <div
                    key={link.id}
                    className="p-4 bg-gray-800 rounded border border-gray-700 flex justify-between items-center gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          moveLink(
                            link.id,
                            "up"
                          )
                        }
                        disabled={
                          index === 0
                        }
                        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() =>
                          moveLink(
                            link.id,
                            "down"
                          )
                        }
                        disabled={
                          index ===
                          profile.links
                            .length -
                            1
                        }
                        className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {link.title}
                      </div>
                      <div className="text-sm text-gray-400 truncate">
                        {link.url}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditedLink(
                            link
                          )
                        }
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          deleteLink(
                            link.id
                          )
                        }
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === "social" && (
          <div className="space-y-4">
            <button
              onClick={addSocialLink}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Add Social Link
            </button>

            {editedSocial && (
              <div className="p-4 bg-gray-800 rounded border border-gray-700 space-y-4">
                <div>
                  <label className="block mb-2">
                    Platform
                  </label>
                  <select
                    value={
                      editedSocial.platform
                    }
                    onChange={(e) =>
                      setEditedSocial({
                        ...editedSocial,
                        platform: e
                          .target
                          .value as SocialLink["platform"],
                      })
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  >
                    <option value="instagram">
                      📷 Instagram
                    </option>
                    <option value="tiktok">
                      🎵 TikTok
                    </option>
                    <option value="youtube">
                      📺 YouTube
                    </option>
                    <option value="spotify">
                      🎵 Spotify
                    </option>
                    <option value="twitter">
                      🐦 Twitter / X
                    </option>
                    <option value="facebook">
                      👥 Facebook
                    </option>
                    <option value="linkedin">
                      💼 LinkedIn
                    </option>
                    <option value="snapchat">
                      👻 Snapchat
                    </option>
                    <option value="pinterest">
                      📌 Pinterest
                    </option>
                    <option value="twitch">
                      🎮 Twitch
                    </option>
                    <option value="discord">
                      💬 Discord
                    </option>
                    <option value="reddit">
                      🤖 Reddit
                    </option>
                    <option value="github">
                      💻 GitHub
                    </option>
                    <option value="dribbble">
                      🏀 Dribbble
                    </option>
                    <option value="behance">
                      🎨 Behance
                    </option>
                    <option value="medium">
                      ✍️ Medium
                    </option>
                    <option value="telegram">
                      ✈️ Telegram
                    </option>
                    <option value="whatsapp">
                      💬 WhatsApp
                    </option>
                    <option value="soundcloud">
                      🔊 SoundCloud
                    </option>
                    <option value="applemusic">
                      🍎 Apple Music
                    </option>
                    <option value="kick">
                      👊 Kick.com
                    </option>
                    <option value="revolut">
                      💳 Revolut
                    </option>
                    <option value="custom">
                      🌐 Custom
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={
                      editedSocial.url
                    }
                    onChange={(e) =>
                      setEditedSocial({
                        ...editedSocial,
                        url: e.target
                          .value,
                      })
                    }
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={
                      saveSocialLink
                    }
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() =>
                      setEditedSocial(
                        null
                      )
                    }
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {profile.socialLinks.map(
                (social, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800 rounded border border-gray-700 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {
                          social.platform
                        }
                      </div>
                      <div className="text-sm text-gray-400">
                        {social.url}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditedSocial(
                            social
                          )
                        }
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          deleteSocialLink(
                            social.platform
                          )
                        }
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {saving && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg">
            Saving...
          </div>
        )}

        {/* Preview Section */}
        <div className="mt-12 p-6 bg-gray-800 rounded border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">
            Preview
          </h2>
          <div className="bg-black rounded p-4 max-w-md">
            <div
              style={{
                backgroundColor:
                  profile.backgroundColor,
              }}
            >
              {profile.headerImage && (
                <img
                  src={
                    profile.headerImage
                  }
                  alt="Header"
                  className="w-full h-48 object-cover rounded-t"
                />
              )}
              <div className="p-4">
                <h3
                  style={{
                    color:
                      profile.accentColor,
                  }}
                  className="text-2xl font-bold"
                >
                  {profile.displayName}
                </h3>
                {profile.bio && (
                  <p
                    style={{
                      color:
                        profile.accentColor,
                    }}
                    className="text-lg"
                  >
                    {profile.bio}
                  </p>
                )}
                {profile.socialLinks
                  .length > 0 && (
                  <div className="my-4">
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
                {profile.links
                  .sort(
                    (a, b) =>
                      a.order - b.order
                  )
                  .slice(0, 3)
                  .map((link) => (
                    <div
                      key={link.id}
                      className="mb-2"
                    >
                      <LinkButton
                        link={link}
                        accentColor={
                          profile.accentColor
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
