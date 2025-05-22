export interface Link {
	name: string;
	href: string;
	logo: string
  darkLogo?: string
  description?: string
}

export const links: Link[] = [
  {
    name: 'Kai',
    href: 'https://kaiyi.cool',
    logo: 'kaiyi.cool.webp',
    description: 'Web Worker 播客主播，Qwerty Learner 作者'
  },
  {
    name: '辛宝',
    href: 'https://ijust.cc',
    logo: 'ijust.cc.png',
    description: 'WebWorker 播客主理人'
  },
  {
    name: 'Fox',
    href: 'https://mksaas.me',
    logo: 'mksaas.me.png',
    description: 'Indie Maker. Founder of Mksaas'
  },
  {
    name: '面条',
    href: 'https://miantiao.me',
    logo: 'miantiao.me.png',
    darkLogo: 'miantiao.me-dark.webp',
    description: 'Open Source Enthusiast & Founder of sink.cool'
  },
  {
    name: '且听书吟',
    href: 'https://yufan.me',
    logo: 'yufan.me.svg',
    darkLogo: 'yufan.me-dark.svg',
    description: '诗与梦想的远方'
  },
  {
    name: 'Rico',
    href: 'https://www.ricoui.com',
    logo: 'ricoui.com.png',
    description: '一名有趣的写代码的设计师'
  }
]