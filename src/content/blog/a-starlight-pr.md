---
title: "从一个 PR 聊聊我为什么喜欢开源"
author: liruifengv
description: "最近给 Astro 的 Starlight 项目提交了一个 PR，从这个 PR 我学到了一些东西，所以从这个 PR 出发聊聊我为什么喜欢开源。"
pubDatetime: 2023-06-12
featured: true
draft: false
tags:
  - front-end
  - 开源
---

最近给 Astro 的 Starlight 项目提交了一个 PR，从这个 PR 我学到了一些东西，所以从这个 PR 出发聊聊我为什么喜欢开源。

## 起因

首先介绍一下 [Starlight](https://github.com/withastro/starlight)，Starlight 是 [Astro](https://github.com/withastro/astro) 团队开发的一个文档生成器，类似 VuePress、VitePress 等。Starlight 是基于 Astro 框架构建的，拥有极佳的性能和极小的体积，目前还处于开发阶段。

在 Starlight 开源之初，我就想参与一下，做一些贡献，之前我也在给 Astro 的文档做中文翻译和中文 PR 的 Review。

在看到 Starlight 的 demo 之后，我看到侧边栏是没有展开收起的功能的，所以我就想给它加上这个功能。

![](https://images.sayhub.me/blog/a-starlight-pr/starlight-sidebar.png)

喏，就是这个功能。

### 第一次实现

看到这的同学可以想一想如果是你，你会怎么实现这个功能？

我的第一思路是，使用 JS 来实现，点击 sidebar 的父节点时，切换它的 class，然后通过控制子节点 CSS 的显隐来实现展开收起的效果。

代码如下：

```astro
<sidebar-sublist>
  // 新增
  <ul>
    {
      Astro.props.sublist.map(entry => (
        <li class:list={{ "sidebar-group": entry.type === "group" }}>
          {entry.type === "link" ? (
            <a href={entry.href} aria-current={entry.isCurrent && "page"}>
              {entry.label}
            </a>
          ) : (
            <>
              <div class="sidebar-group-header">
                {" "}
                // 修改
                <h2>{entry.label}</h2>
                <Icon name="down-caret" class="icon caret" /> // 新增
              </div>
              <Astro.self sublist={entry.entries} />
            </>
          )}
        </li>
      ))
    }
  </ul>
</sidebar-sublist>
```

解释一下，首先，这里使用了一个 `sidebar-sublist` 自定义组件包裹，然后在给父级的 div 上加上了一个 ` class="sidebar-group-header"` 便于后续事件控制，然后加了一个向下的箭头 Icon。

script 部分：

```js
<script>
  class SiderBarSublist extends HTMLElement {
    constructor() {
      super();

      const headers = this.querySelectorAll('.sidebar-group-header');
      headers.forEach((head) => {
        head.addEventListener('click', () => {
          const expanded = head.getAttribute('aria-expanded') !== 'true'
          head.setAttribute('aria-expanded', String(expanded));
        });
      });
    }
  }
  customElements.define('sidebar-sublist', SiderBarSublist);
</script>

```

这里定义了 `SiderBarSublist` web 组件，用于定义事件，在点击 `sidebar-group-header` 时，切换 `aria-expanded` 的值。

CSS 部分：

```css
.sidebar-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.caret {
  transition: transform 0.2s ease-in-out;
}

[aria-expanded="false"] .caret {
  transform: rotate(-90deg);
}

[aria-expanded="false"] + * {
  display: none;
}
```

通过 `[aria-expanded='false'] + * ` 后代选择器，让子节点在父节点 `aria-expanded` 为 `false` 时隐藏。然后又通过 `[aria-expanded='false'] .caret` 选择器，让箭头在父节点 `aria-expanded` 为 `false` 时旋转，从箭头向下，变成箭头向右，折叠收起的状态，同时加了一点过渡动画。

Ok，到此为止，基本实现了一个侧边栏的展开收起功能。看到这里的大佬可以想一想，这个实现有什么问题吗？

### 提交 PR 之后

我把这个功能实现之后，提交了一个 PR，然后就等待着 Review。这个项目的负责人是 Chris，他来 Review 了我的 PR，然后给了我一些反馈。

![](https://images.sayhub.me/blog/a-starlight-pr/review.png)

Chris 说，如果没有 JavaScript 难道没办法实现这个功能吗？ 他说可以把整个节点使用 `<details open></details>` 包裹，并且把标题放在 `<summary>` 标签中，这样就可以在不使用 JS 的情况下实现同样的展开收起的功能。

是的，作为一个前端，我第一反应就是使用 JS 来实现，但是这样的话，就会有一些问题，比如说，如果用户禁用了 JS，那么这个功能就不能用了，这样的话，就会影响用户体验。并且，使用 JS 会增大应用的体积，这样的话，就会影响应用的性能。我们应该尽可能的使用 HTML 和 CSS 来实现功能，而不是使用 JS。

### 第二次实现

虽然我对 `details` 和 `summary` 有点眼熟，但是我从来没用过它们，所以还是去 MDN 上查了一下，然后发现了 `open` 属性，这个属性可以让 `details` 默认展开，这样的话，就可以实现侧边栏默认展开的功能了。

修改后代码如下：

```astro
<details open>
  <summary class="sidebar-group-header">
    <h2>{entry.label}</h2>
    <Icon name="down-caret" class="icon caret" />
  </summary>
  <Astro.self sublist={entry.entries} />
</details>
```

```css
summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--sl-sidebar-item-padding-inline);
  cursor: pointer;
  user-select: none;
}

details:not([open]) .caret {
  transform: rotate(-90deg);
}

.caret {
  transition: transform 0.2s ease-in-out;
}
```

我遵从了 Chris 的建议，使用了 `details` 和 `summary` 标签，实现了同样的功能，并且惊人的发现，代码量如此之少。

### 还有一些小问题

Chris 又提到了一些小建议：

- 使用向右的箭头 Icon `right-caret`

```astro
<Icon name="right-caret" class="caret" size="1.25rem" />
```

```css
[open] .caret {
  transform: rotateZ(90deg);
}
```

这里默认使用了向右的箭头，同时简化了 CSS 代码。由之前的`transform: rotate(-90deg);` 变成了 `transform: rotateZ(90deg);`。

使用更明确的 `rotateZ`，并且从-90 度变成了 90 度，这样的话，也更加的直观。

- 有一些从右向左书写的语言，比如阿拉伯语或希伯来语，为了正确显示，应该把箭头图标翻转 180 度。

```css
:global([dir="rtl"]) .caret {
  transform: rotateZ(180deg);
}
```

dir 是用来指明文本书写方向的，`rtl` 是从右向左，`ltr` 是从左向右。所以这里使用 `:global([dir='rtl'])` 选择器，来选择从右向左书写的语言，然后把箭头图标翻转 180 度。

- Safari 中 `summary` 的兼容性。

在 Safari 中， `summary` 标签自带一个默认箭头，这里需要用 CSS 把它去除：

```css
summary::marker,
summary::-webkit-details-marker {
  display: none;
}
```

### 最终代码如下

```astro
<details open>
  <summary class="sidebar-group-header">
    <h2>{entry.label}</h2>
    <Icon name="down-caret" class="icon caret" />
  </summary>
  <Astro.self sublist={entry.entries} />
</details>
```

```css
summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--sl-sidebar-item-padding-inline);
  cursor: pointer;
  user-select: none;
}
summary::marker,
summary::-webkit-details-marker {
  display: none;
}

.caret {
  transition: transform 0.2s ease-in-out;
}
:global([dir="rtl"]) .caret {
  transform: rotateZ(180deg);
}
[open] .caret {
  transform: rotateZ(90deg);
}
```

最后，我们使用 0 行 JS 代码，实现了一个侧边栏的展开收起功能。

## 小结

总结一下这个 PR 学到的知识点：

- 在实现一个功能之前，先思考一下，这个功能有没有必要使用 JS 来实现，如果不使用 JS，有没有更好的实现方式。
- `details` 和 `summary` 标签的使用。
- 使用更简单的组合，来使得代码更加的简洁可读。
- Safari 中 `summary` 标签自带的默认箭头，以及如何去除。
- `dir` 属性的使用，以及了解了从右向左书写的语言体系。

## 总结

从这次 PR 的经历，一个很简单的功能，学到了很多知识点，所以这也是我为什么喜欢参与到开源中来。一些开源项目的维护者，不管你是小的 PR 还是大的 PR，都会认真的 review 你的代码，并且给你一些建议，我遇到的一些开源项目的维护者，都是非常友好的。所以，如果你想学习一些新的知识，或者想提升自己的编程能力，那么我强烈建议你参与到开源项目中来，这是一个非常好的学习方式。

之前我也写过一篇 《[我的开源之旅&新手如何参与开源社区](https://liruifengv.com/blog/opensource/)》，没有经验的同学，可以看一下我这篇文章，里面有一些我参与开源项目的经验分享。

总之，别怕，大胆去做吧。
