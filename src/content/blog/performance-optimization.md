---
title: "浅谈前端性能优化"
description: "聊一聊什么前端性能优化以及怎么做性能优化。"
pubDatetime: 2017-05-08
author: liruifengv
featured: false
draft: false
postSlug: performance-optimization
tags:
  - front-end
---

### 一、什么是前端性能优化？

从用户访问一个 url 到整个页面渲染到用户面前的整个过程，程序员通过技术手段和优化策略，缩短每个步骤的处理时间从而提升整个页面的加载速度。

### 二、为什么要前端性能优化？

作为一个前端工程师，我们是最接近用户的。我们在写代码的过程中，每一个细节都会影响网页的响应速度，严重影响网站的性能。为了提升用户体验，我们需要从各个方面提升网站响应速度，所以要进行前端性能优化。

### 三、前端性能优化的方法

#### 1.网页内容方面

- 减少 HTTP 请求次数
- 减少 DNS 查询次数
- 缓存 Ajax
- 减少 Dom
- 延迟加载
- 避免 404
- 避免重定向
- 根据域名划分内容

#### 2.服务器方面

- 使用 CDN
- 使用 GET Ajax 请求
- 避免空的图片 src

#### 3.JavaScript 脚本

- 将 JavaScript 放在文件底部
- 使用外部 JavaScript 和 CSS 文件
- 压缩 JavaScript 和 CSS 文件
- 减少 Dom 节点的操作
- 使用事件委托

#### 4.CSS

- 将 CSS 样式表置顶
- 避免 CSS 表达式
- 用 `<link>` 代替 import
- 避免使用 Filters

#### 5.图片

- 优化图像
- 图片延迟加载
- 使用 CSS Sprite

#### 6.Cookie

- 减少 Cookie 大小

最后，还有很多很多性能优化的方法，有待以后补充。
