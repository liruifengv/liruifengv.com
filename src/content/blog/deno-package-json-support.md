---
title: "Node/Deno 之父 ry: 我们为什么给 Deno 添加了 package.json 支持"
description: ""
pubDatetime: 2023-04-12
author: liruifengv
featured: false
draft: false
postSlug: deno-package-json-support
tags:
  - Deno
  - restful
---

> 原文：https://deno.com/blog/package-json-support
> 译者：李瑞丰

[最新的 Deno 版本](https://deno.com/blog/v1.31)引入了一个重大变化：通过 package.json 支持提供了增强的 Node 和 NPM 的兼容性。这个更新引起了一些关于我们的优先事项是否发生了变化的问题，因为 Deno 长期以来一直与打造一条不同于 Node.js 的道路联系在一起。事实上，package.json 在[第一次 Deno 演示](https://www.youtube.com/watch?v=M3BM9TB-8yA)中被明确提到是一个遗憾。 因此，许多用户对这一发展感到惊讶。

在这篇文章中，我们将解释这些问题，分享我们不断发展的想法，并概述我们的未来目标。

## 简化和加速 JavaScript 开发

Deno 是为了简化和加速 JavaScript 开发而创建的。核心功能包括原生 TypeScript 支持、内置工具、默认零配置和 Web 标准 API。从历史上看，这也意味着一个基于 Web 标准 HTTP imports 的与 NPM 生态系统分离的简约的去中心化的模块系统。

Deno 的主要目标是使编程既简单又快速。TypeScript、Web 标准 API 和许多其他功能都有助于实现这一目标，但是，Deno 的简约模块系统是否使编程变得简单和快速已经变得越来越不清楚。

## 依赖管理的梦想

JavaScript 生态系统依赖于[单一的集中式模块注册表](https://www.npmjs.com/)，这与 Web 的分散性相冲突。随着[ES 模块](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)的引入，现在有了一种标准的远程模块加载方式，但这种标准与通过 NPM 加载模块的方式完全不同。Deno 通过 HTTP URL 实现了 ES 模块的加载 - 允许任何人通过运行文件服务器在任何域上托管代码。

这种方法带来了很多好处。[单文件程序](https://deno.com/blog/a-whole-website-in-a-single-js-file)无需依赖清单（例如 `package.json`、`import_map.json`、`Cargo.toml` 或 `Gemfile` 等文件，用于列出依赖项及其来源）即可访问一些强大的工具。此外，Deno 程序还可以从较小的下载量中受益，因为只下载所需的文件，而不是包含不必要构建产物的大型 npm 包。 此外，使用 HTTP 进行模块链接还为创新提供了机会，例如根据 accept header 显示 HTML 文档，如 [deno.land 注册表](https://deno.land/x)中所示。

我们一直致力于使用 HTTP 导入作为 Deno 模块系统的支柱。我们已经在 deno.land 注册表中内置了各种有用的功能，例如 GitHub 集成的发布标签、不可变缓存和[自动生成的文档](https://deno.land/x/oak@v12.1.0/mod.ts)。像 [skypack](https://www.skypack.dev/) 和 [esm.sh](https://esm.sh/) 这样的第三方注册表已经使用 HTTP 导入将 NPM 包中的单个文件作为 ES 模块提供。我们已经建立了一些约定，例如 [deps.ts](https://deno.land/manual@v1.31.1/examples/manage_dependencies) 用于在一个方便的位置合并依赖项。

## 悬而未决的问题

在某些情况下，像 `https://deno.land/std@0.179.0/uuid/mod.ts` 这样的模块 URL 有时可能太具体了。它们不仅标识了包（`std/uuid/mod.ts`），而且还指定了要获取的版本（`0.179.0`）和服务器（`deno.land`）。当程序包含类似但略有不同的模块时，问题就会出现 - 如果另一个模块导入一个引用稍微不同版本的 URL，例如 `https://deno.land/std@0.179.1/uuid/mod.ts`，尽管几乎是相同的代码，但两个模块版本都将包含在模块图中。这被称为[重复依赖问题](https://gist.github.com/ry/f410f6977a164477953e903bcf9d7d74)（点击链接查看此问题的更具体的示例）。

在库代码中，我们开发了[类似 `deps.ts` 的模式](https://deno.land/manual@v1.31.2/examples/manage_dependencies)来管理远程依赖项。但是，`deps.ts` 并不是特别人性化 - 它需要扁平化和重新导出每个依赖项。 （未来可以通过 [Module Declarations](https://github.com/tc39/proposal-module-declarations) 和 [Import Reflection](https://github.com/tc39/proposal-import-reflection) TC39 提案来改进。）`deps.ts` 通常比带有裸指示符的 package.json 更冗长和语法上更混乱。

理想情况下，[Import Maps](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps) 可以通过允许用户在代码中使用裸指示符并仅在导入映射中指定 URL 来解决此问题。但是，[import maps 不可组合](https://github.com/WICG/import-maps/issues/137): 发布的库不能同时使用裸指示符和导入映射，因为导入该库的顶级项目无法将库的导入映射与其自身组合。

像 [esm.sh](https://esm.sh/) 和 [skypack](https://www.skypack.dev/) 这样的转译服务器非常适合将一些 NPM 模块导入 Deno，但它们有固有的局限性。例如，如果 NPM 模块在运行时加载数据文件，则这些转译服务器将无法提供兼容版本。这样的问题会导致开发人员体验不佳。

## 裸指示符的力量

使用裸指示符的导入语句（如下所示）是简洁而熟悉的：

```js
import express from "express";
```

裸指示符（`"express"`）提供了对依赖项的有用的模糊引用，这允许通过 semver 解析来解决重复依赖问题。但是，如果使用裸指示符编写库，则必须有一个依赖项清单来明确这些裸指示符指的是什么。

## 通过兼容性简化和加速

我们希望能够让 Deno 用户比使用 Node 时更有效地工作。开发人员希望导入一个库并使用它，而不会遇到麻烦。因此我们提供了 [npm 指示符支持](https://deno.com/blog/v1.28)。除了库之外，开发人员希望直接在 Deno 中运行现有的 Node 项目。因此我们新增了 package.json 支持。

Deno 的向后兼容性将 Node 和 NPM 的不理想的遗留功能保持在一定距离。例如，Deno 仅通过 NPM 导入支持 CommonJS。此外，Deno 不允许用户在 NPM 依赖项之外使用裸指示符（`"fs"`）引用内置的 Node 模块，而是必须使用 `"node:fs"`。例如，在 Deno 中，`setTimeout` 将根据 Web 标准返回一个数字（[与 Node 不同](https://nodejs.org/en/docs/guides/timers-in-node#leaving-timeouts-behind)）。Deno 不会随意运行后安装脚本并强制执行用户空间安全权限。向后兼容性并不意味着 JavaScript 生态系统不能发展和改进。

**请注意，Deno 将始终支持通过 URL 链接代码，继续像浏览器一样使用 HTTP 导入。** 现在，使用 `https`: URLs 只是 Deno 中链接代码的一种方法。从 Deno 1.28 开始，我们有 `npm:` URLs，很容易想象其他可以提高开发人员速度的方法，例如 `github:` URLs。

## 新的主版本

我们正在[努力](https://github.com/denoland/deno/issues/17475) 在未来几个月内发布 Deno 的新主版本。这个即将发布的主题是鼓励在 Deno 工作流中使用裸指示符。

尽管 Deno 对 NPM 模块具有出色的向后兼容性，但我们不会建议为 Deno 用户分发的 Deno 代码在那里发布。如果需要与 Node 和 NPM 项目共享代码，我们建议使用我们的[官方 Deno to NPM 编译器 DNT](https://github.com/denoland/dnt)，它输出包含从原始 TypeScript 派生的 Node 兼容的 JavaScript 和 TypeScript 声明文件的高质量 NPM 包。但是，为了真正地成为 TypeScript-first 世界，最好分发和链接到实际的 TypeScript 代码，而不是一些编译输出。

为了解决重复依赖问题并改善使用 TypeScript-first Deno 模块注册表的人体工程学，Deno 的下一个主要版本将引入 `deno:` URL 方案。通过使用这些特殊的 URL，而不是 HTTP URL，Deno 运行时能够进行 semver 解析和模块去重。此外，它消除了编写完整 URL 的需要。

例如，导入 [Oak](https://deno.land/x/oak) 将如下所示：

```js
import oak from "deno:oak@12";
```

请注意，只指定了主要版本 - 运行时将具有特殊的 semver 解析逻辑来查找与之匹配的 Oak 的正确版本。

下一个主要版本还将提倡使用导入映射，作为 package.json 工作流的现代替代方案。Deno 中的导入映射在自动发现的 `deno.json` 配置文件中指定。这是它看起来的样子：

```json
{
  "imports": {
    "oak": "deno:oak@12",
    "chalk": "npm:chalk@5"
  }
}
```

这个配置使任何代码都可以在代码中使用 `"oak"` 和 `"chalk"` 裸指示符。Oak 来自 Deno 注册表，Chalk 来自 NPM 注册表。代码中的导入将简单地是：

```js
import oak from "oak";
import chalk from "chalk";
```

无论使用现代的 import map 工作流还是 Node.js package.json 工作流，Deno 都旨在成为开发人员用来加速工作的可靠工具。JavaScript，世界级默认的编程语言，值得这种不断努力来改善其生态系统和工具。
