---
title: "svelte 5.0 全新响应式API"
description: "svelte发布了5.0版本，重构了响应式系统。"
pubDatetime: 2024-10-24
author: liruifengv
featured: true
draft: false
tags:
  - front-end
---

Svelte 是一个 Web 开发框架，无虚拟 dom，同时提供了许多开箱即用的功能，感兴趣的可以查看 [Svelte 文档](https://svelte.dev/)。

Svelte 前几天发布了最新的 V5.0 大版本，其中最核心的修改就是重构了它的响应式系统。Svelte 把它起名叫做 runes,
所有 runes API 都使用 `$` 开头。

今天一起来学习一下全新的 runes 响应式 API。

## `$state`

在旧版本中，直接使用 `let` 就可以定义一个响应式变量：

```svelte
<script>
  // 像普通变量一样直接用 let 定义
	let counter = 1;
	function increment() {
		counter++;
	}
</script>
<div>
	<button onclick={increment}>Increment With legacy</button>
	<p>Counter With legacy: {counter}</p>
</div>
```

在 Svelte5 中，需要使用 `$state` 来定义响应式变量：

```svelte
<script>
	let counter2 = $state(1);
	function increment2() {
	    counter2++;
	}
</script>
<div>
    <button onclick={increment2}>Increment With new</button>
    <p>Counter With new: {counter2}</p>
</div>
```

那么在 Svelte5 中，旧版写法是否还兼容呢。
是这样的，如果你不使用 runes，仍然是可以用旧版写法的。如果同时使用旧版写法和新版写法，就会失去响应式，变成一个普通变量：

```svelte
<script>
  // 这是一个普通变量，不具有响应式
	let counter = 1;
	function increment() {
		counter++;
	}
  // 和 runes 并存
	let counter2 = $state(1);
	function increment2() {
	    counter2++;
	}
</script>
<div>
	<button onclick={increment}>Increment With legacy</button>
	<p>Counter With legacy: {counter}</p>
</div>
<div>
    <button onclick={increment2}>Increment With new</button>
    <p>Counter With new: {counter2}</p>
</div>
```

## 使用外部 `*.svelte.js` 中的 runes

在 Svelte5 中，由于有了 runes，你可以在组件中导入外部 `*.svelte.js` 或者 `*.svelte.ts` 中的 runes 来使用，这在 Svelte4 中无法做到。

```js title="runes-in-js.svelte.js"
export const rune = $state({
	count2: 1
});

export function increment2() {
	rune.count2++;
}
```

在 svelte 组件中直接导入就可以了：

```svelte
<script>
	import { rune, increment2 } from './runes-in-js.svelte.js';
</script>
<div>
	<button onclick={increment2}>Increment the rune inside js</button>
	<p>Counter2: {rune.count2}</p>
</div>
```

## `$derived`

`$derived` 类似于 Vue 中的计算属性：

```svelte
<script>
	let counter = $state(1);
	function increment() {
		counter++;
	}

  // 自动计算 counter * 2 的结果
  let counterTimesTwo = $derived(counter * 2);
</script>
<div>
	<button onclick={increment}>Increment the new way</button>
	<p>Counter: {counter}</p>
	<p>Counter Times Two: {counterTimesTwo}</p>
</div>
```

## `$state` 的其他用法

当然可以用来创建一个对象：

```svelte
<script>
// 基本类型
let count = $state(1)
// 可以创建对象
let user = $state({ name: 'John', age: 30 });
</script>
```

`$state.raw` 用于创建一个浅层（shallow）响应式对象。
这意味着，这个对象是响应式的，但是它的属性不是，你只可以重新设置整个对象来触发响应式。

```svelte
<script>
let shallowState = $state.raw(['Alice', 'Bob', 'Charlie']);

// 这将不会变化。
shallowState.push('Dave');

// It works!
shallowState = [...shallowState, 'Dave'];
</script>
```

`$state.snapshot` 用于获取一个响应式对象的原始类型（非响应式）。

```svelte
<script>
const originalObject = { name: 'John', age: 30 };
const reactiveState = $state(originalObject);
let snapshot = $state.snapshot(reactiveState);
</script>
```

## `$effect`

`$effect` 类似于 React 的 `useEffect`，区别是会自动收集响应式依赖。

```svelte
<script>
	$effect(() => {
		console.log('effect: counterTimesTwo is now', counterTimesTwo);
		return () => {
			console.log('Component unmounted');
		};
	});
</script>
```

`$effect.pre` 用于在 DOM 更新之前运行代码：

```svelte
<script>
	$effect.pre(() => {
		console.log('effect.pre: counterTimesTwo is now', counterTimesTwo);
	});
</script>
```

`$effect.root` 将会创建一个 effect root，它不会在组件卸载时自动释放，你可以手动调用 `cleanup()` 来释放

```svelte
<script>
	const cleanup = $effect.root(() => {
		console.log('effect.root: counterTimesTwo is now', counterTimesTwo);
		$effect(() => {
			console.log('effect.root: counterTimesTwo is now', counterTimesTwo);

			return () => {
				console.log('effect.root - $effect: effect unmounted');
			};
		});

		return () => {
			console.log('effect.root: Component unmounted');
		};
	});
</script>

<button onclick={() => cleanup()}>Dispose effect.root</button>
```

## `$props`

在 Svelte4 中，使用 `export let value` 来定义组件 props。

在 Svelte5 中，使用 `$props` 来定义组件 props。

子组件：

```svelte
<script>
	let { count } = $props();
</script>

<button onclick={() => (count += 1)}>
	clicks (child): {count}
</button>
```

父组件：

```svelte
<script>
	import Child from './Child.svelte';

	let count = $state(0);
</script>

<button onclick={() => (count += 1)}>
	clicks (parent): {count}
</button>

<Child {count} />
```

父组件点击增加 count，会传给子组件，而子组件点击增加，不会反映给父组件，此时是一个单向的数据流。

## 使用 `$bindable` 实现双向绑定

上面说了，默认 props 是单向数据流，子组件无法修改父组件的数据，这也是合理的。

那么我们常见的一些表单实现效果如下，实现一个受控 Input 组件。

子组件定义 onChange props, 把更改后的值通过 onChange 传回去：

```svelte title="Input.svelte"
<script lang="ts">
  interface Props {
		value: string;
    onChange: (value: string) => void;
	}
	let { value, onChange }: Props = $props();
</script>

<input type="text" {value} onchange={(event) => {
  onChange((event.target as HTMLInputElement).value);
}}/>
```
父组件传 onChange，接受子组件回传的值：

```svelte
<script>
	import Input from './Input.svelte';

	let value = $state('123');
</script>

<Input {value} onChange={(e) => {
  console.log('child changed to', e);
  value = e;
}}/>

```

熟悉 React 同学看的就很眼熟，我们经常这么写。

而在 Vue 中，有 `v-model` 可以实现双向绑定。
在 Svelte5 中，可以使用 `$bindable` 实现双向绑定：

```svelte title="Input.svelte"
<script>
	let { value = $bindable(''), ...rest } = $props();
</script>

<input type="text" bind:value />

```

父组件中的 value 也被修改了：

```svelte
<script>
	import Input from './Input.svelte';
	let value = $state('');
  // `$inspect` 也是一个 runes，用于调试打印。类似 `$effect(() => console.log(value))`
	$inspect(value);
</script>
<Input bind:value />
```

## `$host`

`$host` 是一个高级特性，当组件被编译为自定义元素时，用来获取当前组件的引用，发送自定义事件。

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('decrement')}>decrement</button>
<button onclick={() => dispatch('increment')}>increment</button>
```

## 最后

Svelte5 的 runes `$state`，Vue3 的组合式 API `ref`，Solid 的 signal `createSignal`，Angular Signals `signal`，似乎除了 React 都拥抱了 `signal`，你觉得这套东西怎么样呢。

