---
title: "git blame 忽略指定 commit"
description: "学习 git 操作"
pubDatetime: 2023-12-29
author: liruifengv
featured: false
draft: false
tags:
  - git
---

## 场景

在一个没有 eslint、 prettier 的项目中，当你中途 format 了整个仓库之后， git blame 就会废掉，全是 format 的 commit。

## 解决方案

可以创建一个 `.git-blame-ignore-revs` 文件，写入要忽略的 commit id。

比如：

```bash title=".git-blame-ignore-revs"
# Apply with:
# `git config --local blame.ignoreRevsFile .git-blame-ignore-revs`

# [Add Prettier and format files](https://github.com/withastro/starlight/pull/393)
9b172f5ee09697d80f301e9b70aca1946419ce24
```

执行命令：`git config --local blame.ignoreRevsFile .git-blame-ignore-revs` 就好了。

GitHub 也会自动读取 .git-blame-ignore-revs 文件。
