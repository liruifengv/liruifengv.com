export type Site = {
  website: string;
  author: string;
  desc: string;
  title: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
};

export type SocialObjects = {
  name: SocialMedia;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

export type SocialIcons = {
  [social in SocialMedia]: string;
};

export type SocialMedia =
  | "Github"
  | "Facebook"
  | "Instagram"
  | "LinkedIn"
  | "Mail"
  | "Twitter"
  | "Twitch"
  | "YouTube"
  | "WhatsApp"
  | "Snapchat"
  | "Pinterest"
  | "TikTok"
  | "CodePen"
  | "Discord"
  | "GitLab"
  | "Reddit"
  | "Skype"
  | "Steam"
  | "Telegram"
  | "Mastodon";

export type emojiType =
  | "openmoji"
  | "twemoji"
  | "blobmoji"
  | "fluent"
  | "fluentFlat";

export type OG_Type = {
  emojiType: emojiType;
  ogImage: string;
};
