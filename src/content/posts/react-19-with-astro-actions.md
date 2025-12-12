---
title: "学习 React 19 新 Hook useActionState，并在 Astro 中使用"
author: liruifengv
description: "React 19 引入了一个新 Hook useActionState。本文将介绍如何使用 useActionState，并在 Astro 中使用。"
pubDatetime: 2024-06-26
featured: false
draft: false
tags:
  - front-end
  - astro
  - react
---

## 介绍 React 19
前几日，React 发布了 React 19 RC 版本，带来了许多新功能和改进。本文主要来讲一下其中的 `useActionState` hook，以及如何结合 Astro Actions 使用。

这里是 React 官方 [关于 React 19 RC 的文章](https://react.dev/blog/2024/04/25/react-19)。

## 介绍 `useActionState`

`useActionState` 是 React 19 中引入的一个新 hook，用于简化处理表单提交和状态管理。它接受一个异步操作和默认值，并返回当前的状态、提交函数和加载状态。这个 hook 主要解决了在表单提交时的繁琐状态管理问题，使代码更加简洁和直观。

这里是 `useActionState` 的文档：[useActionState reference](https://react.dev/reference/react/useActionState)。

## 没有 `useActionState` 之前

在引入 `useActionState` 之前，我们通常需要手动管理状态和异步操作。例如，处理一个简单的表单提交：

```jsx
import { useState } from 'react';

function Form() {
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const res = await fetch('/api/updateName', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit" disabled={isPending}>Update</button>
      {isPending && <p>Updating...</p>}
      {error && <p>{error}</p>}
      {response && <p>{response.message}</p>}
    </form>
  );
}

```

这段代码需要手动管理多个状态，并处理表单的提交逻辑。

## 使用 `useActionState`

有了 `useActionState`，代码变得更为简洁。以下是使用 `useActionState` 的例子：

```jsx
import { useActionState } from 'react';

function Form() {
  const [state, submitAction, isPending] = useActionState(
    async (name) => {
      const res = await fetch('/api/updateName', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      return res.json();
    },
    ''
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" placeholder="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {isPending && <p>Updating...</p>}
      {state && <p>{state.message}</p>}
    </form>
  );
}
```

`useActionState` 接受一个异步操作和默认值，返回当前的状态、提交函数和加载状态。这样，我们只需要关注表单的提交逻辑，而不用手动管理多个状态。

## 结合 Astro Actions 使用 `useActionState`

Astro Actions 是 Astro 4.8 版本中新增的 API，用于在客户端类型安全地调用和定义后端函数。
并且在 `@astrojs/react` 集成中，提供了对 React 19 的支持。

这里是我往期介绍 Astro Actions 的文章：[详解 Astro Actions API，在客户端类型安全地调用后端函数](https://liruifengv.com/posts/astro-actions/)。

下面我们结合 Astro Actions 来使用 `useActionState`。

在你的 Astro 项目中定义一个 `actions/index.ts` 文件：

```ts title="src/actions/index.ts"
import { defineAction, z } from "astro:actions";

export const server = {
  updateName: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
    }),
    handler: async ({ name }) => {
      console.log(`Received name: ${name}`);
      return name;
    },
  }),
};
```

在 React 组件中引入 actions

```tsx ins={2,7}
import { useActionState } from "react"
import { experimental_withState } from "@astrojs/react/actions"
import { actions } from "astro:actions"

export function Form() {
  const [state, submitAction, isPending] = useActionState(
    experimental_withState(actions.updateName),
    ""
  )

  return (
    <form action={submitAction}>
      <input type="text" name="name" placeholder="name"/>
      <button type="submit" disabled={isPending}>Update</button>
      {state}
      {isPending && <p>Updating...</p>}
    </form>
  )
}
```

`@astrojs/react` 提供了一个 `experimental_withState` 函数，用于将 Astro Actions 转换为 `useActionState` 可以使用的函数。

以上代码非常简洁，完成了一个前后端交互的表单提交功能，表单提交将直接调用 Astro Actions 中的 `updateName` 函数，状态自动管理。

## 总结

当然，上面写的都是很简单的例子，实际业务开发中可能会更复杂，并且 React 19 和 Astro Actions 都还在实验中，没有 stable，可能会有一些变化。

对于 `useActionState`，我认为很适合结合 Server Actions 使用，包括 Astro Actions、React 的 Server Actions。

React 也一直在推进 RSC 和 Server Actions，通过类似的东西，让前后端开发更加简单，未来时代，或许快速出活才是王道。
