---
title: "Claude Agent SDK 使用过程中遇到的坑"
description: "今天这篇文章聊一聊 Claude Agent SDK 使用过程中遇到的坑，真的很麻"
pubDatetime: 2026-01-14
author: liruifengv
featured: true
draft: false
tags:
  - Claude
  - Agent
  - AI
---

最近在使用 Claude Agent SDK 来开发一个 Agent 客户端，叫做 [Amon](https://github.com/liruifengv/amon-agent), 使用 Electron 搭建。中间遇到不少坑。今天写一篇文吐槽一下。

先给大家不了解的人科普一下，Claude Code 是一个运行在终端的 Coding Agent，是一个 CLI。Claude Agent SDK 由 Claude Code 转化而来的 SDK。

文档在这里：[Claude Agent SDK 文档](https://platform.claude.com/docs/en/agent-sdk/overview)。

## pathToClaudeCodeExecutable

第一个问题。

Claude Agent SDK 的文档上，要求安装前，先安装 Claude Code，说是作为其运行时。

但实际上，SDK 的代码中，直接打包进去了一个 cli.js 文件，就是 CC cli 的所有代码。

然后 SDK 的 `query` 函数里有个参数是 `pathToClaudeCodeExecutable`，用来设置 CC 可执行文件的路径，默认就是内置的 cli.js。

所以 SDK 的原理就是 spawn 一个 node 进程，执行内置的 cli.js 文件，相当于一个 cli 套壳。

这时候我使用 Electron 就遇到第一个坑。开发时没问题，打包后，Electron 会把所有代码打包，cli.js 就不存在了。

所以需要在配置中这样设置：

```ts
  asar: {
    unpack: '**/node_modules/@anthropic-ai/**',
  },
```

把 `cli.js` 解放出来。

然后设置 `pathToClaudeCodeExecutable`：

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

上面说了，实际原理就是 spawn 一个 node 进程来执行 cli.js。

这时候就会遇到第二个坑：打包之后，未安装 Node.js 的用户会报错 `spawn node ENOENT`。这里很神奇，我电脑是有 Node.js 的，也一直报错，麻了，应该是找不到 node 的 PATH。

这里有三种解决方案：

第一个：

Cherry Studio 的解决方案是给 SDK 打了个 patch，把 `spawn` 替换成了 `fork`。`fork` 会自动使用 Electron 内置的 Node.js 运行时。

PR 在这里：[Cherry Studio 的解决方案](https://github.com/CherryHQ/cherry-studio/pull/12391)

第二个：

使用 SDK 的 `spawnClaudeCodeProcess` 参数来自定义进程 spawn，这种方式也很麻。。

第三个：

参考的 [claude-agent-desktop 的解决办法](https://github.com/pheuter/claude-agent-desktop)。

SDK 有个参数是 `executable`，值可以是 `node`、`bun`、`deno`。

他用的是 `bun`。

```ts
query({
  pathToClaudeCodeExecutable: resolveClaudeCodeCli(),
  executable: "bun",
})
```

然后在打包的时候把 `bun` 打包了进去，包括 `uv` 等，然后再设置 PATH

```ts
  const enhancedPath = buildEnhancedPath();
  const env: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([, v]) => v !== undefined) as [string, string][]
    ),
    PATH: enhancedPath,
  };
  // 使用 `env` 参数传入
  
  query({
    pathToClaudeCodeExecutable: resolveClaudeCodeCli(),
    executable: "bun",
    env
  })
  
```

把所有开发者用到的依赖打包进去，解决普通人使用的困难，我目前采用了这种方案。

## 自定义 API 的问题

SDK 的 `query` 方法，有个 `env` 参数，默认是 `process.env`，那么想自定义 API 可以传入自定义的环境变量。

```ts
query({
  env: {
    ...process.env,
    ANTHROPIC_BASE_URL: "ANTHROPIC_BASE_URL",
    ANTHROPIC_API_KEY: "ANTHROPIC_API_KEY",
  },
})
```

`query` 还有个参数是 `settingSources`, 值是数组，可以是 ['user', 'project', 'local']。
如果设置了 `project`，那么会读当前文件夹的 `.claude/settings.json`、Claude.md、Skills 这些。
如果设置了 `user`，那么会读当前用户的 `.claude/settings.json`、Claude.md、Skills 这些。

如果在 `~/.claude/settings.json` 设置了 API_KEY，那么会优先使用这个 API_KEY。

```JSON
{
  "env": {
    "ANTHROPIC_API_KEY": "ANTHROPIC_API_KEY",
    "ANTHROPIC_BASE_URL": "ANTHROPIC_BASE_URL"
  },
  "model": "opus"
}
```

这个时候你前面设置的自定义环境变量就失效了。

假如你想要在 SDK 中使用和 Claude Code 中不一样的 APIKEY，那么 `settingSources` 必须 bun 传 `user`。

而不设置 `user` 的话，他不会加载全局的 Skills。。。

## 权限问题

嗯，Cladue Code 的权限很复杂，也很强大，但是有点过于复杂了，设置项很多，层级很多。

SDK 有个 `permissionMode` 参数，用来控制不同的权限模式，权限也就是控制各种工具的使用。

还有 Hooks 可以控制，还有 `settings.json` 的配置可以控制，还有各种四五个地方可以控制。

问题来了

上面说了 `settingSources` 配置了 `project` 就会读取当前项目的配置对吧。

假如 SDK 的 `permissionMode` 设置是 `default`，那么默认会允许一些读操作的工具，写操作的工具都是需要用户同意。

如果在项目的根目录的 `settings.json` 这么写：

```json
{
  "permissions": {
    "defaultMode": "acceptEdits
  }
}
```

配置了允许编辑，我的期望是能覆盖 SDK 的权限设置，这时候应该能直接写文件。

而现实是不可以的，查了文档也没说到。问文档里的 AI，他说是为了让 SDK 尽可能独立不依赖 Claude Code。如果需要，需要自己写代码读取配置文件。

我：？

## API 混乱

`tools`、`allowedTools`、`canUseTool`、`disallowedTools` 你能分清是干嘛的？

- `tools` 是内置的工具
- `allowedTools` 是设置哪些工具可以直接使用，不用用户授权，比如设置了 write，就可以直接写文件。
- `disallowedTools` 这个我真不知道是干嘛的，也没试。和 `allowedTools` 的优先级哪个高，如果设置了，是直接不能用这个工具了，还是需要授权。
- `canUseTool` 是一个函数，当某个工具需要授权的时候，让用户选择允许还是拒绝。或者当 AskUserQuestion 被调用的时候，向用户澄清问题的时候用的。

## 总结

对于 Agent 的功能来说，SDK 内置了很多功能，让开发者能几行代码实现 Agent。
而实际上 SDK 就是 Claude Code CLI 的套壳，Spawn 的 cli.js，包了一层 API，这样搞很不好，开发体验非常差，而且又没完全继承 Claude Code，阉割了一点功能，又强依赖。蛋疼的很。

希望 Claude Agent SDK 后续能够剥离掉 cli 的依赖，把开发者体验做好一点，并且能够开源出来。
