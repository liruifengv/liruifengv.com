---
title: "双飞翼布局与圣杯布局"
description: "三列布局是一种比较基础的布局，分别是左列 left，主要用作导航，在整个布局的左边，宽度固定；主列 main 居中，用来显示整个网页的主要内容，宽度自适应；右列 right，平时主要用来显示广告等内容，在整个布局的右边，宽度固定。本文介绍几种常用的三列布局方法。"
pubDatetime: 2017-02-21
author: liruifengv
featured: false
draft: false
tags:
  - HTML
  - CSS
---

三列布局是一种比较基础的布局，分别是左列 left，主要用作导航，在整个布局的左边，宽度固定；主列 main 居中，用来显示整个网页的主要内容，宽度自适应；右列 right，平时主要用来显示广告等内容，在整个布局的右边，宽度固定。

那么我们怎么实现这种三列布局呢，先说一下我们平常的方法。

让左列 left 右列 right 分别左右浮动，然后给主列设置左右外边距 `margin-left` 和 `margin-right`，即可实现主列自适应。

代码如下：

**DOM**:

```html
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
  <div class="main"></div>
</div>
```

**CSS**:

```css
.left {
  float: left;
  height: 200px;
  width: 100px;
  background-color: #bd4147;
}
.right {
  float: right;
  height: 200px;
  width: 200px;
  background-color: #419641;
}
.main {
  margin-left: 120px;
  margin-right: 220px;
  height: 200px;
  background-color: #01549b;
}
```

但是这种方法有一个缺点，就是左列 left 和右列 right 必须在主列 main 的前面，顺序不能改变，这就导致主列所显示的主页面无法率先加载，影响用户体验。

### 圣杯布局

**DOM**:

```html
<div class="container">
  <div class="main"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

圣杯布局的思路是把左列 left 右列 right 主列 main 分别浮动，然后用负外边距给左右两列进行定位；

**CSS 如下**:

```css
.main {
  float: left;
  width: 100%;
  height: 200px;
  background-color: #01549b;
}
.left {
  float: left;
  height: 200px;
  width: 100px;
  margin-left: -100%;
  background-color: #bd4147;
}
.right {
  float: left;
  height: 200px;
  width: 200px;
  margin-left: -200px;
  background-color: #419641;
}
```

左右两列定位了，main 还没有定位，所以会出现左右列覆盖主列 main 的情况，这时我们给容器 container 添加左右内边距 `padding-left` 和`padding-right`，成功定位主列 main

```css
.container {
  padding-left: 120px;
  padding-right: 220px;
}
```

但这时候左右两列会受容器左右内边距的影响，所以给他们添加相对定位；

```css
.left {
  position: relative;
  left: -120px;
}
.right {
  position: relative;
  right: -220px;
}
```

**最终代码如下**：

**DOM**:

```html
<div class="container">
  <div class="main"></div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

**CSS**:

```css
.container {
  padding-left: 120px;
  padding-right: 220px;
}
.main {
  float: left;
  width: 100%;
  height: 200px;
  background-color: #01549b;
}
.left {
  position: relative;
  left: -120px;
  float: left;
  height: 200px;
  width: 100px;
  margin-left: -100%;
  background-color: #bd4147;
}
.right {
  position: relative;
  right: -220px;
  float: left;
  height: 200px;
  width: 200px;
  margin-left: -200px;
  background-color: #419641;
}
```

圣杯布局的优点：

- 主列率先加载
- 允许任何列是最高的
- DOM 结构简单

缺点：

- 和双飞翼布局相比 CSS 样式较为复杂

### 双飞翼布局

双飞翼布局源自淘宝 UED，第一步和圣杯布局一样，浮动三列，给左右两列设置负外边距；同样会覆盖主列 main，双飞翼布局的做法是在主列 main 后面添加了一个宽度为 100%的 div，再设置主列 main 的左右边距，代码如下：

**DOM**:

```html
<div class="wrap">
  <div class="main"></div>
</div>
<div class="left"></div>
<div class="right"></div>
```

**CSS**:

```css
.wrap {
  float: left;
  width: 100%;
}
.main {
  height: 200px;
  margin-left: 110px;
  margin-right: 210px;
  background-color: #01549b;
}
.left {
  float: left;
  height: 200px;
  width: 100px;
  margin-left: -100%;
  background-color: #bd4147;
}
.right {
  float: left;
  height: 200px;
  width: 200px;
  margin-left: -200px;
  background-color: #419641;
}
```

优点：

- 率先加载主列 main
- 允许任何列是最高的
- CSS 样式简单

缺点：

- 和圣杯布局相比 DOM 结构较为复杂

实现三列布局还有很多种方法，比如用时下比较流行的 Flex，等等。

这里只讨论双飞翼和圣杯布局，请大家指正。
