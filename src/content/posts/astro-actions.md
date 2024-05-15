---
title: "详解 Astro Actions API，在客户端类型安全地调用后端函数"
description: "本篇文章详解 Astro v4.8 新发布的 Actions API，让你可以在客户端类型安全地调用后端函数，全栈开发更爽了"
pubDatetime: 2024-05-15
author: liruifengv
featured: true
draft: false
tags:
  - Astro
  - front-end
---

在 Astro 新发布的 4.8 版本中，新增了一个 Actions API，用于在客户端类型安全地调用和定义后端函数。这个 API 使得全栈开发更加简单。本文将详细介绍 Astro Actions API 的使用方法。

相关文档：[Astro Actions API](https://docs.astro.build/zh-cn/reference/configuration-reference/#experimentalactions)

该 API 目前还在实验阶段，想了解更多请查看 RFC：[Actions API RFC](https://github.com/withastro/roadmap/blob/actions/proposals/0046-actions.md)


## 开启 Actions API

首先，你需要在项目根目录下的 `astro.config.mjs` 文件中开启 Actions API：

设置 `output` 为 `server`，并在 `experimental` 中开启 `actions`：

同时，我安装了 React 作为客户端框架。

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
	site: 'https://example.com',
  output: 'server',
  experimental: {
    actions: true,
  },
	integrations: [react()],
});

```

## 如何使用

所有的服务端 action 都需要在 `src/actions/index.ts` 中定义，这是所有 action 的入口文件。

### 定义服务端 action

```ts title="src/actions/index.ts"
import { defineAction, z } from "astro:actions";

export const server = {
  click: defineAction({
    input: z.object({
      name: z.string(),
      massage: z.string(),
    }),
    handler: async ({ name }) => {
      console.log(`Received name: ${name}`);
      // Do something such as querying a database
      return { success: true, data: `Hello ${name}` };
    },
  }),
};
```

以上代码，从 `astro:actions` 导入了 `defineAction` 和 zod 的 `z`。

所有的 action 包括在 `server` 对象中，每个 action 都是一个 `defineAction` 的调用。

`defineAction` 接受一个对象，包括 `input` 和 `handler` 两个字段。

`input` 是 zod 的 schema，用于验证输入参数。

`handler` 是一个处理函数，包括客户端传递的参数，这里可以进行一些数据处理，包括数据库请求等。

### 客户端调用 action

新建一个 React 组件 `ActionButton.tsx`，代码如下：

```tsx title="src/components/ActionButton.tsx"
import { actions } from "astro:actions";

export function ActionButton() {
  return (
    <button onClick={async (e) => {
          e.preventDefault();
          const result = await actions.click({
            name: 'liruifengv',
            massage: 'hello',
          });
          console.log(result);
          if (result.success) {
            alert(result.data);
          }
        }}>
      click me
    </button>
  );
}
```

从 `astro:actions` 导入 `actions`，然后在 `onClick` 事件中调用 `actions.click`，传递参数 `name` 和 `massage`。

这里在客户端调用 action 是有类型定义的，所以你可以在编辑器中获得代码提示，非常方便。

## form 提交调用 Action

对于前端经常处理的 form 提交，我们可以通过 `accept` 字段来接收 form 数据。

`accept` 字段可以是 `form` 或者 `json`，默认是 `json`。

```ts title="src/actions/index.ts" ins={5}
import { defineAction, z } from "astro:actions";

export const server = {
  signUp: defineAction({
    accept: "form",
    input: z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string().min(8),
    }),
    handler: async ({ username, email, password }) => {
      console.log(`Received username: ${username}, email: ${email}`);
      return { success: true };
    },
  }),
};
```

创建 React 客户端组件：`ActionForm.tsx`，代码如下：

```tsx title="src/components/ActionForm.tsx"
import { actions } from "astro:actions";

