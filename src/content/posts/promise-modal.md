---
title: "开发弹窗，你使用状态驱动还是命令式？"
description: "作为一名前端开发工程师，开发各种弹窗是家常便饭，但如何快捷高效、风格统一是一个问题。本文介绍状态驱动和命令式两种方式。"
pubDatetime: 2022-12-29
author: liruifengv
featured: false
draft: false
tags:
  - React
  - front-end
---

### 前言

作为一名前端开发工程师，开发各种弹窗是家常便饭，但如何快捷高效、风格统一是一个问题。

### 状态驱动

在现如今前端技术栈都是 `Vue`、 `React` 的情况下，使用状态驱动是一种常用方式。比如我们页面要引入一个弹窗，点击某个按钮弹出：

```jsx
<template>
	<div>
		<Modal1 v-show="visible" @close="closeModal" />
		<button @click="showModal" >click</button>
	</div>
</template>

<script>
import Modal1 from './modals/Modal1.vue'
export default {
	components: { Modal1 },
	data() {
		return {
			visible: false
		}
	},
	methods: {
		// 弹出弹窗
		showModal(){
			this.visible = true
		},
		// 关闭弹窗，并传回数据
		closeModal(data) {
			this.visible = false
			// 拿到 data  todo something
		}
	}
}
```

以上有一个问题，控制弹窗显隐的变量、显示弹窗的逻辑、关闭弹窗的回调逻辑分散在不同的地方。

假设这个页面有不止一个弹窗，那么这样写：

```jsx
<template>
	<div>
		<Modal1 v-show="visible1" @close="closeModal1" />
		<Modal2 v-show="visible2" @close="closeModal2" />
		<Modal3 v-show="visible3" @close="closeModal3" />
		<button @click="showModal1" >click</button>
		<button @click="showModal2" >click</button>
		<button @click="showModal3" >click</button>
	</div>
</template>

<script>
import Modal1 from './modals/Modal1.vue'
import Modal2 from './modals/Modal2.vue'
import Modal3 from './modals/Modal3.vue'

export default {
	components: { Modal1, Modal2, Modal3 },
	data() {
		return {
			visible1: false,
			visible2: false,
			visible3: false,
		}
	},
	methods: {
		// 弹出弹窗
		showModal1(){
			this.visible1 = true
		},
		// 关闭弹窗，并传回数据
		closeModal1(data) {
			this.visible1 = false
			// 拿到 data  todo something
		},
		showModal2(){
			this.visible2 = true
		},
		// 关闭弹窗，并传回数据
		closeModal2(data) {
			this.visible2 = false
			// 拿到 data  todo something
		},
		showModal3(){
			this.visible3 = true
		},
		// 关闭弹窗，并传回数据
		closeModal3(data) {
			this.visible3 = false
			// 拿到 data  todo something
		},
	}
}
```

这样写起来简直不要太啰嗦。

### 命令式开发（函数式）

我开发了 [promise-modal](https://github.com/liruifengv/promise-modal) 这个库，可以在 React 项目中 Promise 函数式的开发调用弹窗。

#### 安装

```sh
npm i promise-modal
```

#### 使用

你的 Modal 组件这样写，我们会传入 `callbackResolve`和 `callbackReject` 两个 props 到你的组件中，你需要在关闭 Modal 的时候调用它们。

```jsx
import React, { useState } from "react";
import { Modal, Button } from "antd";
import PropTypes from "prop-types";

const TestModal = props => {
  const { title, callbackResolve, callbackReject } = props;
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleOk = () => {
    setIsModalVisible(false);
    callbackResolve(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    callbackReject(false);
  };

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

TestModal.propTypes = {
  title: PropTypes.string.isRequired,
  callbackResolve: PropTypes.func.isRequired,
  callbackReject: PropTypes.func.isRequired,
};
export default TestModal;
```

把你的 Modal 组件传入 create 函数

```jsx
import { create } from "promise-modal";
import TestModal from "./TestModal";

// 如果你使用 Class 组件
export default data => create(TestModal, data);

// 如果你使用函数式组件和 hooks，你必须创建一个自定义 hooks 返回
export const useTestModal = () => {
  const showTestModal = data => create(TestModal, data);
  return showTestModal;
};
```

业务代码中使用 Modal，像 Promise 函数一样。

```jsx
import { useTestModal } from "./modals/TestModal";

const showTestModal = useTestModal();

// use Promise.then
showTestModal({
  title: "Test Modal",
})
  .then(response => {
    console.log("response: ", response);
  })
  .catch(error => {
    console.log("error: ", error);
  });

// use await
const res = await showTestModal({
  title: "Test Modal",
});
console.log("res: ", res);
// do something here
```

### 当然，命令式还是状态驱动开发，一直都有争议：

这是尤雨溪的观点，支持状态驱动：

https://www.zhihu.com/question/35820643/answer/64646527

还有一些支持命令式的网友：

https://www.zhihu.com/question/35820643/answer/2286114480

截取片段：

> 对于使用者来说，他只需要专注于他想展现的东西，展现的规则，而不需要额外的关注弹窗显隐这样的无关逻辑--调用本身就是要显示嘛。

> 改成命令式的调用，使用者就无需去引入组件，挂载组件，声明回调，打断逻辑流，可以只关注于自己的数据。

### 我的观点

- 状态驱动多个弹窗类组件时，代码过于冗余。
- 对于大型团队来说，一线业务开发人员，水平层次不去，代码风格各异，分散的状态驱动，每个人变量命名等风格都不一样，风格无法统一，导致代码杂乱，无法维护。
- Promise 函数式使得弹窗使用者无需关心显隐等逻辑，就近原则，只有业务走到这里，弹窗该出现了，才调用对应弹窗函数。
- 当然，这种方法，增加了弹窗开发人员的工作，但减轻了弹窗使用人员的心智负担。
- 这个库隐式的传入了`callbackResolve`和 `callbackReject`两个 props, 依赖来源不清晰，带来了新的心智负担。暂时没好的思路处理，欢迎 PR。

### 最后

开发弹窗时，你更愿意使用状态驱动还是命令式呢？命令式是否适合你们的团队或项目? 欢迎试用。

[GitHub 地址](https://github.com/liruifengv/promise-modal)

[npm 地址](https://www.npmjs.com/package/promise-modal)
