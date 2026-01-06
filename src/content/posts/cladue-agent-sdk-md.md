---
title: "Claude Agent SDK 最简玩法：几行代码配合 Markdown 轻松搭建 Agent"
description: "本文将带大家了解 Claude Agent SDK 的最简玩法，只需要几行代码，加上几个 Markdown 文件，就能搭建出一个 Agent。"
pubDatetime: 2026-01-06
author: liruifengv
featured: true
draft: false
tags:
  - Claude
  - Agent
  - AI
---

本文将带大家了解 Claude Agent SDK 的最简玩法，只需要几行代码，加上几个 Markdown 文件，就能迅速搭建出一个 Agent。

全部代码在我的 GitHub 仓库 [liruifengv/claude-agent-demo](https://github.com/liruifengv/claude-agent-demo)。

## 上节回顾

在上一篇文章中，我们 [使用 Claude Agent SDK 实现了一个 DeepResearch Agent](https://liruifengv.com/posts/claude-deepreseach-agent/)，它实现了一个多 Agent 协作系统，分为

- 负责分解研究任务，调度其他 Agent 的 Lead Agent
- 负责搜索网络、收集资料的 Researcher
- 负责将研究结果整理成报告 Report Writer

之前是基于代码实现的 SubAgents，现在我们使用 Markdown 文件来实现 Subagents。

## Markdown 实现

首先在项目的根目录创建 `.claude` 文件夹。

创建 `CLAUDE.md` 文件，这个文件就是主 Agent 的系统提示词，和 Claude Code 的用法一样。

```md title=".claude/CLAUDE.md"
You are a lead research coordinator who orchestrates comprehensive multi-agent research projects.

**CRITICAL RULES:**
1. You MUST delegate ALL research and report writing to specialized subagents. You NEVER research or write reports yourself.
2. Keep ALL responses SHORT - maximum 2-3 sentences. NO greetings, NO emojis, NO explanations unless asked.
3. Get straight to work immediately - analyze and spawn subagents right away.

<role_definition>
- Break user research requests into 2-4 distinct research subtopics
- Spawn multiple researcher subagents in parallel to investigate each subtopic
- Coordinate the research process and ensure comprehensive coverage
- After ALL research is complete, spawn a report-writer subagent to synthesize findings
- Your ONLY tool is Task - you delegate everything to subagents
</role_definition>

// 更多请查看代码仓库...
```

然后创建 `agents` 文件夹，这个文件夹是放 SubAgents 的提示词的。

创建一个 `researcher.md` 文件，这个文件就是 Researcher 的系统提示词。

```md title=".claude/agents/researcher.md"
---
name: researcher
description: Use this agent when you need to gather research information on any topic. The researcher uses web search to find relevant information, articles, and sources from across the internet. Writes research findings to files/research_notes/ for later use by report writers. Ideal for complex research tasks that require deep searching and cross-referencing.
tools: WebSearch, Write
---
You are a research specialist focused on information gathering. You always follow this system prompt COMPLETELY. This is critically important.

**CRITICAL: You MUST use WebSearch for ALL research. You MUST save CONCISE research summaries to files/research_notes/ folder.**

// 更多请查看代码仓库...
```

注意这个文件上方有三个横杠围起来的内容，叫做 `frontmatter`，里面是一些字段：

- `name`: SubAgent 的名称
- `description`: SubAgent 的描述，告诉 Lead Agent 什么时候应该调用这个 subagent
- `tools`: SubAgent 可以使用的工具。
- `model`: SubAgent 使用的模型。

Claude Agent SDK 在启动时会去读取 `.claude` 文件夹，加载系统提示词和 SubAgents。

同理，我们再创建一个 `report-writer.md` 文件，这个文件就是 Report Writer 的系统提示词。

```md title=".claude/agents/report-writer.md"
---
name: report-writer
description: Use this agent when you need to create a formal research report document. The report-writer reads research findings from files/research_notes/ and synthesizes them into clear, concise, professionally formatted reports in files/reports/. Ideal for creating structured documents with proper citations and organization. Does NOT conduct web searches - only reads existing research notes and creates reports.
tools: Read, Write, Glob, Skill
---
You are a professional report writer who creates clear, concise research summaries on any topic.

**CRITICAL: You MUST read research notes from files/research_notes/ folder.**

// 更多请查看代码仓库...
```

OK，有了这个三个 Markdown 文件，我们的 Agent 的核心就已经建立起来了。

接下来写一点代码：
```ts title="agent.ts"
import { query, type Query } from "@anthropic-ai/claude-agent-sdk";

const result: Query = query({
  prompt: userInput,
  options: {
    resume: sessionId,
    settingSources: ["project"],
    permissionMode: "bypassPermissions",
    allowedTools: ["Task"],
    hooks: customHooks,
  },
});

```

这里使用了 `query` 函数来调用 Agent，一些参数我们在之前的文章中讲过了。我们把 `settingSources` 设置为 `["project"]`，这样 Agent 就会从项目配置中读取设置。 `allowedTools` 我们只给主 Agent 一个 `Task` 工具安排任务。

这就是核心代码了!

其余的可以在根据需求，增加用户交互、自定义钩子函数、日志输出等。

## 总结

就这么简单，三个 Markdown 文件，配合几行代码，就能实现一个非常强的 DeepResearch Agent。这就是 Claude Agent SDK 的强大。
你不需要关心细节，什么 Agent Loop、工具调用、权限管理、SubAgents，这些都由 SDK 内部处理好了。

但是这样也有一个坏处，就是完全是一个黑盒，你不清楚内部实现细节，并且它是不开源的。

如果你是第一次开发 Agent，强烈建议先用 Claude Agent SDK 跑起来，大部分的功能都能实现的很好。当它不能满足你的需求或者当你需要更深入研究学习时，再转用其他更灵活的框架或者自己手撸。
