---
title: "打造你自己的 JavaScript 运行时"
description: "教你使用 Rust 和 deno_core 打造属于你自己的 JavaScript 运行时。"
pubDatetime: 2023-04-05
author: liruifengv
featured: false
draft: false
postSlug: roll-your-own-javascript-runtime
tags:
  - Deno
  - Rust
  - JavaScript
  - front-end
---

## 前言

> 原文：https://deno.com/blog/roll-your-own-javascript-runtime
> 译者：李瑞丰

在这篇文章中，我们将介绍如何创建自定义 JavaScript 运行时。我们称之为 `runjs`。想象一下，我们正在构建一个（更）简化的 `deno` 版本。这篇文章的目标是创建一个 CLI，可以执行本地 JavaScript 文件，读取文件，写入文件，删除文件，并具有简化的 `console` API。

让我们开始吧。

## 前提

这篇教程假设读者具有以下知识：

- Rust 基础知识
- JavaScript 事件循环基础知识

确保你的机器上安装了 Rust（以及 `cargo`），并且它至少是 `1.62.0` 版本。访问 rust-lang.org 安装 Rust 编译器和 `cargo`。

确保我们已经准备好了：

```bash
$ cargo --version
cargo 1.62.0 (a748cf5a3 2022-06-08)
```

## Hello, Rust!

首先，让我们创建一个新的 Rust 项目，它将是一个名为 `runjs` 的二进制 crate：

```bash
$ cargo init --bin runjs
     Created binary (application) package
```

让我们进入 `runjs` 目录并在编辑器中打开它。确保一切都设置正确：

```bash
$ cd runjs
$ cargo run
   Compiling runjs v0.1.0 (/Users/ib/dev/runjs)
    Finished dev [unoptimized + debuginfo] target(s) in 1.76s
     Running `target/debug/runjs`
Hello, world!
```

很好！现在让我们开始创建我们自己的 JavaScript 运行时。

## 依赖

