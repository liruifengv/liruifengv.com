---
title: "使用 Deno 创建 HTTP 服务"
description: "今天我们来使用 Deno 创建一个 HTTP 服务，REST-API 增删查改"
pubDatetime: 2020-06-21
author: liruifengv
featured: false
draft: false
postSlug: deno-http
tags:
  - Deno
  - restful
---

## 前言

今天我们来使用 Deno 创建一个 HTTP 服务，在这之前呢，我们来做一些准备工作。

## Deno 介绍

对于对 Deno 不了解的同学，我们再来做一下 Deno 的介绍：

做前端的小伙伴都了解 Node.js，Deno 是和 Node.js 一样的，一个 JS/TS 运行时。
那么 Deno 的特点是什么呢：

- Deno 基于最新的 JavaScript 语言；

- Deno 具有覆盖面广泛的标准库；

- Deno 以 TypeScript 为核心，配以更多独特的方式从而带来了巨大的优势，其中包括一流的 TypeScript 支持（Deno 自动编译 TypeScript 而无需你单独编译）；

- Deno 大力拥抱 ES 模块标准；

- Deno 没有包管理器；

- Deno 具有一流的 await 语法支持；

- Deno 内置测试工具；

- Deno 旨在尽可能地与浏览器兼容，例如通过提供内置对象 fetch 和全局 window 对象。

Deno 初始的目标可能是 Node.js 的替代品，旨在解决 Node.js 的一些痛点和历史遗留问题。那么它和 Node.js 有哪些异同呢？

相同点：

- 两者都是基于 V8 引擎开发的；

- 两者都非常适合在服务器端上编写 JavaScript 应用。

不同点：

- Node.js 用 C++ 和 JavaScript 语言编写。Deno 用 Rust 和 TypeScript 语言编写。

- Node.js 有一个官方的软件包管理器，称为 NPM。Deno 不会有，而会允许你从 URL 导入任何 ES 模块。

- Node.js 使用 CommonJS 模块语法导入软件包。Deno 使用 ES 标准模块导入。

- Deno 在其所有 API 和标准库中都使用现代 ECMAScript 功能，而 Node.js 使用基于回调的标准库，并且没有计划对其进行升级。

- Deno 通过权限控制提供了一个安全的沙箱环境，程序只能访问由用户设置为可执行标志的文件。Node.js 程序可以直接访问用户足以访问的任何内容。

- Deno 长期以来一直在探索将程序编译成单个可执行文件的可能性，从而使得该可执行文件可以在没有外部依赖项（例如 Go）的情况下运行，但这并不是一件容易的事，如果做得到，将会成为更有话语权的游戏规则改变者。
- Deno 没有 npm 一样的包管理器。

## 安装

Deno 的安装其实很简单。

### windows 安装

