---
title: "Deno2.0发布啦"
description: "Deno2.0发布啦"
pubDatetime: 2024-10-10
author: liruifengv
featured: false
draft: false
tags:
  - Deno
---
> 译者按：Deno昨天发布了2.0版本，一起来看下有什么变化吧。

## 宣布 Deno 2

Web 是人类最大的软件平台 —— 为它构建意味着可能[触及超过 50 亿人](https://www.forbes.com/home-improvement/internet/internet-statistics)。但随着[近年来 Web 开发的加速](https://siteefy.com/how-many-websites-are-there/)，它也变得越来越复杂且难以管理。在编写第一行代码之前，开发者必须处理繁琐的配置并穿梭于不必要的样板代码中，而他们更希望专注于交付产品并为用户提供价值。

尽管存在[这些复杂性](https://deno.com/learn/nodes-complexity-problem)，JavaScript 作为 Web 的语言，[在过去十年中一直保持着最受欢迎的语言地位](https://github.blog/news-insights/research/the-state-of-open-source-and-ai/)，而 TypeScript 则迅速崛起成为第三名。这证明了 JavaScript 在 Web 开发中的普遍性和实用性 —— 也表明 JavaScript 不会消失。

为了简化 Web 编程，我们创建了 Deno：一个现代的、一体化的、零配置的 JavaScript 和 TypeScript 开发工具链。

* **原生 TypeScript 支持**
* **基于 Web 标准构建**：Promises、fetch 和 ES Modules
* **包含所有必要工具**：内置格式化器、linter、类型检查器、测试框架、编译为可执行文件等
* [**默认安全**](https://docs.deno.com/runtime/fundamentals/security/)，就像浏览器一样

如今，数十万开发者喜爱使用 Deno，其[仓库](https://github.com/denoland/deno)成为 GitHub 上[仅次于 Rust 语言本身的第二大 Rust 项目](https://github.com/EvanLi/Github-Ranking/blob/master/Top100/Rust.md)。

虽然我们在 Deno 1 中完成了很多工作，但下一个主要版本专注于**大规模使用 Deno**。这意味着与传统 JavaScript 基础设施的无缝互操作性，以及对更广泛的项目和开发团队的支持。所有这些都不会牺牲 Deno 用户喜爱的简单性、安全性和"包含所有必要工具"的特性。

**今天，我们很高兴地宣布 Deno 2**，其中包括：

* 向后兼容 Node.js 和 npm，允许你无缝运行现有的 Node 应用程序
* 原生支持 `package.json` 和 `node_modules`
* 使用新的 `deno install`、`deno add` 和 `deno remove` 命令进行包管理
* 稳定的标准库
* 支持私有 npm 注册表
* Workspaces 和 monorepo 支持
* 长期支持 (LTS) 版本
* JSR：一个用于跨运行时共享 JavaScript 库的现代注册表

我们还在不断改进许多现有的 Deno 功能：

* `deno fmt` 现在可以格式化 HTML、CSS 和 YAML
* `deno lint` 现在有 Node 特定的规则和快速修复
* `deno test` 现在支持运行使用 `node:test` 编写的测试
* `deno task` 现在可以运行 `package.json` 脚本
* `deno doc` 的 HTML 输出具有改进的设计和更好的搜索功能
* `deno compile` 现在支持 Windows 上的代码签名和图标
* `deno serve` 可以跨多个核心并行运行 HTTP 服务器
* `deno init` 现在可以搭建库或服务器
* `deno jupyter` 现在支持输出图像、图表和 HTML
* `deno bench` 支持关键部分以进行更精确的测量
* `deno coverage` 现在可以以 HTML 格式输出报告

## 向后兼容，前瞻思维

Deno 2 向后兼容 Node 和 npm。这不仅允许你在当前的 Node 项目中运行 Deno，还可以逐步采用 Deno 的一体化工具链的各个部分。例如，在克隆 Node 项目后，你可以使用 `deno install` 以闪电般的速度安装依赖项，或运行 `deno fmt` 来格式化代码，而无需 Prettier。

Deno 2 与 Node 和 npm 的兼容性是强大的。Deno 2 理解 `package.json`、`node_modules` 文件夹，甚至 npm 工作区，允许你在使用 ESM 的任何 Node 项目中运行 Deno。如果需要进行微小的语法调整，你可以使用 `deno lint --fix` 来修复它们。

不喜欢 `package.json` 和 `node_modules` 目录的混乱，但仍需要使用那个 npm 包？你可以使用 `npm:` 说明符直接导入 npm 包。没有 `package.json` 和 `node_modules` 文件夹，Deno 将在全局缓存中安装你的包。这允许你[在单个文件中](https://deno.com/blog/a-whole-website-in-a-single-js-file)编写具有 npm 依赖项的程序 —— 不需要依赖项清单、配置文件或 `node_modules`。

```ts
import chalk from "npm:chalk@5.3.0";

console.log(chalk.blue("Hello， world!"));
// Hello， world! (in blue)
```

对于较大的项目，依赖清单可以简化依赖管理。将 `npm:` 说明符放入 `deno.json` 文件的导入映射中，允许直接导入包的裸名称：

```json
// deno.json
{
  "imports": {
    "chalk": "npm:chalk@5.3.0"
  }
}
```

```ts
import chalk from "chalk";

console.log(chalk.blue("Hello， world!"));
// Hello， world! (in blue)
```

通过使用 `npm:` 说明符导入 npm 包，你可以在 Deno 中访问超过 200 万个 npm 模块。这甚至包括复杂的包，如 [gRPC](https://www.npmjs.com/package/@grpc/grpc-js)、ssh2、Prisma、temporal.io、duckdb、polars。Deno 甚至支持高级功能，如 Node-API 原生插件。

最后，你可以将 Deno 2 与你喜欢的 JavaScript 框架一起使用。Deno 2 支持 Next.js、Astro、Remix、Angular、SvelteKit、QwikCity 和许多其他框架。

## Deno 现在通过 `deno install` 成为了一个包管理器

Deno 2 不仅支持 `package.json` 和 `node_modules` 文件夹，还提供了三个重要的子命令，让你可以轻松安装和管理依赖项。

`deno install` 以闪电般的速度安装你的依赖项。如果你有 `package.json`，它会在眨眼间创建一个 `node_modules` 文件夹。如果你不使用 `package.json`，它会将所有依赖项缓存到全局缓存中。

`deno install` 在冷缓存情况下比 npm 快 15%，在热缓存情况下快 90%。我们在这方面已经非常快了，但在接下来的几周内，预计会有更多改进，特别是在冷缓存场景下。

![](https://bucket.liruifengv.com/deno2-0/package-install-timings.png)

`deno add` 和 `deno remove` 可以用来向你的 `package.json` 或 `deno.json` 添加和移除包。如果你之前使用过 `npm install` 或 `npm remove`，这些命令会让你感到非常熟悉。

| ![Deno Add Demo 1](https://bucket.liruifengv.com/deno2-0/deno-add-demo1.png) | ![Deno Add Demo 2](https://bucket.liruifengv.com/deno2-0/deno-add-demo2.png) |
|:---:|:---:|

## JavaScript Registry

今年早些时候，我们推出了一个[现代的、开源的 JavaScript 注册表（Registry）](https://deno.com/blog/jsr_open_beta)，称为 [JSR](https://jsr.io/)。

它原生支持 TypeScript（你可以以 TypeScript 源代码的形式发布模块），处理多个运行时和环境的模块加载复杂性，只允许 ESM，[自动从 JSDoc 风格的注释生成文档](https://deno.com/blog/document-javascript-package)，并可以与类似 npm 和 npx 的系统一起使用（是的，JSR 将 TypeScript 转换为 `.js` 和 `.d.ts` 文件）。

由于你上传 TypeScript 到 JSR，它对正在发布的代码有出色的理解。这使我们能够为发布和使用模块提供无缝的开发者体验。如果你对细节感兴趣，可以阅读我们关于[如何设计 JSR](https://deno.com/blog/how-we-built-jsr) 的文章。

## 标准库现在已经稳定

虽然 npm 上有超过 200 万个模块可用，但搜索、评估和使用新模块的过程可能很耗时。这就是为什么我们已经构建 **Deno 标准库**超过 4 年的原因。

**标准库由数十个经过严格审核的实用模块组成，涵盖了从数据操作、Web 相关逻辑、JavaScript 特定功能等方方面面。** 它[在 JSR 上可用](https://jsr.io/@std)，并可以被其他运行时和环境使用。

为了让你了解 Deno 标准库中有哪些类型的模块，这里列出了部分标准库模块及其在 npm 中的等效包：

| Deno 标准库模块 | npm 包 |
|------------------------------|-------------|
| [@std/testing](https://jsr.io/@std/testing) | [jest](https://www.npmjs.com/package/jest) |
| [@std/expect](https://jsr.io/@std/expect) | [chai](https://www.npmjs.com/package/chai) |
| [@std/cli](https://jsr.io/@std/cli) | [minimist](https://www.npmjs.com/package/minimist) |
| [@std/collections](https://jsr.io/@std/collections) | [lodash](https://www.npmjs.com/package/lodash) |
| [@std/fmt](https://jsr.io/@std/fmt) | [chalk](https://www.npmjs.com/package/chalk) |
| [@std/net](https://jsr.io/@std/net) | [get-port](https://www.npmjs.com/package/get-port) |
| [@std/encoding](https://jsr.io/@std/encoding) | [rfc4648](https://www.npmjs.com/package/rfc4648) |

要查看完整的可用包列表，请访问 https://jsr.io/@std。

## 私有 npm 注册表

**Deno 2 中的私有 npm 注册表的工作方式[与 Node 和 npm 中相同，使用 `.npmrc` 文件](https://deno.com/blog/v1.44#support-for-private-npm-registries)：**

```
// .npmrc
@mycompany:registry=http://mycompany.com:8111/
//mycompany.com:8111/:_auth=secretToken
```

Deno 将自动识别这个 `.npmrc` 文件，并让你无需额外配置就能拉取私有包。

## 工作区和 monorepo

Deno 2 还支持工作区，这是管理 monorepo 的强大解决方案。只需在你的 `deno.json` 中使用 `workspace` 属性列出成员目录：

```json
// deno.json
{
  "workspace": ["./add"， "./subtract"]
}
```

这些成员可以有单独的依赖项、linter 和格式化器配置等。

Deno 不仅支持 Deno 包的工作区，还理解[ npm 工作区](https://docs.npmjs.com/cli/v7/using-npm/workspaces)。这意味着你可以创建一个混合的 Deno-npm monorepo（[参见这个例子](https://github.com/dsherret/npm-to-deno-workspace-example)），其中工作区成员可以有 package.json 或 deno.json：

![这个示例 monorepo 包含 npm 成员和 Deno 成员的混合。](https://bucket.liruifengv.com/deno2-0/monorepo.png)

你还可以通过运行 `deno publish` 将工作区成员发布到 JSR。例如，请参考 [Deno 标准库](https://jsr.io/@std)。无需手动确定发布包的顺序 - 只需运行 `deno publish`，它就会为你完成所有工作。

## LTS

通常，大型组织中的开发团队需要在生产环境中使用新版本之前仔细审核。考虑到 Deno 每周的错误修复版本和每 6 周的小版本更新，这可能会变得耗时。为了让这些团队更容易使用，**我们引入了长期支持（LTS）发布渠道。**

从 Deno 2.1 开始，LTS 渠道将在六个月内接收关键错误修复的回溯，确保生产使用的稳定和可靠基础。六个月后，将基于最新的稳定版本创建一个新的 LTS 分支。所有 LTS 版本都是免费提供的，并且采用 MIT 许可，使任何需要更稳定和安全环境的团队都能使用。

![从 Deno 2.1 开始，我们将引入一个 LTS 分支，我们将维护并回溯关键错误修复六个月。](https://bucket.liruifengv.com/deno2-0/lts-schedule.png)

最后，对于需要高级支持的团队，**我们推出了 [Deno for Enterprise 计划](https://deno.com/enterprise)**。它提供优先支持、直接接触我们的工程师、保证响应时间，以及优先考虑你的功能请求。我们已经与 Netlify、Slack 和 [Deco.cx](http://deco.cx/) 等公司合作，帮助他们的工程师更快地移动并为用户提供更多价值。

## Deno 速度很快!

我们在各种真实场景下为提高 Deno 的速度付出了巨大努力。我们的重点是在日常 JavaScript 和 TypeScript 开发中真正重要的性能改进——无论是启动时间、处理复杂请求还是整体效率。

虽然基准测试永远无法讲述完整的故事，但它们可以洞察运行时的优势所在。以下是一些展示 Deno 优势的基准测试，证明了它能够为开发者和生产环境提供顶级性能。

![请参考每个图表下方的链接以获取更多详细信息和可重现的步骤。](https://bucket.liruifengv.com/deno2-0/deno-perf-charts-3x3.png)

编辑：上面显示的第一个 [HTTP 基准测试](https://www.trevorlasn.com/blog/benchmarks-for-node-bun-deno/)是使用 Deno 1.45 进行的，而不是 Deno 2.0。实际上，Deno 2.0 比这里显示的慢约 20%。这种差异是由于[我们最近禁用了 V8 指针压缩](https://github.com/denoland/rusty_v8/pull/1593)以解决用户超过 4GB 堆限制的情况。我们计划很快重新启用指针压缩，因为它是大多数用户的理想默认设置。此外，我们将为那些需要更大堆的用户引入 `deno64` 构建。我们为这个疏忽道歉。

## 常见问题

### 如果 Deno 完全向后兼容 Node，为什么我应该使用 Deno 而不是 Node?

虽然 Deno 可以运行 Node 程序，但它旨在推动 JavaScript 和 TypeScript 向前发展。Deno 提供了 Node 所缺乏的功能，如原生 TypeScript 支持、Web 标准 API、完整的 JavaScript 开发工具链以及默认安全的执行模型——所有这些都在一个没有外部依赖的单一可执行文件中。使用 Deno 而不是 Node 可以节省您在设置和配置上的时间，让您更快地开始编码并提供价值。

### 在运行 Node 程序时，Deno 的选择性权限系统是否会生效?

是的，Deno 的默认安全执行模型在运行 Node 程序或导入 npm 模块时同样适用，确保相同级别的安全性。

### 为什么有新的 logo? 可爱的恐龙吉祥物怎么了?

从一开始，雨中可爱的蜥脚类恐龙就是 Deno 的形象。它古怪的魅力一直是 Deno 的标志，但设计从未统一——至少有两个"官方"版本和无数变体。随着 Deno 2.0 的到来，我们决定是时候进行更新了。

我们希望保留 Deno 用户喜爱的原始角色的本质，同时赋予它更精致的外观，以匹配 Deno 专业和生产级的性质。在重新设计过程中，我们意识到雨天背景虽然令人怀念，但不能很好地扩展，而且经常被忽视。它太繁忙了，特别是在小尺寸下，所以我们不得不放弃它。

经过多次迭代，我们发现将设计简化为核心元素达到了正确的平衡——简单友好，但又严肃可靠——就像 Deno 一样。

(别担心，可爱的小恐龙还在这里!)

### Deno 最初有一个雄心勃勃的愿景来现代化 JavaScript。但随着所有花在向后兼容性上的工作，Deno 原始愿景还剩下什么?

重写整个 JavaScript 生态系统是不切实际的。随着 Deno 扩展到小型程序之外，我们认识到支持 Node 和 npm 兼容性是必不可少的——特别是对于像 gRPC 和 AWS SDK 这样的工具，从头开始重写它们是不切实际的。

但 Deno 的目标不是成为 Rust 中的 Node 克隆或直接替代品。我们的目标是提升 JavaScript，超越 2010 年代的 CommonJS，以开发人员可以实际采用的方式缩小服务器端和浏览器环境之间的差距。我们拒绝接受 JavaScript 必须保持不匹配工具的混乱和无休止的转译层，无法进化。

Deno 的原始愿景仍然是我们所做一切的核心。这包括原生 TypeScript 支持、内置的 Web 标准如 Promises、顶级 await、Wasm、fetch 和 ES Modules，以及包含电池的工具链——所有这些都打包在一个无依赖的可执行文件中。当然，它默认是安全的，就像 Web 一样。

支持 npm 只是让 Deno 更加通用的一步。我们的使命是提供一个现代、精简的工具链，增强 JavaScript 体验——而不仅仅是支持遗留代码。虽然我们调整了方法，但我们的愿景保持不变:简化和赋能 Web 开发。

### 我喜欢 Deno 是因为它不需要任何配置文件，但随着新的包管理器添加，Deno 2 是否变得更像 Node，需要 package.json 来添加依赖项?

完全不是。您仍然可以运行单文件程序或脚本，无需任何配置或依赖清单——这一点没有改变。新的包管理命令(`deno install`、`deno add` 和 `deno remove`)是可选工具，旨在简化依赖管理，无论您使用 `deno.json` 还是 `package.json` 文件。它们对于更大、更复杂的项目特别有用，但如果您更喜欢无配置的简单性，它们不会妨碍您。

我们的核心目标之一是，Deno 可以扩展到简单的单文件程序，可以导入任何包而无需额外的仪式。例如，在 Jupyter notebooks 或快速脚本等上下文中，您可以轻松地执行:

```ts
import * as Plot from "npm:@observablehq/plot";
```

同时，Deno 可以扩展以处理具有多个文件甚至多个包的大型项目，例如在 monorepos 中。这种灵活性确保 Deno 对小型脚本和大型生产级应用程序同样有效。

### 我有一个 Fresh 项目。如果我升级到 Deno 2，会有破坏性变更吗?

没有!您的 Fresh 项目应该可以直接与 Deno 2 一起使用——无需更改。

### 我什么时候可以期待 Deno 2 登陆 Deno Deploy?

随时都可能!

## 接下来是什么

Deno 2 采用了开发者喜爱的 Deno 1.x 的所有功能 —— 零配置、用于 JavaScript 和 TypeScript 开发的一体化工具链、Web 标准 API 支持、默认安全 —— 并使其与 Node 和 npm (在 ESM 中) 完全向后兼容。这不仅使在任何 Node 项目中运行 Deno 变得简单，而且还允许在更大、更复杂的项目中逐步采用 Deno (例如，运行 `deno fmt` 或 `deno lint`)。结合改进的包管理、JSR 以及一系列针对更高级开发团队的功能，Deno 已准备好简化并加速您的开发。

然而，考虑到 Deno 的广泛功能，我们无法在一篇博文和一个视频中涵盖所有内容。Deno 有许多令人兴奋的功能和用例我们没有涉及。例如，能够使用 `deno compile` 将 JavaScript 游戏转换为具有跨平台编译(是的，包括 Windows)支持的桌面可执行文件。或者 Deno 的 Jupyter notebook 支持，允许您使用 TypeScript 和 @observable/plot 探索和可视化数据。或者使用 `deno doc` 从您的 JSDoc 注释和源代码生成文档或静态文档站点。

![](https://bucket.liruifengv.com/deno2-0/deno-future.png)

我们邀请您今天就尝试 Deno 2，体验 JavaScript 和 TypeScript 开发的未来。现在就开始使用 Deno 2:

- [Deno 入门 (文档)](https://deno.com/blog/v2.0#)
- [1.x ⇒ 2 迁移指南](https://deno.com/blog/v2.0#)
- [Deno 教程系列](https://deno.com/blog/v2.0#)
- [观看 Deno 2 发布主题演讲](https://deno.com/blog/v2.0#)

加入我们的社区，让我们一起塑造 JavaScript 的未来!
