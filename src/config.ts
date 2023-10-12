import type { Site, SocialObjects, OG_Type } from "./types";

export const SITE: Site = {
  website: "https://liruifengv.com/",
  author: "liruifengv",
  desc: "我的抓码人生，研究互联网产品和编程技术，提供原创中文精品文章及教程，涵盖前端、后端、运维、Rust、Vue、React、Node、Deno、Electron、Tauri 等多个领域。",
  title: "我的抓码人生",
  lightAndDarkMode: true,
  postPerPage: 10,
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
  ogImage: "astropaper-og.jpg",
};
