export interface Link {
  id: string;
  title: string;
  url: string;
  type: 'link' | 'spotify' | 'youtube' | 'custom';
  thumbnail?: string;
  description?: string;
  order: number;
}

export interface SocialLink {
  platform: 'instagram' | 'tiktok' | 'youtube' | 'spotify' | 'twitter' | 'facebook' | 'linkedin' | 'snapchat' | 'pinterest' | 'twitch' | 'discord' | 'reddit' | 'github' | 'dribbble' | 'behance' | 'medium' | 'telegram' | 'whatsapp' | 'soundcloud' | 'applemusic' | 'kick' | 'revolut' | 'custom';
  url: string;
  customIcon?: string;
}

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  headerImage?: string;
  profileImage?: string;
  accentColor: string;
  backgroundColor: string;
  links: Link[];
  socialLinks: SocialLink[];
  createdAt: Date;
  updatedAt: Date;
}
