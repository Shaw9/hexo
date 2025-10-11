---
title: RootShellForTermux
date: 2025-08-23 17:03:17
tags:
---


在使用adb Shell时无法调用Termux工具，记录下解决方法
```bash
# 配置 Termux 命令路径
export PATH=/data/data/com.termux/files/usr/bin:/data/data/com.termux/files/usr/bin/applets:$PATH
# 配置 Termux 库路径
export LD_LIBRARY_PATH=/data/data/com.termux/files/usr/lib

#调用工具实例
python /data/data/com.termux/files/home/script/main.py
```