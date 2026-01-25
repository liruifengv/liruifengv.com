---
title: "我开发了一个 Agent Coworker 应用：Amon"
description: "Amon 是一个 Agent Coworker 桌面应用，你的桌面 AI 工作伙伴"
pubDatetime: 2026-01-25
author: liruifengv
featured: true
draft: false
tags:
  - Claude
  - Agent
  - AI
---

大家好，今天正式发布我的第一个 Agent 产品，Amon。

Amon 是一个 Agent Coworker 桌面应用，你的桌面 AI 工作伙伴。它使用 Claude Agent SDK 构建，拥有 Claude Code 的所有能力。

这里是 GitHub 地址：

https://github.com/liruifengv/amon-agent

可以在 Release 下载体验，目前只支持 Mac 系统，Windows 在测试中，Coming Soon~

## 功能速览

我们来看看截图预览 Amon 的功能。

![思考/工具调用](https://bucket.liruifengv.com/amon-announce/img1.png)

Amon 可以根据你发送的消息，进行思考，执行工具调用，完成你的任务。

![计划模式](https://bucket.liruifengv.com/amon-announce/img2.jpg)

Amon 拥有计划模式，可以先创建任务 TODO，然后按计划执行。

![深色主题](https://bucket.liruifengv.com/amon-announce/img3.jpg)

Amon 拥有深色/浅色主题模式。

![文件修改 diff](https://bucket.liruifengv.com/amon-announce/img4.jpg)

Amon 可以展示文件修改 diff 内容。

![发送图片](https://bucket.liruifengv.com/amon-announce/img5.png)

Amon 支持发送图片消息。

![自定义多供应商](https://bucket.liruifengv.com/amon-announce/img6.png)

Amon 可以自定义添加多个 API 供应商。注意：目前只支持 Claude API 兼容格式的 API。

![智能体配置](https://bucket.liruifengv.com/amon-announce/img7.png)

Amon 可以设置 Agent 的执行权限，有不同级别的权限模式。

可以自定义系统提示词。

如果你已安装 Claude Code 并配置了 API Key，可以开启 `Claude Code 模式`以获得更强的代码能力。

开启 Claude Code 模式后，Amon 将使用 Claude Code 的全局设置，并使用 Claude Code 的系统提示词，会默认加载全局的 Skills 等等。

开启后，你可以把 Amon 当做 Claude Code 的一个可视化客户端来使用。

![工作空间](https://bucket.liruifengv.com/amon-announce/img8.png)

Amon 以工作空间（文件夹）为单位来进行工作，你可以设置多个工作空间。默认工作空间：`~/.amon/workspaces`

![Skills](https://bucket.liruifengv.com/amon-announce/img9.png)

Amon 支持 Agent Skills，你可以通过安装 Skills 为 Amon 添加专业能力。

目前内置了一些推荐技能，包括：
- PDF 工具 — 文本提取、表单填写、文档合并
- 前端设计 — 创建精美的 Web 界面和组件
- 算法艺术 — 使用 p5.js 生成创意艺术作品
- MCP 构建 — 开发 MCP 服务器

## 为什么开发 Amon

为什么要开发一个 Agent 桌面端呢。

一个是我在学习 Agent 开发，需要一个实践的真实项目，这个项目使用 Claude Agent SDK 开发，我也写了好几篇讲 SDK 的实践文章，没看过的朋友可以看我往期文章。目前对 Agent 开发有了一个初步的入门。

再一个，Amon 可以作为 Claude Code 的可视化客户端，因为 Claude Code 是在终端的 CLI，很多人可能用不习惯，非程序员更不太会用。提供一个客户端，能让普通人更好的上手。

Amon 的目标是成为一个运行在你的桌面的 Coworker，你的 AI 工作伙伴，帮你完成各种任务，不只是编码。

后续我也会做一些编码之外的功能到里面。

## 求 Star 和下载体验！

以上就是 Amon 的全部介绍。

如果你想要学习 Agent 开发，可以给项目点个 Star，阅读项目的代码结合我往期的文章学习。

欢迎下载体验，有任何反馈，请告诉我！

GitHub 地址：https://github.com/liruifengv/amon-agent
