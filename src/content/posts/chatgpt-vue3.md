---
title: "我用 ChatGPT 读 Vue3 源码"
description: "ChatGPT 最近十分火爆，今天我也来让 ChatGPT 帮我阅读一下 Vue3 的源代码。看看Vue3 的 setup函数是怎么回事。"
pubDatetime: 2023-02-23
author: liruifengv
featured: false
draft: false
tags:
  - Vue
  - ChatGPT
  - AI
---

## 前言

ChatGPT 最近十分火爆，今天我也来让 ChatGPT 帮我阅读一下 Vue3 的源代码。

都知道 Vue3 组件有一个 `setup`函数。那么它内部做了什么呢，今天跟随 ChatGPT 来一探究竟。

## 实战

### setup

`setup` 函数在什么位置呢，我们不知道他的实现函数名称，于是问一下 ChatGPT：

![image.png](https://bucket.liruifengv.com/chatgpt-vue3/p1.webp)

ChatGPT 告诉我，`setup` 函数在`packages/runtime-core/src/component.ts` 文件中。众所周知，`runtime-core`是 Vue3 的运行时核心代码。我们进去看一眼。

按照它所说的，我们找到了 `setupComponent` 和 `createComponentInstance` 函数，并没有找到 `setupRenderEffect` 函数，ChatGPT 的只知道 2021 年以前的知识，Vue3 代码经过了很多变动，不过没关系，这不影响太多。

ChatGPT 告诉我，`setupComponent` 函数是在`createComponentInstance`函数中执行的，`createComponentInstance`看名字是创建组件实例，看一下详细代码。

直接复制给 ChatGPT：

![image.png](https://bucket.liruifengv.com/chatgpt-vue3/p2.webp)

我们根据 ChatGPT 的解释来阅读代码，发现`createComponentInstance`只是创建了组件的实例并返回。并没有像它上面说的在函数中执行了 `setupComponent`，笨笨的 ChatGPT。

那就自己找一下`setupComponent`是在哪里被调用的。

可以`packages/runtime-core/`搜一下函数名，很快就找到了。在`packages/runtime-core/src/renderer.ts`文件中的`mountComponent`函数中。

> `mountComponent` 是挂载组件的方法，前面还有一堆自定义渲染器的逻辑，不在此篇展开。

```ts
const mountComponent: MountComponentFn = (...args) => {
  const instance: ComponentInternalInstance =
    compatMountInstance ||
    (initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    ));
  // ... 省略代码
  // resolve props and slots for setup context
  if (!(__COMPAT__ && compatMountInstance)) {
    // ...这里调用了setupComponent，传入了实例，还写了注释，感人
    setupComponent(instance);
  }
  // setupRenderEffect 居然也在这
  setupRenderEffect(
    instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
  );
};
```

`mountComponent`函数先调用了`createComponentInstance`， 返回个组件实例，又把实例当作参数传给了 `setupComponent`。顺便我们还在这发现了 ChatGPT 搞丢的`setupRenderEffect`函数，它是用来处理一些渲染副作用的。

回到 `setupComponent`函数，Evan 的注释告诉我们它是处理 props 和 slots 的。

```ts
export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  isInSSRComponentSetup = isSSR;

  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);

  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined;
  isInSSRComponentSetup = false;
  return setupResult;
}
```

把代码喂给 ChatGPT：

![image.png](https://bucket.liruifengv.com/chatgpt-vue3/p3.webp)

`setupComponent` 函数中，处理完 props 和 slots 后，根据是否是有状态组件调用了`setupStatefulComponent`。

直接整个 `setupStatefulComponent`喂给 ChatGPT：

![image.png](https://bucket.liruifengv.com/chatgpt-vue3/p4.webp)

太长了，大概意思：

- 创建了代理缓存 accessCache，干嘛用的咱也不知道，可以问 ChatGPT
- 创建公共实例代理对象（proxy）
- 执行组件的 setup()

后续操作是调用 `handleSetupResult` 和 `finishComponentSetup` 返回渲染函数。开始走渲染逻辑了。

### 小结

小结一下`setup`的始末：

- 从组件挂载开始调用`createComponentInstance`创建组件实例
- 传递组件实例给`setupComponent`
- `setupComponent`内部初始化 props 和 slots
- `setupStatefulComponent` 执行组件的`setup`
- 完成 setup 流程
- 返回渲染函数
- ...

## 总结

ChatGPT 很强大，也很笨，毕竟它不联网，且只有 2021 年以前的数据。可用来帮助我们读一下晦涩的源码还是可以的，但也只能辅助作用，还需要自己的思考。

> PS: vue 源码太多了，喂不动了，有兴趣的自己试一下。
