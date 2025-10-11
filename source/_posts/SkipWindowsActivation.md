---
title: 跳过Windows OOBE联网
date: 2025-07-28 20:51:14
tags: 操作系统
categories:
    - 实用小技巧
---
在OOBE中按下`Shift + F10`进入命令行，执行以下命令：

```cmd
start ms-cxh:localonly
```
然后输入用户名，密码可选
> 密码如果不输入，那么会跳过欢迎界面