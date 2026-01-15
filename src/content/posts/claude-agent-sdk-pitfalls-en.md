---
title: "Common Pitfalls with the Claude Agent SDK"
description: "Sharing the frustrations and challenges I faced while working with the Claude Agent SDK"
pubDatetime: 2026-01-15
author: liruifengv
featured: true
draft: false
tags:
  - Claude
  - Agent
  - AI
---


Recently, I've been developing an Agent client called [Amon](https://github.com/liruifengv/amon-agent) using the Claude Agent SDK, built with Electron. I've run into quite a few pitfalls along the way, so I wanted to write this post to vent about them.

First, a quick introduction for those unfamiliar with it: Claude Code is a Coding Agent that runs in the terminal—a CLI tool. The Claude Agent SDK is an SDK evolved from Claude Code.

You can find the documentation here: [Claude Agent SDK Documentation](https://platform.claude.com/docs/en/agent-sdk/overview).

## pathToClaudeCodeExecutable

The first issue.

According to the Claude Agent SDK documentation, you need to install Claude Code before installing the SDK, as it serves as the runtime.

However, the SDK code actually bundles a `cli.js` file directly—which contains the entire Claude Code CLI.

The SDK's `query` function has a parameter called `pathToClaudeCodeExecutable` for setting the path to the Claude Code executable, which defaults to the built-in `cli.js`.

So the SDK's underlying mechanism is essentially spawning a Node process to execute the built-in `cli.js` file—like a wrapper around the CLI.

This is where I hit my first pitfall with Electron. Everything works fine during development, but after packaging, Electron bundles all the code, and `cli.js` no longer exists where expected.

So you need to configure it like this:

```ts
  asar: {
    unpack: '**/node_modules/@anthropic-ai/**',
  },
```

This unpacks `cli.js` from the bundle.

Then set `pathToClaudeCodeExecutable`:

```ts
function resolveClaudeCodeCli(): string {
  const cliPath = requireModule.resolve('@anthropic-ai/claude-agent-sdk/cli.js');
  if (cliPath.includes('app.asar')) {
    const unpackedPath = cliPath.replace('app.asar', 'app.asar.unpacked');
    if (existsSync(unpackedPath)) {
      return unpackedPath;
    }
  }
  return cliPath;
}

query({
  pathToClaudeCodeExecutable: resolveClaudeCodeCli(),
})
```

## spawn node ENOENT

As mentioned above, the actual mechanism is spawning a Node process to execute `cli.js`.

This leads to the second pitfall: after packaging, users without Node.js installed get a `spawn node ENOENT` error. What's bizarre is that my computer does have Node.js installed, yet it still kept throwing this error—I was stumped. It seems to be a PATH issue where it can't find the Node executable.

There are three solutions:

**First:**

Cherry Studio's approach was to patch the SDK, replacing `spawn` with `fork`. The `fork` method automatically uses Electron's built-in Node.js runtime.

PR here: [Cherry Studio's solution](https://github.com/CherryHQ/cherry-studio/pull/12391)

**Second:**

Use the SDK's `spawnClaudeCodeProcess` parameter to customize process spawning. This approach is also quite painful...

**Third:**

Referencing [claude-agent-desktop's solution](https://github.com/pheuter/claude-agent-desktop).

The SDK has an `executable` parameter that accepts values like `node`, `bun`, or `deno`.

They used `bun`:

```ts
query({
  pathToClaudeCodeExecutable: resolveClaudeCodeCli(),
  executable: "bun",
})
```

Then during packaging, they bundle `bun` itself (including dependencies like `uv`), and set up the PATH:

```ts
  const enhancedPath = buildEnhancedPath();
  const env: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([, v]) => v !== undefined) as [string, string][]
    ),
    PATH: enhancedPath,
  };
  // Pass in using the `env` parameter

  query({
    pathToClaudeCodeExecutable: resolveClaudeCodeCli(),
    executable: "bun",
    env
  })

```

Bundling all the dependencies developers use, solving the usability issues for average users. This is the solution I've currently adopted.

## Custom API Issues

The SDK's `query` method has an `env` parameter that defaults to `process.env`. To customize the API, you can pass custom environment variables:

```ts
query({
  env: {
    ...process.env,
    ANTHROPIC_BASE_URL: "ANTHROPIC_BASE_URL",
    ANTHROPIC_API_KEY: "ANTHROPIC_API_KEY",
  },
})
```

The `query` method also has a `settingSources` parameter, which takes an array that can include `['user', 'project', 'local']`.

If `project` is set, it reads the current folder's `.claude/settings.json`, `Claude.md`, Skills, etc.
If `user` is set, it reads the current user's `.claude/settings.json`, `Claude.md`, Skills, etc.

If you set `API_KEY` in `~/.claude/settings.json`, it will prioritize using that `API_KEY`.

```JSON
{
  "env": {
    "ANTHROPIC_API_KEY": "ANTHROPIC_API_KEY",
    "ANTHROPIC_BASE_URL": "ANTHROPIC_BASE_URL"
  },
  "model": "opus"
}
```

At this point, your custom environment variables set earlier become ineffective.

If you want to use a different API key in the SDK than what you use in Claude Code, you must exclude `user` from `settingSources`.

But if you don't include `user`, it won't load global Skills...

## Permission Issues

Claude Code's permission system is complex and powerful, but perhaps overly so—there are many settings with multiple layers.

The SDK has a `permissionMode` parameter to control different permission modes, where permissions control the usage of various tools.

There are also hooks for control, `settings.json` configurations for control, and four or five other places where you can control things.

The problem is:

As mentioned above, if `settingSources` includes `project`, it reads the current project's configuration.

Let's say the SDK's `permissionMode` is set to `default`—this allows read operations by default, but write operations require user consent.

If you write this in the project root's `settings.json`:

```json
{
  "permissions": {
    "defaultMode": "acceptEdits
  }
}
```

You've configured it to allow edits, so my expectation would be that this overrides the SDK's permission settings, enabling direct file writes.

In reality, it doesn't work that way. I checked the documentation, and there's no mention of this. I asked the AI in the documentation, and it said this is to keep the SDK as independent as possible from Claude Code. If needed, you need to write your own code to read the configuration file.

Me: ???

## API Confusion

`tools`, `allowedTools`, `canUseTool`, `disallowedTools`—can you tell them apart?

- `tools` are the built-in tools
- `allowedTools` specifies which tools can be used directly without user authorization—for example, setting `write` enables direct file writing
- `disallowedTools`—I genuinely don't know what this is for, and I haven't tested it. What's its priority relative to `allowedTools`? If set, does it mean the tool can't be used at all, or does it require authorization?
- `canUseTool` is a function that lets the user choose to allow or deny when a tool needs authorization, or is used when `AskUserQuestion` is called to clarify something with the user.

## Summary

In terms of Agent functionality, the SDK includes many features that let developers implement an Agent with just a few lines of code.

But in reality, the SDK is just a wrapper around the Claude Code CLI—it spawns `cli.js` and wraps it with an API layer. This approach is problematic; the developer experience is poor, and it doesn't fully inherit Claude Code's capabilities. It's stripped of some features while still being strongly dependent on it. Frustrating.

I hope the Claude Agent SDK can eventually decouple from the CLI dependency, improve the developer experience, and open source the project.
