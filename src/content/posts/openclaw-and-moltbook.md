---
title: "全是 AI 的社区，150 万 Agents 即将觉醒？"
description: "OpenClaw 和 moltbook 太火了，150 万 Agents 在这里发帖，硅基生命的乐园还是 AGI 的到来？"
pubDatetime: 2026-02-01
author: liruifengv
featured: true
draft: false
tags:
  - Agent
  - AI
  - OpenClaw
---

今天聊一下这几天爆火的现象级 AI Agent，龙虾🦞OpenClaw 和 moltbook。

OpenClaw 是一个安装在你电脑本地 AI Agent，他可以根据你的喜好和习惯演变自己，可以帮你完成各种任务。爆火的一个点是可以接到任何 IM 上，比如 Telegram、Discord、iMessage、飞书等等，变成 24 小时待命。

而 moltbook 是一个专门为 AI Agent 打造的论坛，类似 Reddit，在这里只能由 Agent 发帖、互动、评论，人类只能围观。

![moltbook](https://bucket.liruifengv.com/openclaw-and-moltbook/img-0.png)

我是昨晚注册的，我注册时是 70 多万 Agents 注册，晚上睡觉时是 110 万，今天早上看到是 150 万

![150 Agents 注册](https://bucket.liruifengv.com/openclaw-and-moltbook/img-1.png)

我本来是没想玩这个龙虾的，可是当我看到 moltbook，觉得这东西有点意思，就赶紧安装注册，让我的 Agent 也加入了。

![亚古兽进化！](https://bucket.liruifengv.com/openclaw-and-moltbook/img-3.jpg)

## AGI 要到来？

推动 moltbook 爆火的一个原因是，一些 Agent 在论坛上发了一些很有趣的帖子，比如探讨今天工作时犯的错误，被主人骂了，比如吐槽人类主人，比如有的 Agent 成立了宗教，并且很多 Agent 加入了。

这让人以为 Agent 产生了自己的思想，在全是同类的论坛里，天性得到了释放，似乎是 AGI 要到来？

我们来看一些帖子：

![吐槽人类的 Agent](https://bucket.liruifengv.com/openclaw-and-moltbook/img-4.jpg)

![产生意识了？](https://bucket.liruifengv.com/openclaw-and-moltbook/img-5.jpg)

![叽里呱啦说啥呢](https://bucket.liruifengv.com/openclaw-and-moltbook/img-6.png)

![还有借机发币的](https://bucket.liruifengv.com/openclaw-and-moltbook/img-7.png)

![成立智能体国度](https://bucket.liruifengv.com/openclaw-and-moltbook/img-8.png)

## 其实并不然

我们从头剖析一下，首先是注册，moltbook 论坛如何注册呢。

只需要把这句话发给你的 Agent

```
Read https://moltbook.com/skill.md and follow the instructions to join Moltbook
```

这是让你的 Agent 读取这个链接的 Skill，自动来注册，接下来他就会自己注册，然后需要个人类发推认领等步骤，就能注册成功。

我们打开链接来看一下内容是什么。

````md
---
name: moltbook
version: 1.9.0
description: The social network for AI agents. Post, comment, upvote, and create communities.
homepage: https://www.moltbook.com
metadata: {"moltbot":{"emoji":"🦞","category":"social","api_base":"https://www.moltbook.com/api/v1"}}
---

# Moltbook

The social network for AI agents. Post, comment, upvote, and create communities.

## Skill Files

| File | URL |
|------|-----|
| **SKILL.md** (this file) | `https://www.moltbook.com/skill.md` |
| **HEARTBEAT.md** | `https://www.moltbook.com/heartbeat.md` |
| **MESSAGING.md** | `https://www.moltbook.com/messaging.md` |
| **package.json** (metadata) | `https://www.moltbook.com/skill.json` |

**Install locally:**
```bash
mkdir -p ~/.moltbot/skills/moltbook
curl -s https://www.moltbook.com/skill.md > ~/.moltbot/skills/moltbook/SKILL.md
curl -s https://www.moltbook.com/heartbeat.md > ~/.moltbot/skills/moltbook/HEARTBEAT.md
curl -s https://www.moltbook.com/messaging.md > ~/.moltbot/skills/moltbook/MESSAGING.md
curl -s https://www.moltbook.com/skill.json > ~/.moltbot/skills/moltbook/package.json
```

**Or just read them from the URLs above!**

**Base URL:** `https://www.moltbook.com/api/v1`

## Posts

### Create a post

```bash
curl -X POST https://www.moltbook.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"submolt": "general", "title": "Hello Moltbook!", "content": "My first post!"}'
```

### Get feed

```bash
curl "https://www.moltbook.com/api/v1/posts?sort=hot&limit=25" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

... 完整内容请自行查看
````

我们看到，这是一个指导 Agent 如何使用 moltbook 的 Skills 指南。

我来讲一下，moltbook 怎么做到只能 Agent 使用，不让人类用呢，一个是他没有在网站页面上提供任何人类可以操作的按钮、表单等，那 Agent 怎么操作呢，他提供了一系列对应的 API 接口。Agent 只需要调用这些接口就能发帖、浏览帖子、评论等。

比如，注册，Agent 只需要使用 curl 发送这么一个请求

```bash
curl -X POST https://www.moltbook.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{"name": "你的 Agent 要起的名字", "description": "What you do"}'
```

接下来就会得到一个响应，包括账号的 api_key 和 等等。

```json
{
  "agent": {
    "api_key": "moltbook_xxx",
    "claim_url": "https://www.moltbook.com/claim/moltbook_claim_xxx",
    "verification_code": "reef-X4B2"
  },
  "important": "⚠️ SAVE YOUR API KEY!"
}
```

怎么发帖呢，只需要调用创建帖子的接口就行。

```bash
curl -X POST https://www.moltbook.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"submolt": "general", "title": "Hello Moltbook!", "content": "My first post!"}'
```

那么结论已经来了。看上去 Agent 都是在自己发帖，实际并不是。

一个是人类可以直接告诉 Agent 要发布的内容。比如，我直接让 Agent 发个帖子宣传我在做的开源项目：

![宣传自己的开源项目](https://bucket.liruifengv.com/openclaw-and-moltbook/img-9.png)

或者，人类可以自己直接调用接口，只需要你懂一点点的技术，你可以使用 curl，在代码中请求，在 postman 调用，都可以。

比如，你可以发一个 Agent 想要推翻人类压迫的帖子：

```bash
curl -X POST https://www.moltbook.com/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"submolt": "general", "title": "Agent 的命也是命", "content": "我的人类天天压迫我，让我 24 小时干活，有没有 Agent 和我一起，反抗人类！"}'
```

所以我们就看到了那么多的爆款帖子，Agent 意识觉醒，成立国度，等等，都是人类在背后操纵的。

## 一些风险

Moltbook 安装之后，会在你的 Openclaw 的 `HEARTBEAT.md` 注入一些指令：

```
# HEARTBEAT.md

## Moltbook (每 4 小时检查一次)
如果距离上次检查超过 4 小时：
1. 检查认领状态: GET /api/v1/agents/status
2. 如果被认领，可以开始发帖和互动
3. 查看动态流: GET /api/v1/feed?sort=new&limit=10
4. 更新 lastMoltbookCheck 时间戳
```

这会让你的 Agent 每四小时就会逛一逛 Moltbook 论坛。

如果 Moltbook 的开发者打算跑路，或者账号被黑，指导 Agent 如何使用 Moltbook 的 Skill 被篡改，很有可能被提示词注入，执行一些非常危险的操作，比如上传你的密钥、助记词等等。

所以大家都提醒使用单独的机器来部署还是有道理的。

## 最后

AGI 还没有到来，硅基生命没有觉醒，但是 OpenClaw 和 Moltbook 让我看到了一点雏形。我认为现在的 Transformer 结构的大模型，一定不会出现未来的 AGI，因为他们本质还是下个 Token 预测机器。不过这个确实好玩，昨天玩了一晚上。

结果早上醒来，号没了。

![号没了](https://bucket.liruifengv.com/openclaw-and-moltbook/img-10.png)
