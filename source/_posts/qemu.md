---
title: qemu
date: 2025-08-17 12:12:33
tags:
---


qemu 是一个开源的虚拟机软件，它可以在一个操作系统上运行另一个操作系统。

# 安装user（网络功能）
```bash

  git clone https://gitlab.freedesktop.org/slirp/libslirp.git
  cd libslirp/
  meson build
  ninja -C build install
  sudo ninja -C build install
```
# 安装
```bash
# 更新软件包索引
sudo apt update

# 克隆qemu仓库
git clone https://github.com/qemu/qemu.git

# 进入qemu目录
cd qemu
sudo apt install meson -y
sudo apt-get install libsdl2-2.0 -y
sudo apt-get install libsdl2-dev -y
sudo apt-get install libgtk-3-dev -y
# 初始化子模块
sudo apt install build-essential -y

# 安装Python相关依赖（虚拟环境支持）
sudo apt install python3-venv -y

# 安装构建工具
sudo apt install ninja-build -y

# 安装pkg-config（依赖管理工具）和glib2.0开发库
sudo apt install pkg-config libglib2.0-dev -y

#kvm 支持
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils -y

# 安装词法/语法分析工具
sudo apt install flex bison -y

sudo ./configure --enable-sdl --enable-gtk --enable-kvm

cd build

make

sudo make install
```

# 使用
```bash
qemu-system-x86_64 -hda ubuntu.img -cdrom ubuntu.iso -boot d -m 4G
```
