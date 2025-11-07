---
title: Vue3使用Rust编译的wasm，性能提升600%
date: 2025-11-07 18:58:38
tags:
---

环境需要安装Rust
1. 安装wasm-pack
```bash
cargo install wasm-pack
```
cargo new -t lib wasm-lib

编辑wasm-lib/src/lib.rs
```rust
#[wasm_bindgen]
pub fn add(a: u64, b: u64) -> u64 {
    a + b
}
```
然后使用wasm-pack编译
```powershell
wasm-pack build --target web
```
将生成的包引入Vue项目
```powershell
Copy-Item -Path wasm-lib/pkg/* -Destination Vue项目目录/wasmLib -Recurse -Force
```
安装包
1.进入Vue项目目录
2.修改`package.json`
```json
{
  "name": "Vue项目目录",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": "^20.19.0 || >=22.12.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.22",
    "my-rust-wasm": "./wasmLib"

  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.1",
    "vite": "^7.1.7",
    "vite-plugin-vue-devtools": "^8.0.2"
  }
}
```
```powershell
npm install 
```

即可在Vue项目中使用Rust编译的wasm
Vue项目中使用
```vue
<template>
  <div>
    <h1>Add: {{ add(1, 2) }}</h1>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import init, { add } from "my-rust-wasm"

onMounted(async () => {
  await init()
  console.log(add(BigInt(1), BigInt(2)))  //至于为什么要使用BigInt，是因为Rust的wasm只支持u64类型，而Vue的模板中只能使用Number类型，所以需要使用BigInt来表示更大的数字。
})
</script>
```
性能提升600%来源于!["Vue3使用Rust编译的wasm，性能提升600%"](https://blog.csdn.net/jethroHEX/article/details/136394323)