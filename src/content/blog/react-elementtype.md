---
title: "React PropTypes 中的 elementType"
description: "在用 React 进行开发的过程中，要用到 PropTypes 对组件的 props 进行类型检查。其中有两个类型，element 和 elementType，让我百思不得其解。这两个的区别到底是什么，在跟小伙伴探讨和实践之后，产生了这篇文章。"
pubDatetime: 2021-12-10
author: liruifengv
featured: false
draft: false
postSlug: react-elementtype
tags:
  - React
---

## 前言

在用 React 进行开发的过程中，要用到 PropTypes 对组件的 props 进行类型检查。其中有两个类型，element 和 elementType，让我百思不得其解。这两个的区别到底是什么，在跟小伙伴探讨和实践之后，产生了这篇文章。

![](https://bucket.liruifengv.com/react-elementtype/img1.webp)

从官方文档来看，element 比较好理解，就是 React 元素，即组件。比如 `<Foo /> `。

elementType 给出的解释是 React 元素类型，即 Foo 。

但是这个「类型」还是让我很不理解。

我第一次是这么使用的：[codesandbox](https://codesandbox.io/s/stupefied-bas-uxi76)

在这种用法中，我把 elementType 当成了个方法来调用，结果成功渲染了。此时我以为 elementType 就是个 function，但既然如此，我为什么不用 func 类型呢？

后来和小伙伴探讨，从 [isValidElementType](https://github.com/facebook/react/blob/ca106a02d1648f4f0048b07c6b88f69aac175d3c/packages/shared/isValidElementType.js#L34) 这个方法发现，elementType 其实是个类型集合。

![](https://bucket.liruifengv.com/react-elementtype/img2.webp)

从这里可以看出，他支持多种类型，有 string、function、Fragment 等等。

#### 于是有了这段代码：

https://codesandbox.io/s/xenodochial-mountain-e4cfr?file=/src/App.js

我分别传了 string、function、Fragment、Suspense。

再回过头看官方文档

![](https://bucket.liruifengv.com/react-elementtype/img3.webp)

原来真的是放在标签 </> 里的类型。element 是<Foo/> 或者<Fragment/>，elementType 是 Foo 或者 Fragment，elementType 的目标是生成 element。

到这时候我彻底明白了，原来 elementType 的用途是用来做动态标签的。

#### 再看我第一次的写法

![](https://bucket.liruifengv.com/react-elementtype/img4.jpeg)

把 element 当作一个方法来调用，虽然也没报错并且成功渲染了，那是因为函数式组件的原因。但是实际使用方式是错误的，这也解了我之前的疑惑，为什么不用 func。原来根本不是一个用途。

### 总结

elementType 是一个类型集合，主要用途是用来做动态标签使用，最终生成 element。但由于官方文档一笔略过，而 google 的搜索资料又基本没有，可能很少人有动态标签的需求，所以也用不到吧。遇到搞不懂的东西还是得多动手，才能把问题搞清楚。
