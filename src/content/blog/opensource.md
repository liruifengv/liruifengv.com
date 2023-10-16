---
title: "我的开源之旅&新手如何参与开源社区"
description: "本篇文章讲讲我的开源之旅，以及新手程序员如何参与进来。"
pubDatetime: 2023-01-31
author: liruifengv
featured: false
draft: false
postSlug: opensource
tags:
  - 开源
---

## 前言

大家好，我是程序猿李瑞丰。

这几年我也零零散散的在 GitHub 参与了一些开源项目，贡献了几个 PR（蹭了不少）。今天就讲一讲我的开源之旅，以及刚入门的程序员新手，如何快速参与进来。文末有彩蛋。

## 我的开源之旅

### 第一个 PR

2019 年 7 月 10 日，我在 GitHub 上提交了我的[第一个 PR](https://github.com/geoman-io/leaflet-geoman/pull/466)，出发点是我在工作中使用这个开源项目，发现没有中文翻译，我就贡献了中文翻译。

### vue-cli 的 PR

2019 年 7 月 24 日，我在逛 GitHub 的时候，看到 vue-cli 的 issue 中，有一个[问题](https://github.com/vuejs/vue-cli/issues/3947)，使用 vue-cli 创建项目时，同时选择 typescript 和 eslint 的时候，lint-staged 默认配置没有包含对 ts 文件的检查。

提出这个 issue 的同学，很贴心的指出了对应源码的位置。我看到后，就顺手去修复了，很简单，if 判断 typescript，纯属捡漏。

[链接在此](https://github.com/vuejs/vue-cli/pull/4347)。当然后续这段代码被优化了。但这个 PR 被 merge 的时候，我内心是十分激动的，毕竟 vue 和 vue-cli 是我平时工作用的项目，也是大部分程序猿都用过并熟知的，那一刻成就感十足。

### 零零散散

中间零零散散的提了好多 PR，有合并的，也有未合并的。有的是修复错别字，有的是修复半角圆角标点符号等等。也有一些文档的中文翻译。

### Deno 的第一个 PR

Deno 是一个 JS 运行时，由 Node.js 的创始人 ry 发起并开发的。我们并不清楚 Deno 能否替代 Node.js，但在项目早期， Deno 完善并被广泛使用之前，我们可以早一点参与进来。

要感谢我的大佬[迷渡@justjavac](https://github.com/justjavac)，他是 Deno 的中国布道者，同时参与了 Deno 的核心代码开发。

在大佬的指导下，我完成了我在 Deno 中的第一个 [PR](https://github.com/denoland/deno/pull/11851)。

起初是大佬发现 Deno 的 `Blob` 的 `SymbolToStringTag` 实现没有通过 [wpt](https://github.com/denoland/wpt/blob/master/WebIDL/ecmascript-binding/class-string-interface.any.js#L3-L11) 的测试，给我一个贡献的机会，让我去改。关于 SymbolToStringTag 大家可以去 MDN 自行搜索了解。

发展: Deno 的维护者 lucaca，告诉我不光是 `Blob` 需要正确设置 `SymbolToStringTag`。其他的内置类都有同样的问题。让我在 `webidl.configurePrototype` 的方法里进行处理。

```js
ObjectDefineProperty(prototype.prototype, SymbolToStringTag, {
  value: prototype.name,
  enumerable: false,
  configurable: true,
  writable: false,
});
```

这次的机会，让我对 Deno 的源码有了初始了解，对开源也更加感兴趣了。

### 更多的参与到 Deno 中来

后来我给 Deno 提了更多的 PR，期望能更多的参与进来。

- [fix(napi_sym): fix readme path](https://github.com/denoland/deno/pull/16203)
- [fix(ext/crypto): fix importKey error when leading zeroes](https://github.com/denoland/deno/pull/16009)
- [fix(ext/console): fix error when logging a proxied Date](https://github.com/denoland/deno/pull/16018)
- [docs(encoding): remove await](https://github.com/denoland/deno_std/pull/2831)

- [docs: removed types from jsdoc directives](https://github.com/denoland/deno_std/pull/2988)

- [docs(encoding/front_matter): fix doc error when render page](https://github.com/denoland/deno_std/pull/2985)

### Astro

[Astro](https://astro.build/) 是基于 Vite 的上层框架，首创群岛架构。可以快速构建内容网站如官网博客等，SEO 友好，SSG、SSR 可选。

Astro 在 2022 年非常火爆，我也尝了把鲜，使用 Astro 把我的[个人博客](https://github.com/liruifengv/sayhub)进行了重构。

一个新兴起的热门开源项目，那么当然也不能错过，蹭 PR 小能手的我，同样给 Astro 提了几个 PR。

- [withastro/astro](https://github.com/withastro/astro/pulls?q=is%3Apr+author%3Aliruifengv+is%3Aclosed)

- [withastro/docs](https://github.com/withastro/docs/pulls?q=is%3Apr+author%3Aliruifengv+is%3Aclosed)

## 新手如何参与

那么问题来了，讲了这么多，新手如何参与进来呢。根据我的一点点经验，可以从以下几点着手

### 如何寻找可以贡献的开源项目

- 从错别字改起。每天花一点时间逛一会 GitHub，查找你感兴趣的开源项目的 README 以及官方文档，可能有错别字，可能有中英文标点符号混用，勿以 PR 小而不为。

- 你工作中用到的开源项目。使用开源项目中，难免会遇到多多少少的 bug，如果确实是该开源项目的 bug，有能力的话就可以去查看对应源码，看能否修改，PR 不是来了么。

- 新兴的开源项目。开源项目的早期，往往还不太完善，代码、文档都需要开源社区来一起参与贡献，例如 Deno、Astro。

- 英文文档的多语言翻译。很多老外的开源项目，是没有中文翻译的，你可以参与进去，一方面锻炼英文，一方面能更了解该项目。

### 操作步骤

- fork 项目到自己的仓库。

- 创建分支，名字随便起。不建议在主分支直接修改，主分支可以跟上游仓库保持同步。

- git clone 到本地，修改代码。

- 如果是简单的错别字修改，可以在 GitHub 上在线修改。

- commit&push 到自己的远程仓库。

- 向上游仓库 Open pull request。

### 提交 PR 的注意事项

- 第一步要阅读你目标项目的贡献指南。正规的开源项目，都会写有贡献指南，一般可以在 README 找到，它会指导你如何运行、打包项目，如何 PR。例如 [Deno](https://deno.land/manual@v1.30.0/references/contributing)。

- 代码风格校验。注意开源项目使用的代码风格，提交前记得运行项目的 format 和 lint。

- 单元测试。好的开源项目都会有单元测试，如果你改了 bug 或者新增 feature，最后增加对应的单元测试，并且运行测试通过。

- [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/)。你的 commit-message 和 PR title，需要符合约定式提交规范。PR 标题是必须的，一般项目都会使用 squash merge，多个 commit 会合并成一个。

- PR 的描述清楚。在 PR 的描述里，说清楚你修改的东西，一般都有模板，新增了 feature，修复了 bug，记得关联对应的 issue。

- GitHub CI。开源项目都有 GitHub CI，是利用 GitHub Action，对提交的代码进行检查，一般都会运行 format、lint、单元测试、打包等操作。注意 CI 是否通过，挂了之后要及时修复。

- 最后，不要怕，我遇到的好多维护者都很友好，他们会指导你如何修改你的 PR，跟你讨论。

### 工具推荐

- [DeepL 翻译](https://www.deepl.com/translator)。
- [octotree 扩展](https://chrome.google.com/webstore/detail/octotree-github-code-tree/bkhaagjahfmjljalopjnoealnfndnagc?hl=zh-CN) 可以在 github 左侧生成目录树，方便阅读源码。
- [grammarly](https://app.grammarly.com/) 辅助英文写作。

## 彩蛋，一个 PR 机会

最后，有一个 PR 的机会，手慢无。

我在翻译 Astro 的文档：「[将现有项目迁移到 Astro](https://docs.astro.build/zh-cn/guides/migrate-to-astro/)」的时候，不小心留下一个错别字。

![](https://bucket.liruifengv.com/opensource/astro-doc.png)

感兴趣的同学可以修改一下。

![](https://bucket.liruifengv.com/opensource/avatar.png)

修复之后，你的头像就会出现在[这里](https://docs.astro.build/zh-cn/getting-started/)。找到我的头像了吗？

今天就到这里了，我们下回再见。
