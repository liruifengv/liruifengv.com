---
title: "JS学习笔记之数据类型"
description: "2017 年是我开始学习前端的一年，2018 年我将继续在前端的路上前行。这篇文章会是我的JS 学习笔记的开篇，以后还会有相应的其他内容。这里主要简单写一下 JavaScript 的 几种数据类型。"
pubDatetime: 2018-01-02
author: liruifengv
featured: false
draft: false
postSlug: js-data-type
tags:
  - front-end
  - JavaScript
---

### Table of contents

### 前言

2017 年是我开始学习前端的一年，2018 年我将继续在前端的路上前行。这篇文章会是我的 JS 学习笔记的开篇，以后还会有相应的其他内容。

这里主要简单写一下 JavaScript 的 几种数据类型。

### 基本数据类型

- undefined --当前至未定义
- null -- 空值
- boolean -- 布尔值 true 或 false
- number -- 数字
- string -- 字符串
- symbol -- 符号 （ES6）

### 引用数据类型

- Object -- 对象
- Array -- 数组
- Date -- 日期
- RegExp -- 正则表达式
- Function -- 函数

### 基本包装类型 （基本包装类型是特殊的引用类型，可以使用构造函数来创建，与引用类型类似，但也具有基本类型的特点）

- Boolean
- Number
- String

### 单体内置对象

- Global -- 全局对象
- Math -- 数学对象

### 基本数据类型和引用数据类型的区别：

- 基本数据类型是简单的数据段
- 引用数据类型是由多个值构成的对象，实际上所有引用类型都是 Object 的实例
- 基本数据类型存储在栈中
- 引用数据类型存储在堆中
- 基本数据类型是可以直接访问的
- 而当访问引用数据类型时，需要先找到对象在内存中的地址，再按照地址去获取对象中的值，叫做引用访问
- 基本数据类型是可以直接复制的。
- 而引用数据类型则是把原对象的内存地址指向新变量
- 引用数据类型进行参数传递时，同样是传递的内存地址

数据类型是任何一种编程语言的根本，搞清楚这几种数据类型，会在无形中对我们的编程能力进行提升。

> Application that can be written in JavaScript, will eventually be written in JavaScript.
