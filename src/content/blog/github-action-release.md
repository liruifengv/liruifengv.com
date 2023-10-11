---
title: "使用 GitHub Action 自动化发布 npm 版本"
description: "本文将介绍如何利用 GitHub Action 自动化发布 npm 包版本和 GitHub release。"
pubDatetime: 2023-02-18
author: liruifengv
featured: false
draft: false
tags:
  - 开源
---

GitHub Action 是一套提供给 GitHub 仓库使用的 CI/CD 工具。它可以自动化、自定义和执行软件开发工作流程。本文将介绍如何利用 GitHub Action 自动化发布 npm 包版本和 GitHub release。

## CHANGELOG

作为一个开源仓库，`CHANGELOG` 变更记录是必不可少的。有很多的工具可以生成 `CHANGELOG.md`，这里我们使用`@changesets/cli`。

### 安装

```bash
pnpm i @changesets/cli
```

### 使用

执行以下命令进行初始化，它会在你的项目根目录生成一个`.changeset` 文件夹，里面包括一个配置文件和 README。

```bash
pnpm exec changeset init
```

每次修改代码之后，运行以下命令：

```bash
pnpm exec changeset
```

![](https://images.sayhub.me/blog/github-action-release/changeset.png)

这里会提示我们选择这次更改的类型。不了解的可以自行搜索 npm semver 版本号规范。

简单来说 `patch`是小的 bug 修改，不影响之前功能的小 feature 功能增加可以选 `minjor`，`major` 代表包含了 breaking change 的大版本号变动，比如 1.0.0 到 2.0.0。

输入本次修改的信息，一路回车就行。

![](https://images.sayhub.me/blog/github-action-release/changeset-patch.png)

这时候它会在`.changeset` 文件夹生成一个随机名字的 md 文件，包含你刚才提交的信息。

![](https://images.sayhub.me/blog/github-action-release/changeset-file.png)

接下来生成版本号。

```bash
pnpm exec changeset version
```

这个命令会读取你刚才生成的 changeset 文件，写入 `CHANGELOG.md`，并且把 `package.json` 中的版本号按照你选择的类型进行升级。

以上就是 `changeset` 的完整用法。

## release.yml

接下来开始创建 GitHub Action 的自动化脚本。

在你的项目根目录创建一个`.github`的文件夹，里面再创建一个`workflows`的文件夹，创建一个`release.yml`的文件。

文件内容如下，我来一一解读：

```yaml
# 整个流程的名字
name: Release

# 触发时机，在 main 分支 push 操作触发
on:
  push:
    branches:
      - main

# 默认shell
defaults:
  run:
    shell: bash

# 任务，定义个changelog 的任务
jobs:
  changelog:
    name: Changelog PR or Release
    # 这里判断仓库owner是否是我自己，为了避免别人 fork 仓库触发，请自行修改
    if: ${{ github.repository_owner == 'liruifengv' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      # 设置 pnpm。指定版本7.0，不然会报错
      - name: Setup PNPM
        uses: pnpm/action-setup@v2.2.1
        with:
          version: ^7.0

      # 设置 Node
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: "pnpm"
      # 安装依赖
      - name: Install dependencies
        run: pnpm install
      # 打包
      - name: Build Packages
        run: pnpm run build
      # 这一步是最重要的。使用changesets/action自动创建 PR 或者发布
      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          # 执行更新版本和发布的命令
          version: pnpm run version
          publish: pnpm exec changeset publish
          commit: "[ci] release"
          title: "[ci] release"
        env:
          # 这里需要几个 Token 变量
          # GITHUB_TOKEN 是 CI 里自带的默认 token
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # NPM_TOKEN 需要稍后在 npm 网站生成。
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

为了方便，我们在项目的`package.json`中添加几个脚本：

```json
// package.json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version && pnpm install"
  }
}
```

## 设置 TOKEN

把以上文件提交之后，我们来设置一下 token。

登录你的 npm 账号，点击头像选择 Access tokens。

![](https://images.sayhub.me/blog/github-action-release/npm_setting.png)

点击 Generate New Token。可以选择一键生成也可以更细粒度的控制权限。

![](https://images.sayhub.me/blog/github-action-release/npm_token_ge.png)

生成之后记得复制，关闭页面之后就看不到了。

回到 GitHub，你的仓库，点击 Settings，选择 Secrets and variables。创建一个 NPM_TOKEN。这样 GitHub Action 中就能取到它了。

![](https://images.sayhub.me/blog/github-action-release/github-new-token.png)

## 完整工作流程

### 本地提交修改

修改你要修改的代码。

### 运行生成 `changeset` 文件

```bash
pnpm exec changeset
```

生成 `changeset` 文件之后，注意不用执行再 `version` 命令了。

保存，把 `changeset` 文件和我们的代码修改一并提交。

### 发起 PR

![](https://images.sayhub.me/blog/github-action-release/changeset-bot.png)

这里我安装了[changeset-bot](https://github.com/apps/changeset-bot)。它可以自动探测 PR 中是否包含了 `changeset` 文件并进行评论。你可以点击链接安装它。

作为仓库 owner 你也可以直接 push 到 main 分支，但更多的开源贡献者喜欢用 PR 的方式。

### CI 发起 release PR

PR 合并进 main 分支之后，就触发了我们前面设置的 action。

![](https://images.sayhub.me/blog/github-action-release/workflow.png)

点击 Actions 查看，我们刚才的提交，触发了一个叫做 Release 的工作流。你可以点开查看，它会在 CI 环境里执行我们预设好的脚本。

我们的脚本就是，如果检测到提交携带有 `changeset` 信息，就会自动发起一个叫做 `[ci] release ` 的 PR。这个 PR 中，CI 自动帮我们做好了 `CHANGELOG` 的生成，版本号的升级。

![](https://images.sayhub.me/blog/github-action-release/release-pr.png)

当你点击 merge，合并到 main 分支之后，它就会自动地发布版本，同时发布到 npm 仓库和 GitHub release。

未合并期间，所有携带有 `changeset`的提交都会更新这个 PR。

### 发布

点击 merge 发布！恭喜你完成了整个流程。

过一会就能看到 GitHub release 和 npm 包都发布成功了。

## 总结

可能有人说，好像也是半自动化哦。

其实这是一套开源协作流程。

- 仓库的贡献者，修改代码，生成 `changeset`。
- CI 自动归结，生成 `CHANGELOG` 并 PR。
- 仓库的维护者，点击 merge 自动发布。

你还在手动改版本发布吗？你的开源项目还缺少完善的协作流程吗？来试一下这套流程吧。

## 结语

GitHub Action 还可以做很多事，比如 lint、format 代码；自动化部署等等。你可以[在我的 GitHub 找到更多例子](https://github.com/liruifengv)。
