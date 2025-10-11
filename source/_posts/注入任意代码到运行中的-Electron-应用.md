---
title: 注入任意代码到运行中的 Electron 应用
date: 2025-10-11 13:38:23
tags:
---


```text
本文转自 https://cn-sec.com/archives/1899908.html
```

第一次发布手滑，发现马赛克没打干净，只能重发了

Electron 这玩意儿是开发起来爽，用起来想吐。不知不觉电脑上装了一个又一个臃肿不堪的 Chromium 副本，不知给全球变暖贡献了多少碳排放量。怪不得这几年天气越来越变态。

新的 “NT 架构” QQ 也加入了 Electron 大军。

记得几年前还能见到 QQProtect 的驱动。最近主力机不用 Windows，不清楚了。换 Electron 确实可以一套代码跨平台，但这样一来别说进程保护，这破框架还自带了运行时代码注入的接口。

大概是 PC 端逐渐式微，现在没什么人做什么尾巴、盗号之类的事情，所以没必要再折腾保护了？

本来想在 Windows 下面演示。我的 Windows 开了 OneDrive 同步，直接触发了一个 bug。

![](/file/注入任意代码到运行中的Electron应用/10-1690068002.png)

还是继续 Mac。

Electron 即使是打包到生产环境，仍然带了调试器后门。

带上参数 --remote-debugging-port，然后用 Chrome 的 chrome://inspect 页面，或者直接用 websocket 和调试协议通信，就能在 electron 上下文执行任意 js。以前还出过利用 DNS rebinding 实现完全远程代码执行的例子。

开发者可以在业务初始化的代码里直接检测这个 flag，拒绝执行。同时也不能处理 app 进程已经在运行的情况。

不过 Node.js 很贴心地给了另一个动态启用调试的方式，命令行发送 SIGUSR1 信号：

```bash
kill -SIGUSR1 [pid]
```
Windows 没有对应的机制，需要在 nodejs 里用
```javascript
process._debugProcess(pid)
```
源码在这里，可以看到 Windows 下还是用的 CreateRemoteThread。

https://github.com/nodejs/node/blob/9dd574c9e232/src/node_process_methods.cc#L348

应该不会被终端安全软件放过吧……

开启了调试之后就可以在 Chrome 的里看到远程调试目标了：
![](/file/注入任意代码到运行中的Electron应用/9-1690068003.png)
![](/file/注入任意代码到运行中的Electron应用/2-1690068003.jpg)
然后就可以整活了
```javascript
require('electron').webContents.getAllWebContents()  .forEach(c => c.loadURL('javascript:alert(location)'))
```
![](/file/注入任意代码到运行中的Electron应用/1-1690068004.png)
想注入二进制模块？写一个 dll，process.dlopen 一下。

这是框架的特性，不是安全边界。毕竟都能运行任意本地代码了，能干的事情太多了。但如果你很介意进程被人乱插代码，可能在用 Electron 之前要好好考虑一番。

原文始发于微信公众号（非尝咸鱼贩）：<a href="http://mp.weixin.qq.com/s?__biz=Mzk0NDE3MTkzNQ==&mid=2247484978&idx=1&sn=66093e09d019287993832fcf0ccf4b9f&chksm=c329f8c2f45e71d4136ca80d5d2202c3b65787c3301ec5e0b2f8cb665b9d3f4e8f20635466ad&scene=126&sessionid=1690067728&key=094fe642087a4fbebe4ac351df4002d33aee61f1b95df257e6df0bd42e4f23d43e483019cf2d0c2e4f1fceecb1df646aadd7b18ee7c5a9431307849cfccc76d6b212500b6c248b444721a62f3ff0738a666a1fe2d6b165278057efd0fd4e05e8f3b04e6d48ec7256f22730ef6605df7ac11ff4ae0ef1ef7553fb1926dc6225bb&ascene=15&uin=NTY2NTA4NjQ%3D&devicetype=Windows+10+x64&version=63060012&lang=zh_CN&session_us=gh_27a9807720aa&countrycode=AL&exportkey=n_ChQIAhIQl2czSMgDtRz13KuutfjOHBLuAQIE97dBBAEAAAAAANwROfNmBGkAAAAOpnltbLcz9gKNyK89dVj0PcYrosLn3Gzgwykh6CfnIBOR3kPWtq07zx%2Fdyk9xQAjA2nUidEW4uw%2FFMykYXAY7LkZZr13uUR%2BLgAwv84rYy39yiE12uMTxL8jzcXOWAsan19tar83jIDMg2MRTwL0zSWCjoUJ2%2FWUeK13jTjebXiRWeCfPxX2sNYvJP7KESRDP3rjGdSDoIzvCqy8o1AYrqVb2o4vytO9%2BL7%2BdQV4OK%2B%2FnE5KUe2K6HuMtmhI%2FXci7WRGCn6s6%2FgeY4eM95ZSzCfupLRjRgJQ%3D&acctmode=">注入任意代码到运行中的 Electron 应用</a>