---
title: 在Vue中使用JSX
date: 2025-08-01 22:11:29
tags:
    - vue
    - jsx
categories:
    - 开发编程
---

> 最近在学习React，发现React的JSX语法非常强大，于是有一个想法：在Vue中使用JSX语法，发现确实支持，写下这篇文章记录一下。

# Vue3 (Vite)

1. 安装插件
```bash
npm install @vitejs/plugin-vue-jsx
```
2. 配置 Vite
修改 vite.config.js 或 vite.config.ts 文件：
```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), vueJsx()]
});
```
3. 示例
创建一个名为 `MyApp.jsx` 的文件，内容如下：
```jsx

import { defineComponent } from 'vue'
export default defineComponent({
    name: "Myapp",
    props: {
        msg: { type: String }
    },
    setup(props) {
        return () =>(
        <div>
            <h1>hello {props.msg}</h1>
        </div>
        )
    }
}
)
```
> 为何这样写？不使用更简单的:
> ```jsx
export default function Myapp({msg}){
    return (
        <div>
            <h1>hello {msg}</h1>
        </div>
    )
}
```
>这是因为：可以使用defineComponent来定义组件，这样可以使用vue的一些功能，比如props、setup,onMounted等。
然后在 vue 文件中引入：
```vue
<template>
    <div>
        <h1>home</h1>
        <Myapp :msg="username" />
    </div>
</template>
<script setup></script>
<script setup lang="tsx">
import { ref } from 'vue'
import Myapp from './MyApp.jsx'
let username = ref("shaw")
</script>
<style></style>
```
# Vue2 (Vue-CLI) Webpack
安装依赖
```bash
pnpm install @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props -D
```
修改`babel.config.js`文件:
```js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    '@vue/babel-preset-jsx'
  ]
}
```
创建一个jsx文件：
```jsx
// 定义一个JSX组件
const Hello = {}

Hello.props = {
  name: {
    type: String,
    default: 'World'
  }
}

// eslint-disable-next-line no-unused-vars
Hello.render = function(h) {
  return (
    <div className="hello">
      <h1>Hello, {this.name}!</h1>
      <p>This is a JSX component imported from a .jsx file</p>
    </div>
  )
}

export default Hello
```
修改App.vue
```vue
<template>
  <div id="app">

    <Hello name="Vue JSX" />
  </div>
</template>

<script>
import Hello from './components/Hello.jsx'

export default {
  name: 'App',
  components: {

    Hello
  }
}
</script>

<style>
</style>
```