接下来，让我们将 [`deno_core`](https://crates.io/crates/deno_core) 和 [`tokio`](https://crates.io/crates/tokio) 依赖项添加到我们的项目中：

```bash
$ cargo add deno_core
    Updating crates.io index
      Adding deno_core v0.142.0 to dependencies.
$ cargo add tokio --features=full
    Updating crates.io index
      Adding tokio v1.19.2 to dependencies.
```

我们更新后的 `Cargo.toml` 文件应该如下所示：

```toml title="Cargo.toml"
[package]
name = "runjs"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
deno_core = "0.142.0"
tokio = { version = "1.19.2", features = ["full"] }
```

`deno_core` 是 Deno 团队的一个 crate，它抽象了与 V8 JavaScript 引擎的交互。V8 是一个复杂的项目，有成千上万的 API，因此为了简化使用它们，`deno_core` 提供了一个 `JsRuntime` 结构体，它封装了一个 V8 引擎实例（称为 [Isolate](https://v8docs.nodesource.com/node-0.8/d5/dda/classv8_1_1_isolate.html#details)），并允许与事件循环集成。

`tokio` 是一个异步的 Rust 运行时，我们将使用它作为事件循环。Tokio 负责与操作系统抽象（如网络套接字或文件系统）进行交互。`deno_core` 与 `tokio` 一起，允许 JavaScript 的 `Promise` 映射到 Rust 的 `Future`。

拥有 JavaScript 引擎和事件循环，使我们能够创建 JavaScript 运行时。

## Hello, runjs!

让我们从编写一个异步的 Rust 函数开始，该函数将创建一个 `JsRuntime` 实例，该实例负责 JavaScript 执行。

```rust title="main.rs"
use std::rc::Rc;
use deno_core::error::AnyError;

async fn run_js(file_path: &str) -> Result<(), AnyError> {
  let main_module = deno_core::resolve_path(file_path)?;
  let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
      module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
      ..Default::default()
  });

  let mod_id = js_runtime.load_main_module(&main_module, None).await?;
  let result = js_runtime.mod_evaluate(mod_id);
  js_runtime.run_event_loop(false).await?;
  result.await?
}

fn main() {
  println!("Hello, world!");
}
```

这里有很多东西要解释。异步的 `run_js` 函数创建了一个新的 `JsRuntime` 实例，该实例使用基于文件系统的模块加载器。之后，我们将模块加载到 `js_runtime` 运行时中，对其进行评估，并运行一个事件循环直到完成。

这个 `run_js` 函数封装了我们的 JavaScript 代码将要经历的整个生命周期。但是在我们能够这样做之前，我们需要创建一个单线程的 `tokio` 运行时，以便能够执行我们的 `run_js` 函数：

```rust title="main.rs"
fn main() {
  let runtime = tokio::runtime::Builder::new_current_thread()
    .enable_all()
    .build()
    .unwrap();
  if let Err(error) = runtime.block_on(run_js("./example.js")) {
    eprintln!("error: {}", error);
  }
}
```

让我们尝试执行一些 JavaScript 代码！创建一个 `example.js` 文件，它将打印 "Hello runjs!"：

```js title="example.js"
Deno.core.print("Hello runjs!");
```

注意，我们使用的是 `Deno.core` 中的 print 函数 - 这是一个全局可用的内置对象，由 `deno_core` Rust crate 提供。

现在运行它：

```bash
cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/runjs`
Hello runjs!⏎
```

成功！在仅 25 行 Rust 代码中，我们创建了一个简单的 JavaScript 运行时，可以执行本地文件。当然，此时此运行时不能做太多事情（例如，`console.log` 还不能工作 - 尝试一下！），但是我们已经将 V8 JavaScript 引擎和 `tokio` 集成到我们的 Rust 项目中。

## 添加 `console` API

让我们开始处理 `console` API。首先，创建 `src/runtime.js` 文件，该文件将实例化并使 `console` 对象全局可用：

```js title="src/runtime.js"
(globalThis => {
  const core = Deno.core;

  function argsToMessage(...args) {
    return args.map(arg => JSON.stringify(arg)).join(" ");
  }

  globalThis.console = {
    log: (...args) => {
      core.print(`[out]: ${argsToMessage(...args)}\n`, false);
    },
    error: (...args) => {
      core.print(`[err]: ${argsToMessage(...args)}\n`, true);
    },
  };
})(globalThis);
```

函数 `console.log` 和 `console.error` 将接受多个参数，将它们转换为 JSON（以便我们可以检查非原始 JS 对象）并在每个消息前加上 `log` 或 `error` 前缀。这是一个“普通的” JavaScript 文件，就像我们在 ES 模块之前在浏览器中编写 JavaScript 一样。

为了确保我们不会污染全局作用域，我们在 [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) 中执行此代码。如果我们没有这样做，那么 `argsToMessage` 辅助函数将在我们的运行时中全局可用。

现在，让我们将此代码包含在我们的二进制文件中，并在每次运行时执行：

```rust title="main.rs" ins={5}
let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
  module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
  ..Default::default()
});
 js_runtime.execute_script("[runjs:runtime.js]",  include_str!("./runtime.js")).unwrap();
```

最后，让我们使用我们的新 `console` API 更新 `example.js`：

```js title="example.js" ins={2,3} del={1}
Deno.core.print("Hello runjs!");
console.log("Hello", "runjs!");
console.error("Boom!");
```

再次运行它：

```bash
cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.05s
     Running `target/debug/runjs`
[out]: "Hello" "runjs!"
[err]: "Boom!"
```

它起作用了！现在让我们添加一个 API，它将允许我们与文件系统进行交互。

## 添加一个基本的文件系统 API

让我们从更新我们的 `runtime.js` 文件开始：

```js title="runtime.js" ins={3-14}
};

  core.initializeAsyncOps();
  globalThis.runjs = {
    readFile: (path) => {
      return core.ops.op_read_file(path);
    },
    writeFile: (path, contents) => {
    return core.ops.op_write_file(path, contents);
    },
  removeFile: (path) => {
      return core.ops.op_remove_file(path);
    },
  };
})(globalThis);
```

我们刚刚添加了一个新的全局对象，称为 `runjs`，它有三个方法：`readFile`、`writeFile` 和 `removeFile`。前两个方法是异步的，而第三个是同步的。

你可能想知道这些 `core.ops.[op name]` 调用是什么 - 它们是 `deno_core` crate 中用于绑定 JavaScript 和 Rust 函数的机制。当你调用其中任何一个时，`deno_core` 将查找具有 `#[op]` 属性和匹配名称的 Rust 函数。