export function ActionForm() {
  return (
    <form
      style={{ display: "flex", flexDirection: "column", width: "200px"}}
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const result = await actions.signUp(formData);
        if (result.success) {
          alert("Sign up successful!");
        }
      }}
    >
      <label htmlFor="username">username</label>
      <input id="username" type="text" name="username" />
      <label htmlFor="email">email</label>
      <input id="email" type="email" name="email" />
      <label htmlFor="password">password</label>
      <input id="password" type="password" name="password" />
      <br/>
      <button type="submit">Sign up</button>
    </form>
  );
}
```

这是一个简单的 form 提交，通过 `FormData` 获取 form 数据，然后调用 `actions.signUp`。

## JS 不可用时 form 提供回退和渐进增强
服务器 action 定义不变。

在 React 客户端组件中写入以下代码：

```tsx title="src/components/ActionFormNoJS.tsx" ins={6, 16}
import { actions, getActionProps } from "astro:actions";

export function ActionFormNoJS() {
  return (
    <form
      method="POST"
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const result = await actions.newsletter(formData);
        if (result.success) {
          alert("Sign up successful!");
        }
      }}
    >
      <input {...getActionProps(actions.newsletter)} />
      <label htmlFor="email2">Email</label>
      <input name="email2" type="email" id="email2" />

      <label htmlFor="receivePromo">Receive promotional emails</label>
      <input name="receivePromo" type="checkbox" id="receivePromo" checked onChange={()=>{
        console.log("checked")
      }}/>

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

从 `astro:actions` 导入 `getActionProps`。在 form 上增加了 `method="POST"`。
同时新增了一个 input 设置 `...getActionProps(actions.newsletter)`。

input 会变为 

```html
<input type="hidden" name="_astroAction_" value="/_actions/newsletter" />
```

然后就会在没有 js 的情况下，通过 form 提交数据，Astro middleware 会进行处理。


## 自定义错误与错误处理


你可以通过 throw 一个 `ActionError`，来自定义错误码与错误信息。

`getApiContext` 可以获取到一些上下文信息，比如 cookies。

```ts title="src/actions/index.ts" ins={11-14}
import { defineAction, z, getApiContext, ActionError } from "astro:actions";

export const server = {
  customError: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async ({ name }) => {
      const { cookies } = getApiContext();
      console.log(`cookies: ${cookies.get("refreshToken")?.value}`);
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Custom error message",
      });
    },
  }),
};
```

创建一个 React 客户端组件 `ActionCustomError.tsx`，代码如下：

```tsx title="src/components/ActionCustomError.tsx"
import { actions, isInputError } from "astro:actions";

export function ActionCustomError() {
  return (
    <button onClick={async (e) => {
          e.preventDefault();
          const { data, error }  = await actions.customError.safe({
            name: 'liruifengv',
          });
          if (error) {
            if (isInputError(error)) {
              console.log("Handle Input error: ", error.fields);
            } else {
              console.log("Handle other errors: ", error.status, error.message);
            }
          } else {
            console.log("Success", data);
          }
        }}>
      click me
    </button>
  );
}
```


使用 `actions.customError.safe` 进行安全调用，会在 zod 校验参数失败时返回 `InputError`。

使用 `isInputError` 判断是否是参数错误，进行相应的处理。

如果是其他错误，会返回 `ActionError`，可以通过 `error.status` 和 `error.message` 获取错误码和错误信息。

## 总结

上面讲解了 Astro Actions API 的基本使用方法。Astro Actions 有点类似 trpc。用过 trpc 的同学会觉得这个 API 很熟悉。

在往常开发中，需要开发一个后端接口，后端定义参数 schema，手动执行检验，处理错误等，返回 HTTP Response。前端使用 fetch 等方式调用。整体流程还是比较繁琐的。

Actions API 通过 定义 action、调用 action 的方式，让整个流程更完整更简单，并且提供类型安全。

对于全栈开发，这个 API 会让开发更加简单，更加高效。