windows 环境，官方推荐使用 [Chocolatey](https://chocolatey.org/packages/deno) 安装。

#### 首先安装 Chocolatey

那么首先，我们需要安装 Chocolatey。

用管理员模式运行 cmd，我们可在 C:\Windows\System32 下找到 cmd.exe 右键管理员运行。

输入以下命令：

```sh
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

安装完毕后，使用 `choco -v` 查看是否安装成功。

#### 安装 deno

```sh
choco install deno
```

使用 `deno -V` 查看是否安装成功。

### Mac 安装

Mac 安装最简单的方法是使用 Homebrew：

`sh brew install deno `
安装完毕后，使用 `deno -V` 查看是否安装成功。

## 安装 Vscode 扩展

![](https://bucket.liruifengv.com/deno-http/img1.webp)

## 启动一个 Deno 服务

首先新建一个 index.ts 文件，写入以下代码

![](https://bucket.liruifengv.com/deno-http/img2.webp)

使用`deno run index.ts` 命令运行它。

![](https://bucket.liruifengv.com/deno-http/img3.webp)

先下载了一些依赖项，最后在编译的步骤上报错了，提示我们没有网络权限，这其实是 Deno 的 安全沙箱 Sandbox 的问题。Deno 有一个安全沙箱，可以防止程序做一些你不允许的事情。
那么我们在上面的运行命令上加上 `--allow-net`

```
deno run --allow-net app.ts
```

![](https://bucket.liruifengv.com/deno-http/img4.webp)

运行成功了，该应用程序现在监听在 8000 端口上运行着 HTTP 服务器：

![](https://bucket.liruifengv.com/deno-http/img5.webp)

## 构建 REST-API

我们启动了一个 Deno 服务，那么如果我们想编写一套符合 REST 标准的 API，怎么办呢。我们知道，Node.js 拥有 Express、Koa、egg 等优秀的开源框架。Deno 同样有人开发了一个 Oak
框架，从名字上我们就能看出来，它是一个类似于 Koa 的中间件框架。

那么我们接下来构建一个这样的 API：

- 添加一本书
- 获得书的列表
- 获得某本书的详情
- 删除一本书
- 更新一本书

创建一个 app.ts 文件。

从 Oak 导入 Application 和 Router 对象：

```
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
```

然后我们得到环境变量 PORT 和 HOST:

```
const env = Deno.env.toObject();
const PORT = env.PORT || 8000;
const HOST = env.HOST || "127.0.0.1";
```

编写应用代码
![](https://bucket.liruifengv.com/deno-http/img6.webp)

使用命令来运行它

```sh
deno run --allow-env --allow-net app.ts
```

![](https://bucket.liruifengv.com/deno-http/img7.webp)

接下来我们来编写我们的 API 吧。

在文件的顶部，让我们定义一个 BOOK 的接口，然后我们声明一个初始的 books 数组 Book 对象。

```js
interface Book {
  name: string;
  author: string;
  introduction: string;
}

let books: Array<Book> = [
  {
    name: 'bookOne',
    author: '张三',
    introduction: '这是这本书的介绍',
  },
  {
    name: 'bookTwo',
    author: '李四',
    introduction: '这是这本书的介绍',
  },
]
```

安装 REST API 的规范定义好我们的结构

- GET /books

- GET /books/:name

- POST /books

- PUT /books/:name

- DELETE /books/:name

那么代码这么写：

```js
router
  .get("/books", getBooks)
  .get("/books/:name", getBook)
  .post("/books", addBook)
  .put("/books/:name", updateBook)
  .delete("/books/:name", deleteBook);
```

接下来写每个接口的方法：

`GET /books` 获取所有书籍列表

```js
// 获得所有书的列表
export const getBooks = ({ response }: { response: any }) => {
  response.body = books
}
```

`GET /books/:name` 通过名字来获取某一本书的详情

```js
// 获取某一本书
export const getBook = ({
  params,
  response,
}: {
  params: {
    name: string,
  },
  response: any,
}) => {
  const book = books.filter((book) => book.name === params.name)
  if (book.length) {
    response.status = 200
    response.body = book[0]
    return
  }
  response.status = 400
  response.body = { msg: `Cannot find book ${params.name}` }
}
```

`POST /books` 添加一本书

```js
// 添加一本书
export const addBook = async ({ request, response }: { request: any, response: any }) => {
  const body = await request.body()
  const book: Book = body.value
  books.push(book)
  response.body = { msg: 'OK' }
  response.status = 200
}
```

`PUT /books/:name` 更新一本书

```js
// 更新一本书
export const updateBook = async ({
  params,
  request,
  response,
}: {
  params: {
    name: string,
  },
  request: any,
  response: any,
}) => {
  const temp = books.filter((existingBook) => existingBook.name === params.name)
  const body = await request.body()
  const { introduction }: { introduction: string } = body.value
  if (temp.length) {
    temp[0].introduction = introduction
    response.status = 200
    response.body = { msg: 'OK' }
    return
  }
  response.status = 400
  response.body = { msg: `Cannot find book ${params.name}` }
}
```

`DELETE /books/:name` 删除一本书

```js
// 删除一本书
export const deleteBook = ({
  params,
  response,
}: {
  params: {
    name: string,
  },
  response: any,
}) => {
  const lengthBefore = books.length
  books = books.filter((book) => book.name !== params.name)
  if (books.length === lengthBefore) {
    response.status = 400
    response.body = { msg: `Cannot find book ${params.name}` }
    return
  }
  response.body = { msg: 'OK' }
  response.status = 200
}
```

好，现在所有的接口都写完了，我们可以用 postman 来进行测试。

- 获取所有书的列表

![](https://bucket.liruifengv.com/deno-http/img8.webp)

- 获取某一本书的详情
  ![](https://bucket.liruifengv.com/deno-http/img9.webp)

- 添加一本书
  ![](https://bucket.liruifengv.com/deno-http/img10.webp)

再次查询，发现刚才添加的书已经在列表中了。
![](https://bucket.liruifengv.com/deno-http/img11.webp)

- 修改一本书
  ![](https://bucket.liruifengv.com/deno-http/img12.webp)

再次查询，发现 bookOne 的简介更新了。
![](https://bucket.liruifengv.com/deno-http/img13.webp)

- 删除一本书
  ![](https://bucket.liruifengv.com/deno-http/img14.webp)

再次查询，发现 bookOne 已经从列表中删除了

![](https://bucket.liruifengv.com/deno-http/img15.webp)

以上，我们已经完成了我们的 REST API 了。可以看到 Deno 写代码与 Node.js 并没有太大的差异，不同的在于 Deno 的依赖管理方式，下一篇文章我们将讲一讲 Deno 项目如何管理引入依赖，以及它的优缺点。

本文所有代码可见：[Github](https://github.com/liruifengv/Deno-study)
