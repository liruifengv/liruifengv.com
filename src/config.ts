import type { Site, SocialObjects, OG_Type } from "./types";

export const SITE: Site = {
  website: "https://liruifengv.com/",
  author: "liruifengv",
  desc: "liruifengv's blog",
  title: "liruifengv",
  lightAndDarkMode: true,
  postPerPage: 10,
  avatar: "https://bucket.liruifengv.com/avatar.jpg",
};

export const LOCALE = ["zh-CN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/liruifengv",
    linkTitle: `liruifengv's Github`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:liruifeng1024@gmail.com",
    linkTitle: `Send an email to liruifengv`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/liruifengv",
    linkTitle: `liruifengv's Twitter`,
    active: true,
  },
];

export const OG: OG_Type = {
  emojiType: "twemoji",
  // ogImage: "astropaper-og.jpg",
};

export const CND_URL: string = "https://bucket.liruifengv.com";
