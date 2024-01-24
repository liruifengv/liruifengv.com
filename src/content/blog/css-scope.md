---
title: "原生 CSS scope 作用域来了，CSS 样式隔离新的希望？"
description: "原生 CSS scope 提案通过，即将发布的 Chrome 118 首先提供支持，或许 CSS 样式隔离的新时代即将到来。"
pubDatetime: 2023-08-23
author: liruifengv
featured: false
draft: false
tags:
  - CSS
  - front-end
---

## 前言

对于 CSS 样式隔离，CSS 作用域大家都不陌生，目前主流的解决方案有：

- CSS Modules
- CSS in JS
- Shadow DOM
- Vue Scoped Styles
- 等等

这些方案都有各自的优缺点，但是都不是原生的 CSS 方案，而且都需要额外的工具或者语法，对于一些小型项目来说，使用起来比较麻烦。

而原生的 CSS scope 作用域提案，提供了一种新的 CSS 语法，或许 CSS 样式隔离的新时代即将到来。

## `@scope` 的语法规则：

先放一下标准链接，大家可以自行查看：[CSS Scoping Styles: the @scope rule[1]](https://drafts.csswg.org/css-cascade-6/#scoped-styles)

基本语法如下：

```css
@scope [(<scope-start>)]? [to (<scope-end>)]? {
  <rule-list>
}
```

## 举例说明

下面我来举几个例子说明：

### 例一

在这个例子中，`.green` 的样式只会作用在 `.foo` 里面，不会影响到外面的 `.green`。
使用的语法是 `@scope (.foo)`。

HTML 结构：

```html
<div class="foo">
  <div class="green">这里是绿色</div>
</div>

<div class="green">不是绿色，因为没在 .foo 里面</div>
```

CSS：

```css
  <style>
    @scope (.foo) {
      .green { background-color: green; }
    }
  </style>
```

效果如下：
![image.png](https://bucket.liruifengv.com/css-scope/p1.png)

### 例二

这个例子中使用了完整的 `@scope (<scope-start>) to (<scope-end>)` 语法，`.green` 的样式只会作用在 `.foo` 里面，但是不会作用在 `.limit` 里面。

HTML 结构：

```html
<div class="foo">
  <div class="green">这里是绿色</div>
  <div class="limit">
    <div class="green">不是绿色，在 .foo 里面，但是在 .limit 下面</div>
  </div>
</div>

<div class="green">不是绿色，因为没在 .foo 里面</div>
```

CSS：

```css
  <style>
    @scope (.foo) to (.limit) {
      .green { background-color: green; }
    }
  </style>
```

效果如下：
![image.png](https://bucket.liruifengv.com/css-scope/p2.png)

### 例三

这个例子中，`style` 标签写在 HTML 结构中，只写了 `@scope`，省略了 `<scope-start>`，它就会自动以`style`的父元素的位置控制作用域。

HTML CSS 混合：

```html
<div>
  <style>
    @scope {
      .green {
        background-color: green;
      }
    }
  </style>
  <div class="green">绿色</div>
</div>

<div class="green">不是绿色</div>
```

效果如下：

![image.png](https://bucket.liruifengv.com/css-scope/p3.png)

## 总结

CSS scope 的基本用法就是这些了，此外还有 `@scope` 的嵌套用法，大家可以自行查看标准。此功能即将在马上上线的 Chrome 118 中发布，大家可以关注一下，也可以下载 Chrome canary 来体验一下。等一段时间各大浏览器都跟进了标准，再看一下各大框架和 CSS 预处理器和插件的适配情况，或许 CSS 样式隔离的新时代即将到来。

## 引用链接

- [1] CSS Scoping Styles: the @scope rule: https://drafts.csswg.org/css-cascade-6/#scoped-styles
