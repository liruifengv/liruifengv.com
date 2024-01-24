---
title: "快速尝鲜字节刚刚开源的 Rspack，卷不动了？"
description: "你还卷得动吗？今天，字节跳动刚刚开源了 Rspack，一个 Rust 写的打包构建工具，功能和用法上对齐 webpack。"
pubDatetime: 2023-03-10
author: liruifengv
featured: false
draft: false
tags:
  - Vue
  - front-end
---

## 前言

今天，字节跳动刚刚开源了 [Rspack](https://github.com/web-infra-dev/rspack)，一个 Rust 写的打包构建工具，功能和用法上对齐 webpack。

官方仓库：https://github.com/web-infra-dev/rspack

官方文档：https://www.rspack.dev/zh/

我在第一时间进行了试用，速度确实很快。看一下官方给出的数据：

![image.png](https://bucket.liruifengv.com/rspack-vue/dev-compare.png)

![image.png](https://bucket.liruifengv.com/rspack-vue/build-compare.png)

> 你猜为什么没有跟 Vite 比？

## Vue 支持

毫不意外，得益于 JSX 的特性，Rspack 开箱支持 React。 我想看一下 Vue 的支持程度。

官方说法：

![image.png](https://bucket.liruifengv.com/rspack-vue/rspack-vue-support.png)

对于单文件组件，大家都知道需要 vue-loader 进行转换。目前支持不是太好，官方例子里，写了个简单的 vue-loader，见：https://github.com/web-infra-dev/rspack/tree/main/examples/vue

试着跑了一下，除了官方给出的代码，其他基本不行。

## Vue + JSX

好在 Vue3 对 JSX 的支持比 2.0 强了很多，那么只能用 Vue3 + JSX + Rspack 了。

同样官方给出了例子：https://github.com/web-infra-dev/rspack/tree/main/examples/vue3-jsx

安装依赖：

```bash
npm install -D babel-loader @babel/core @vue/babel-plugin-jsx
```

配置文件：

```js
// rspack.config.js
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: "./src/main.jsx",
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: ["@vue/babel-plugin-jsx"],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        type: "asset",
      },
    ],
  },
  builtins: {
    html: [
      {
        template: "./index.html",
      },
    ],
    define: {
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    },
  },
};
```

官方例子较为简略，我尝试新添加了组件、 vue-router、pinia 等。目前看来运行良好。

我的仓库：https://github.com/liruifengv/rspack-vue

## 插件系统

Rspack 的目标是对齐 webpack，对于已有的 Loader 和 Plugin 进行兼容。

其实用 Rust 开发的构建工具有一个问题，就是插件系统，是用 JS 还是 Rust 开发，JS 不可避免的带来性能的下降，Rust 的话有一定的学习曲线。

插件系统代表一个构建工具的生态，只有生态起来，构建工具才能火起来。Rspack 目前貌似可以用 Rust 和 JS 两种来开发插件（还没来得及细看），并且对于 webpack 现有生态的兼容是一个明智的决定。

## 贡献

我刚提交了我在 Rspack 的第一个 PR：https://github.com/web-infra-dev/rspack/pull/2101

可能的机会？

- Rspack 文档的完善
- create-rspack 工具，提供更多的模板
- create-rspack 工具，嗅探用户使用的包管理器
- 提交和 Vite 比较的基准测试？
- 生态系统的补充

## 最后

不知道 Rspack 是否能火起来，还是成为 KPI 工具，还是只在字节内部广泛使用。

你还记得 **Modern.js** 吗

![image.png](https://bucket.liruifengv.com/rspack-vue/evan-rspack.jpg)
