---
title: "使用 Express、TypeScript 和 Deno 构建 REST API"
description: "使用 Express、TypeScript 和 Deno 构建 REST API的教程，翻译自 Deno 官方博客。"
author: liruifengv
pubDatetime: 2023-03-30
featured: false
draft: false
tags:
  - Deno
---

> 原文：https://deno.com/blog/build-api-express-typescript
> 译者：李瑞丰

有很多非常好的教程，可以帮助你开始使用 [TypeScript](https://www.typescriptlang.org/) 和 [Express](https://expressjs.com/) 构建 REST API。但是，这些教程有两个缺点：

1. 它们要求你安装和配置 TypeScript，并提供所有必需的内容。这可能会耗费时间并且会让人沮丧，特别是对于新手开发人员来说。

2. 它们没有解决如何防止不受信任的代码的问题。这并不奇怪，因为大多数工具都不支持这一点。

这就是我们创建这个教程的原因。使用 Deno，你不需要配置 TypeScript，因此你可以使用最少的依赖项启动并运行。

![](https://images.sayhub.me/blog/build-api-express-typescript/deno1.png)

你可以直接观看这篇文章的[油管视频](https://www.youtube.com/watch?v=TDFv2hBRUtQ)。

如果你想跳过直接查看代码，可以在[这里](https://github.com/tinkertim/deno-express-project)

## 设置 Express 和它的类型

让我们创建 `main.ts`，它将包含我们 API 的逻辑。

在这个文件中，让我们通过 `npm` 指定器导入 Express。

```js
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
```

这将为我们提供 express，但不提供类型定义。让我们通过添加这个注释来导入类型定义：

```js
// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
```

接下来，我们需要定义一种与 Express 应用程序接口交互的方式，我们还需要定义一个端口，以便它运行，我们将从环境变量中获取它：

```js
const app = express();
const port = Number(Deno.env.get("PORT")) || 3000;
```

让我们定义一个测试路由，它将在收到 GET 请求时打招呼，我们现在将其作为默认基本路由：

```js
app.get("/", (_req, res) => {
  res.status(200).send("Hello from Deno and Express!");
});
```

现在我们已经构建了简单的逻辑，我们只需要它来监听并开始处理请求！为此，我们将使用 .`listen()`，如下所示：

```js
app.listen(port, () => {
  console.log(`Listening on ${port} ...`);
});
```

现在我们已经准备好了！

## 安全地启动服务器

让我们启动我们的服务器：

![](https://images.sayhub.me/blog/build-api-express-typescript/deno-run-permissions.png)

当我们开发 API 时，我们必须引入各种各样的代码，从地理信息、人工智能、广告服务器到其他任何其他输入，这些输入必须结合在一起才能产生所需的内容。当然，我们不希望 Express 引入漏洞，但是 Express 只是你需要构建某些东西的堆栈的一部分。

如果它请求访问系统信息、高分辨率计时器或目录之外的访问，这将是一个警告标志。你可以通过各种方式指定权限，包括脚本中的注释。

现在，我们有了一个运行的 API 服务，我们可以使用 curl 进行查询：

![](https://images.sayhub.me/blog/build-api-express-typescript/deno-express-hello.png)

我们现在确定框架正常工作，所以我们确定了我们的安装以及其他所有内容。但是，它还不是一个很好的工作环境，所以让我们设置我们的 `deno.jsonc` 文件来定义一些辅助脚本：

![](https://images.sayhub.me/blog/build-api-express-typescript/deno-tasks-config.png)

这与 `package.json` 脚本类似（事实上，Deno 甚至可以使用 `package.json` 脚本，但是推荐使用 `deno.jsonc`），其中我们有一个用于开发的任务，另一个用于在不监视和重新加载更改的情况下启动服务器。

查看 `deno task` 的输出，我们可以确认我们有两个可用的脚本：

```bash
$ deno task
Available tasks:
- dev
    deno run --allow-read --allow-net --allow-env --watch main.ts
- start
    deno run --allow-read --allow-net --allow-env main.ts
```

我们可以分别使用 `deno task dev` 和 `deno task start`。

## 添加日志

下一件事是我们需要一些日志功能，以便在构建请求时可以排除故障，并且这是 Express 中间件概念的一个很好的介绍。

中间件是一个函数，它可以读取甚至修改 `req` 和 `res` 对象。我们使用中间件来做各种各样的事情，从日志记录到注入标题，甚至限速和检查身份验证。中间件必须在完成时做以下两件事之一：

- 它必须使用适当的响应关闭连接，或者
- 它必须调用 `next()`，它告诉 Express 是时候将对象传递给下一个中间件函数了

中间件需要三个参数：`req` 和 `res`，如你所期望的那样，还有 `next`，它指向下一个适当的中间件函数（或将控制权返回给处理程序函数）

与其在我们编写的每个处理程序中使用 `console.log()`，不如让我们来定义第一个中间件函数作为一个日志记录器，并告诉 Express 我们想要使用它。在 `main.ts` 中：

```js
const reqLogger = function (req, _res, next) {
  console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
};
```

你可以拥有任意多的中间件，并以适合你的方式组织它。只要记住，响应的速度取决于中间件链如何快速将控制权交还给框架。中间件按照框架通知它的顺序执行。

## 生成数据

所以我们现在已经处于一个非常好的地方来开始开发。运行 `./generate_data.ts` 命令（如果 shebang 不起作用，可以使用 `deno run -A ./generate_data.ts`），它将在 `data_blob.json` 中生成一些模拟用户数据，我们可以通过 Deno 的导入类型断言安全地像使用任何其他只读数据存储一样使用它：

```js
import demoData from "./data_blob.json" assert { type: "json" };
```

我们现在可以在处理程序中访问 `demoData.users`，所以让我们编写两个处理程序：

- 一个 `/users`，它返回用户对象的整个内容，以及
- 一个额外的动态路由，允许我们通过 ID 查找单个用户

```js
app.get("/users", (_req, res) => {
  res.status(200).json(demoData.users);
});

app.get("/users/:id", (req, res) => {
  const idx = Number(req.params.id);
  for (const user of demoData.users) {
    if (user.id === idx) {
      res.status(200).json(user);
    }
  }
  res.status(400).json({ msg: "User not found" });
});
```

我们还可以清除默认路由的 hello world，这使我们有了一个很好的 API 起点：

```js
// @deno-types="npm:@types/express@4"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
import demoData from "./data_blob.json" assert { type: "json" };

const app = express();
const port = Number(Deno.env.get("PORT")) || 3000;

const reqLogger = function (req, _res, next) {
  console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
  next();
};

app.use(reqLogger);

app.get("/users", (_req, res) => {
  res.status(200).json(demoData.users);
});

app.get("/users/:id", (req, res) => {
  const idx = Number(req.params.id);
  for (const user of demoData.users) {
    if (user.id === idx) {
      res.status(200).json(user);
    }
  }
  res.status(400).json({ msg: "User not found" });
});

app.listen(port, () => {
  console.log(`Listening on ${port} ...`);
});
```

请注意，`Hello, world!` 处理程序已被删除（并且在链接的存储库中不存在）。

## 下一步

我们有一个非常好的起点，一个 REST API 只有不到 30 行代码。现在，你可以使用 `app.post()` 添加一个 `POST` 处理程序，使用 `app.put()` 添加一个 `PUT` 处理程序，或者你想要的任何其他方法。

在未来的文章中，我们将介绍如何使用 Deno 的测试运行器和基准测试工具，以便我们更加放心地将我们的代码从概念验证转换为我们在生产中信任的内容。我们将在那之后用一些方法来部署我们的项目。