让我们通过更新 main.rs 来看看它的作用：

```rust title="main.rs" ins={1,2,6-22}
  use deno_core::op;
  use deno_core::Extension;
use deno_core::error::AnyError;
use std::rc::Rc;

  #[op]
  async fn op_read_file(path: String) -> Result<String, AnyError> {
      let contents = tokio::fs::read_to_string(path).await?;
      Ok(contents)
  }

  #[op]
  async fn op_write_file(path: String, contents: String) -> Result<(), AnyError> {
      tokio::fs::write(path, contents).await?;
      Ok(())
  }

  #[op]
  fn op_remove_file(path: String) -> Result<(), AnyError> {
      std::fs::remove_file(path)?;
      Ok(())
  }
```

我们刚刚添加了三个可以从 JavaScript 调用的 ops。但是，在这些 ops 可用于我们的 JavaScript 代码之前，我们需要通过注册“扩展”来告诉 `deno_core`：

```rust title="main.rs" ins={3-9,12}
async fn run_js(file_path: &str) -> Result<(), AnyError> {
    let main_module = deno_core::resolve_path(file_path)?;
    let runjs_extension = Extension::builder("runjs")
        .ops(vec![
            op_read_file::decl(),
            op_write_file::decl(),
            op_remove_file::decl(),
        ])
        .build();
    let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
        module_loader: Some(Rc::new(deno_core::FsModuleLoader)),
        extensions: vec![runjs_extension],
        ..Default::default()
    });
```

Extensions 允许你配置你的 `JsRuntime` 实例，并将不同的 Rust 函数暴露给 JavaScript，以及执行更高级的操作，如加载其他 JavaScript 代码。

让我们再次更新我们的 `example.js`：

```js title="example.js" ins={3-17}
console.log("Hello", "runjs!");
console.error("Boom!");

const path = "./log.txt";
try {
  const contents = await runjs.readFile(path);
  console.log("Read from a file", contents);
} catch (err) {
  console.error("Unable to read file", path, err);
}

await runjs.writeFile(path, "I can write to a file.");
const contents = await runjs.readFile(path);
console.log("Read from a file", path, "contents:", contents);
console.log("Removing file", path);
runjs.removeFile(path);
console.log("File removed");
```

再次运行它：

```bash

$ cargo run
   Compiling runjs v0.1.0 (/Users/ib/dev/runjs)
    Finished dev [unoptimized + debuginfo] target(s) in 0.97s
     Running `target/debug/runjs`
[out]: "Hello" "runjs!"
[err]: "Boom!"
[err]: "Unable to read file" "./log.txt" {"code":"ENOENT"}
[out]: "Read from a file" "./log.txt" "contents:" "I can write to a file."
[out]: "Removing file" "./log.txt"
[out]: "File removed"

```

恭喜，我们的 `runjs` 运行时现在可以与文件系统一起工作！注意，从 JavaScript 调用 Rust 代码所需的代码量非常少 - `deno_core` 负责在 JavaScript 和 Rust 之间传递数据，因此我们不需要自己进行任何转换。

## 总结

在这个简短的例子中，我们开始了一个集成了强大的 JavaScript 引擎（`V8`）和高效的事件循环实现（`tokio`）的 Rust 项目。

本文由 [liruifengv](https://github.com/liruifengv) 翻译，原文地址：https://deno.com/blog/roll-your-own-javascript-runtime

此教程的[第二部分](https://deno.com/blog/roll-your-own-javascript-runtime-pt2)已经发布，实现了 fetch-like API 并添加了 TypeScript 转译功能。

完整的示例代码在 [denoland 的 GitHub](https://github.com/denoland/roll-your-own-javascript-runtime)。也可以在译者的仓库查看[第一部分代码](https://github.com/liruifengv/runjs)。
