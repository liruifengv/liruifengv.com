---
title: "玩 OpenClaw 龙虾初次安装的几个 Skills"
description: "准备深度折腾一下龙虾 OpenClaw，看看到底能做到什么程度,我首次安装了以下 Skills"
pubDatetime: 2026-03-09
author: liruifengv
featured: true
draft: false
tags:
  - Agent
  - AI
  - OpenClaw
---

准备深度折腾一下龙虾 OpenClaw，看看到底能做到什么程度。根据推上一些老师的热门文章，我首次安装了以下 Skills:

## 第一个：find-skills

解决如何找到最合适的 Skill 的问题：

https://skills.sh/vercel-labs/skills/find-skills

## 第二个：exa-web-search-free

给龙虾配置搜索服务，默认的都需要 API_KEY，这个是使用 exa 的免费 MCP 额度，有限额，先解决能用，后面不够用再接入 API_KEY

https://clawhub.ai/Whiteknight07/exa-web-search-free

## 第三个：agent-reach

让龙虾拥有从推特、Youtube、GitHub、小红书、抖音、公众号等平台获取信息的能力。

安装完成之后，按需修改，比如我把不需要的抖音小红书boss领英都删掉了。

https://github.com/Panniantong/Agent-Reach

## 第四个：agent-browser

Vercel 出的自动化操作无头浏览器的 CLI + Skill ，还可以运行调试本地的 Electron 。

https://github.com/vercel-labs/agent-browser
