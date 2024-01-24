---
title: "Next.js"
description: "Next.js 使用 app route，国际化时无法自定义 404 页面。"
pubDatetime: 2024-01-04
author: liruifengv
featured: false
draft: false
postSlug: nextjs-404-in-i18n
tags:
  - Next.js
  - React
  - front-end
---

## 问题

使用 Next.js 框架，app route 模式，404 页面在国际化场景下无法正常使用。

在 Next.js 中的 app route 模式，约定了很多页面的路径，比如 `layout.tsx`、`page.tsx`。对于 404 页面，可以使用 `not-found.tsx`:

```tsx title="app/not-found.tsx"
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

再说回国际化，国际化方案一般使用动态路由，在 `app` 目录下创建 `[lang]` 文件夹。

这样就可以在页面中通过 params 获取到当前语言，然后根据语言加载对应的资源。

```ts title="app/[lang]/layout.tsx"
export default function RootLayout({ children, params: { lang } }) {
```

那么所有的页面都应该在 `[lang]` 目录下，包括 404 页面。就像这样 `app/[lang]/not-found.tsx`。

问题来了，这样写的话，输入一个不存在的路径，会显示 Next.js 默认的 404 页面，而不是我们自定义的 404 页面。

![Next.js default 404 page](https://bucket.liruifengv.com/nextjs-404-in-i18n/nextjs-404.png)

## 解决方案

在 `app/[lang]` 目录下创建 `[...not_found]/page.tsx` 文件，用于捕获所有的 404 页面。

```tsx title="app/[lang]/[...not_found]/page.tsx"  {2,5}
// 从 next/navigation 中导入我们自定义的 notFound 方法
import { notFound } from "next/navigation";

export default function NotFoundCatchAll() {
  notFound();
}
```

这样就 OK 啦~

但是还有一个问题，`notFound` 不接收任何 Props，所以我们无法在 404 页面中获取到当前语言。

如果你想对 404 页面的文案做国际化，就还需要再做处理。

很简单，不使用 Next.js 的 `notFound` 方法，自己写一个 `components/notFound.tsx` 组件。

```tsx title="components/notFound.tsx"
export default async function NotFound({ lang }) {
  const { t } = await useTranslation(lang, "not-found");
  return <div>{t("404")}</div>;
}
```

然后在 `app/[lang]/[...not_found]/page.tsx` 中使用这个组件。

```tsx title="app/[lang]/[...not_found]/page.tsx" {1, 4}
import NotFound from "@/components/common/not-found";

export default function NotFoundCatchAll({ params: { lng } }) {
  return <NotFound lng={lng} />;
}
```

中文404页面
![Next.js custom 404 page zh](https://bucket.liruifengv.com/nextjs-404-in-i18n/nextjs-404-zh.png)

英文404页面
![Next.js custom 404 page en](https://bucket.liruifengv.com/nextjs-404-in-i18n/nextjs-404-en.png)

至此大功告成，完美解决 Next.js 在国际化场景下的 404 页面问题，可以删掉 `app/[lang]/not-found.tsx` 文件了。

## 总结

Next.js 一言难尽。
