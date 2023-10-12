---
title: "JS复制文字到剪贴板的坑及完整方案。"
description: "在做 JS 复制到剪贴板功能的时候，遇到了不少坑，这边文章展开记录一下。"
pubDatetime: 2023-01-10
author: liruifengv
featured: false
draft: false
postSlug: copy-text
tags:
  - front-end
  - JavaScript
  - HTML
  - WebView
---

## Table of contents

## 前言

相信很多人做需求过程中，都遇到过把文字复制到剪贴板的功能。很不幸我也遇到了，本以为是一个简简单单的需求，开发测试过程中却遇到了不少坑，这里一一展开。

### `execCommand` 方法

第一次，我使用了选中文字 `execCommand` 这个方法来实现，代码如下：

```js
const copyText = val => {
  const textArea = document.createElement("textArea");
  textArea.value = val;
  document.body.appendChild(textArea);

  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};
```

创建了一个`textArea` DOM 元素，插入到 `body` 中，再选中 `textArea` 的内容，执行 `document.execCommand('copy')`,最后在移除 `textArea`。

写完一跑，没问题，完美，就提测了。谁承想，提测之后，测试提出来一个 bug。

**在手机 Safari 浏览器中，点击复制按钮，整个页面会跳动一下。**

**这是什么神奇 bug?**

经排查（two thousand years later），创建的`textArea`不在页面可视区域之内，然后执行`textArea.select()`，就会触发浏览器的控件跳转行为，页面会滚动到 `textArea` 所在位置。然后执行完又快速移除了，就会形成闪动的这么一个现状。

知道问题了，那就很好解决了，给元素增加绝对定位。

于是我修改代码如下：

```js
const textArea = document.createElement("textArea");
textArea.value = val;
textArea.style.width = 0;
textArea.style.position = "fixed";
textArea.style.left = "-999px";
textArea.style.top = "10px";
textArea.setAttribute("readonly", "readonly");
document.body.appendChild(textArea);

textArea.select();
document.execCommand("copy");
document.body.removeChild(textArea);
```

增加了一个 fixed 定位，left 是-999px，top 是 10 px，保存代码运行测试，ok 完美。

这时候我有查了下`execCommand`的 MDN，https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand

![](https://images.sayhub.me/blog/copy-text/exexcommand.png)

该特性已经被弃用，之所以还能用，是因为有些浏览器还没删除实现。可能不知道哪天就删了，也可能永远不删。

这不太行啊

### navigator.clipboard

于是，我用上了 `navigator.clipboard`，可能兼容性还不太好，所以代码这么写：

```js
if (navigator.clipboard) {
  await navigator.clipboard.writeText(val);
}
```

测试一下，完美，于是完整代码变成了这样：

```js
const copyText = async val => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(val);
  } else {
    const textArea = document.createElement("textArea");
    textArea.value = val;
    textArea.style.width = 0;
    textArea.style.position = "fixed";
    textArea.style.left = "-999px";
    textArea.style.top = "10px";
    textArea.setAttribute("readonly", "readonly");
    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};
```

优先使用 `navigator.clipboard`，如果不存在再降级使用 `execCommand`。

又兴高采烈的提测了。

### bug 它又来了。

“你来啦，土星，不是，是 bug”

在安卓 APP 的 WebView 中，点击复制按钮没有反应。

我特发？

继续排查（又 two thousand years later）。

![](https://images.sayhub.me/blog/copy-text/error)

点击复制的时候，报错`Write permission denied`。

查看 MDN：https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/clipboard

![](https://images.sayhub.me/blog/copy-text/clipboard.png)

> 只有在用户事先授予网站或应用对剪切板的访问许可之后，才能使用异步剪切板读写方法。许可操作必须通过取得权限 Permissions API 的 "clipboard-read" 和/或 "clipboard-write" 项获得。

Navigator 这种新 API 都是需要事先授予权限的，而权限是通过 `Permissions API` 获取的。

[Permissions API MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Permissions_API)

![Permissions API 兼容性](https://images.sayhub.me/blog/copy-text/permission.png)

看这里，原来 `Permissions API` 在安卓的 WebView 中是没实现的。

[CGQAQ](https://github.com/CGQAQ) 同学帮我找了一下 [android_webview](https://chromium.googlesource.com/chromium/src/+/refs/heads/master/android_webview/browser/aw_permission_manager.cc#:~:text=case%20PermissionType::CLIPBOARD_READ_WRITE) 的源码

![](https://images.sayhub.me/blog/copy-text/webview)

果不其然，这里并没实现，直接返回了`PermissionStatus::DENIED` 状态。

那么我们再在代码里加一个`Permissions API`的判断。

```js
if (navigator.clipboard && navigator.permissions) {
  await navigator.clipboard.writeText(val);
}
```

完整代码如下：

```js
const copyText = async val => {
  if (navigator.clipboard && navigator.permissions) {
    await navigator.clipboard.writeText(val);
  } else {
    const textArea = document.createElement("textArea");
    textArea.value = val;
    textArea.style.width = 0;
    textArea.style.position = "fixed";
    textArea.style.left = "-999px";
    textArea.style.top = "10px";
    textArea.setAttribute("readonly", "readonly");
    document.body.appendChild(textArea);

    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};
```

### 调用 APP 方法

还有一种解决方案，就是由安卓端实现一个供 JS 调用的复制到剪贴板方法，JS 判断是否在 APP 内，进行调用。

此方案需要多端协调，考虑情况暂未采用，其他人遇到此问题的可以酌情使用。

### 最后

又提测了，希望不会出现新的 bug。

### 后记 2023-1-12

果不其然遇到了新问题，在华为手机自带浏览器上，`navigator.clipboard` 和 `navigator.permissions` 都存在，但是抛了个异常：`DOMExecption: PAESE_ERROR`。

navigator.clipboard 的兼容性有大问题！

最后我删掉了 `navigator.clipboard`，老老实实用 execCommand。

### 参考文献：

- [JS 复制文字到剪切板的极简实现及扩展-张鑫旭](https://www.zhangxinxu.com/wordpress/2021/10/js-copy-paste-clipboard/)

- [Clipboard API call throws NotAllowedError without invoking onPermissionRequest()](https://stackoverflow.com/questions/61243646/clipboard-api-call-throws-notallowederror-without-invoking-onpermissionrequest/61546346#61546346)

- [execCommand MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)

- [clipboard MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/clipboard)

- [Permissions API MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Permissions_API)

- [android_webview 源码实现](https://chromium.googlesource.com/chromium/src/+/refs/heads/master/android_webview/browser/aw_permission_manager.cc#:~:text=case%20PermissionType::CLIPBOARD_READ_WRITE)
