---
title: "写一个命令行CLI，一键生成各种烦人的lint配置"
description: "前端工程中各种配置文件eslint、prettier等搞得我很头大，那就写一个命令行工具来搞定它吧。"
pubDatetime: 2023-02-21
author: liruifengv
featured: false
draft: false
postSlug: create-lint-config
tags:
  - 开源
---

## 前言

写一个前端工程，要配置特别多的配置文件，大量的配置文件让我们很烦心，占用了大量写代码的时间。

![](https://bucket.liruifengv.com/create-lint-config/mulu.png)

就像上图，看着就头大。

每次要启动一个新的项目，都要从头配一遍。有人可能把这些文件当做模板保存下来，有需要的时候再复制粘贴。可是各个项目还是不尽相同，还是需要手动改动。

于是我决定写一个命令行工具来解决这件事。

## create-lint-config

这个工具叫做 `create-lint-config`，一个一键创建所有的 lint 配置的 CLI 命令行工具。前端工程中特别多的配置文件例如 Eslint、Prettier 等让我们心烦意乱。我们的目标是快速而轻松地生成这些配置！

[github 地址](https://github.com/liruifengv/create-lint-config)

[npm 地址](https://www.npmjs.com/package/create-lint-config)

### 使用

在你的项目根目录执行以下命令：

```bash
# npm
npm create lint-config@latest

# yarn
yarn create lint-config

# pnpm
pnpm create lint-config@latest
```

执行结果如下：

![screenshot](https://bucket.liruifengv.com/create-lint-config/screenshot.png)

这个命令，一次执行，创建了 Eslint、StyleLint、prettier、commitlint、husy、lint-staged 等所有配置文件。

### 现有功能

- [x] 生成 Eslint 配置。
- [x] 生成 prettier 配置。
- [x] 生成 stylelint 配置。
- [x] 生成 husky 配置。
- [x] 生成 commitlint 配置。
- [x] 自动安装依赖。
- [ ] 期待更多。

### 源码解读

```ts
#!/usr/bin/env node
async function install({
  pkgManager,
  cwd,
  _arguments,
}: {
  pkgManager: string;
  cwd: string;
  arguments: array;
}) {}

async function init() {
  // 拷贝配置文件基础模板，包括 Eslint、StyleLint、prettier、commitlint、husy、lint-staged
  await spinner({
    start: `Base template copying...`,
    end: "Template copied",
    while: () => {
      try {
        copy("base");
      } catch (e) {
        error("error", e);
        process.exit(1);
      }
    },
  });
  // 安装 husky
  await spinner({
    start: `Husky installing...`,
    end: "Husky installed",
    while: () =>
      install({
        cwd: process.cwd(),
        pkgManager: "npx",
        _arguments: ["husky", "install"],
      }).catch(e => {
        error("error", e);
        process.exit(1);
      }),
  });
  // husky 写入 commit-msg 校验指令，使用 commitlint
  await spinner({
    start: `Adding commit-msg lint...`,
    end: "Commit-msg lint added",
    while: () =>
      install({
        cwd: process.cwd(),
        pkgManager: "npx",
        _arguments: [
          "husky",
          "add",
          ".husky/commit-msg",
          'npx --no-install commitlint --edit ""',
        ],
      }).catch(e => {
        error("error", e);
        process.exit(1);
      }),
  });
  // husky 写入 pre-commit校验指令，使用 lint-staged 执行 elint 等
  await spinner({
    start: `Adding lint-staged...`,
    end: "Lint-staged added",
    while: () =>
      install({
        cwd: process.cwd(),
        pkgManager: "npx",
        _arguments: ["husky", "add", ".husky/pre-commit", "npx lint-staged"],
      }).catch(e => {
        error("error", e);
        process.exit(1);
      }),
  });
  // 安装依赖
  await spinner({
    start: `Dependencies installing with npm...`,
    end: "Dependencies installed",
    while: () =>
      install({
        cwd: process.cwd(),
        pkgManager: "npm",
        _arguments: ["install"],
      }).catch(e => {
        error("error", e);
        process.exit(1);
      }),
  });
}

init().catch(e => {
  console.error(e);
});
```

### TODO

- 支持通过`--template`标志来选择模板，创建更多的配置文件模板，包括 ts、vue、react、node 等等
- 支持更灵活的交互式选项。现在只能一键生成默认的模板，有些配置可能是一些人不需要的，后续计划可以更灵活。

## 总结

这个包还在起步阶段，我希望有需求的同学可以来参与贡献。

- 你可以贡献 feature
- 提交你自己正在使用的模板，以后用这个工具一键生成
- 你也可以 fork 或 clone 此项目，变成你自己的命令行工具
- 你也可以发布到你们公司的私有 npm，今年的 KPI 不就有了么

欢迎来点个 star，感谢支持
[github](https://github.com/liruifengv/create-lint-config)

[npm](https://www.npmjs.com/package/create-lint-config)
