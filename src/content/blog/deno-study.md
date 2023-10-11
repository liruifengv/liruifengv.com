---
title: "Deno 初探"
description: "Deno 的官方介绍是一个 JavaScript 和 TypeScript 的安全运行时。 Deno 旨在为现代程序员提供高效且安全的脚本环境。 它基于V8，Rust和TypeScript构建。"
pubDatetime: 2019-12-11
author: liruifengv
featured: false
draft: false
tags:
  - Deno
  - restful
---

今天要写的文章是关于 `Deno` 的，`Deno`是 node 之父 Ryan Dahl 新发布的开源项目。下面是它的主仓库：

```
https://github.com/denoland/deno
```

`Deno` 的官方介绍是一个 JavaScript 和 TypeScript 的安全运行时。 `Deno` 旨在为现代程序员提供高效且安全的脚本环境。
它基于 V8，Rust 和 TypeScript 构建。

今天主要记录它的安装和基本使用。

## 安装

我是 windows 环境，官方推荐使用 [Chocolatey](https://chocolatey.org/packages/deno) 安装。

### 安装 Chocolatey

那么首先，我们需要安装 Chocolatey。

用管理员模式运行 cmd，我们可在 C:\Windows\System32 下找到 cmd.exe 右键管理员运行。

输入以下命令：

```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

安装完毕后，使用 `choco -v` 查看是否安装成功。

### 安装 deno

```
choco install deno
```

使用 `deno -V` 查看是否安装成功。

## 运行 deno

OK，这时候我们成功的在我们电脑上安装了 deno。还记得每当我们学习一门新语言的时候，写下的第一句程序是什么吗？

我们新建一个 hello.ts 文件：

```js
console.log("hello world!");
```

在命令行输入下面命令：

```sh
deno hello.ts
```

这时候我们可以看到输出：

![](https://images.sayhub.me/blog/deno/hello-world.awebp)

哇，我们成功的写完了我们的第一个 deno 程序。

## 总结

今天主要是安装以及运行 deno，目前 deno 还处在比较早期的阶段，未来能否流行还未可知。后续的文章，会写一写 deno 目前实现的 api 的使用，以及如何使用 deno 开发 web 服务。
