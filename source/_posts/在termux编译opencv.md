---
title: 在termux编译opencv
date: 2025-08-26 06:23:23
tags:
---


```bash
pkg install build-essential cmake libjpeg-turbo libpng python
git clone https://github.com/opencv/opencv
# 进入管理员环境
termux-chroot
cd opencv
mkdir build
cd build
LDFLAGS=" -llog -lpython3" cmake -DCMAKE_BUILD_TYPE=RELEASE -DCMAKE_INSTALL_PREFIX=$PREFIX -DBUILD_opencv_python3=on -DBUILD_opencv_python2=off -DOPENCV_EXTRA_MODULES=../modules -DPYTHON3_LIBRARIES=$PREFIX/lib/libpython3.so -DWITH_QT=OFF -DWITH_GTK=OFF -DBUILD_JAVA=OFF -DBUILD_ANDROID_EXAMPLES=OFF ..
make
make install
```