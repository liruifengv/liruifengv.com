---
title: "谈谈标签语义化"
description: "最近在做百度前端技术学院的基础题，HTML和CSS部分，我发现一个问题，我还是习惯于嵌套一堆div，然而HTML5已经定义了很多新的具有明确语义化的标签，大家也都在倡导使用语义化标签，所以想写一写关于HTML标签语义化的东西。"
pubDatetime: 2017-02-27
author: liruifengv
featured: false
draft: false
tags:
  - front-end
---

### 前言

最近在做百度前端技术学院的基础题，HTML 和 CSS 部分，我发现一个问题，我还是习惯于嵌套一堆 div，然而 HTML5 已经定义了很多新的具有明确语义化的标签，大家也都在倡导使用语义化标签，所以想写一写关于 HTML 标签语义化的东西。

### 什么是标签语义化

这是标签语义化的定义：

> 首先是关于语义（Semantics）和默认样式的区别，默认样式是浏览器设定的一些常用 tag 的表现形式，语义化的主要目的就是让大家直观的认识标签(markup)和属性(attribute)的用途和作用，很明显 Hx 系列看起来很像标题，因为拥有粗体和较大的字号。`<strong>`,`<em>`用来区别于其他文字，起到了强调的作用。至于列表和表格很明显的告诉你他们是做什么的。

简单来说就是我们要让我们使用的每个标签都拥有具体的意义，我们一眼看去就知道这个标签是什么意思，比如`<header>`标签，它的意思是头部；`<nav>`标签，全拼是 Navigation，导航的意思； `<li>` 标签，list, 列表的意思。HTML5 就是要让我们去用这些标签，而不是一味的用`<div>`，用 CSS 来修饰。

这是我常写的 header 部分：

```html
<div class="public-header">
  <div class="header-logo"></div>
  <ul class="header-nav">
    <li>
      <a href="#">导航链接四</a>
    </li>
    <li>
      <a href="#">导航链接三</a>
    </li>
    <li>
      <a href="#">导航链接二</a>
    </li>
    <li>
      <a href="#">导航链接一</a>
    </li>
  </ul>
</div>
```

这是非常不符合语义化的，我应该用 HTML5 的新标签`<header>`。

### 为什么要标签语义化

- 当只有 HTML 页面时，没有 CSS，我们仍然可以很清晰的看懂页面的 DOM 结构
- 团队维护，当团队来 review 代码或者重构时，增强代码的可读性，更利于维护
- 有利于 SEO，搜索引擎爬虫依赖于标签来确定上下文和各个关键字的权重
- 提高用户体验，比如 title 和 alt 等用来解释内容信息

### 一些常用的具有语义化的标签

`<header>`头部标签，用来写网页最上方的公共头部，也就是页眉。

```html
<header>
  <h1>文章一级标题</h1>
  <h2>文章二级标题</h2>
</header>
```

`<nav>`标签，用来写导航，一般写在`<header>`标签里面，内部用`<ul>`无序列表。

```html
<nav>
  <ul>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</nav>
```

`<article>`标签，当我们要写网页文章的主要内容时，要用到这个标签。

```html
<article>
  <h2>文章标题</h2>
  <p>文章内容</p>
</article>
```

`<address>`标签，定义文档作者或拥有者的联系信息。

如果 `<address>` 元素位于 `<article> `元素内部，则它表示该文章作者或拥有者的联系信息。

通常的做法是将 `address` 元素添加到网页的头部或底部。

```html
<address>
  本文作者<br />
  联系方式<a href="#">Email</a>
</address>
```

`<footer>`标签，整个网页的页脚部分，一般来写文章版权信息等。

```html
<footer>
  <p>版权所属@***</p>
  <p></p>
  <footer></footer>
</footer>
```

### 所以我们以后怎么写

- 尽量减少无意义的 div，换用具体意义的标签；
- 每个 input 标签对应的说明文本都需要使用 label 标签，并且通过为- input 设置 id 属性，label 标签使用 for 属性关联 input 标签；
- 尽量使用 strong 和 em 标签，不要使用 b 和 i；
- 有待补充

**总之，当我们写 HTML 页面时，首先应该想到的是怎么简化 DOM 结构，使页面更简单，更可读。**

**标签语义化是一种艺术。**
