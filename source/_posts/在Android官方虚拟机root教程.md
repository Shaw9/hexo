---
title: Android Studio自带的安卓虚拟机/模拟器如何Root | rootAVD
date: 2025-10-20 23:44:54
tags:
    - Android
    - 虚拟机
    - 模拟器
    - Root
    - rootAVD
---
有时候遇到一些特殊的需求，在调试安卓时需要用到root，对于Android Studio自带虚拟机/模拟器如何root，网上资料较少且过于简略，所幸的是找到一篇B站专栏（https://link.zhihu.com/?target=https%3A//www.bilibili.com/opus/828968828902834199）成功解决了这个问题，在此感谢，且本文以更详细的步骤来实现

# 准备
1. 在Android Studio中检查确保Android SDK已安装(实测Android 16可用)

![检查Android SDK安装状态](/file/在Android官方虚拟机root教程/v2-40360570757ba5243dc6ad8c72857541_1440w.jpg)

2. 添加ANDROID_HOME环境变量，值为SDK的安装位置
![设置ANDROID_HOME环境变量](/file/在Android官方虚拟机root教程/v2-74db306cd07352f92463127adfd20c41_1440w.jpg)

3. 拉取GitLab项目到本地：newbit / rootAVD · GitLab (https://gitlab.com/newbit/rootAVD)

![拉取rootAVD项目](/file/在Android官方虚拟机root教程/v2-c43807f8caec83d97865d65fdd383190_1440w.jpg)

# 开始

创建并启动虚拟机，需要记住镜像名称，镜像需要选择Google APls系列，不要选择Google Play的因为没有root权限
![创建并启动虚拟机](/file/在Android官方虚拟机root教程/v2-b60ae7b884d6848a35860a138a1dc9af_1440w.jpg)

开机之后，在命令行运行rootAVD.bat ListAllAVDs，这时候得到了很多命令，我们需要的命令是后面带FAKEBOOTIMG的，如果下载了很多镜像，需要注意命令里面的镜像名称要与开机的镜像一致

![运行rootAVD.bat ListAllAVDs](/file/在Android官方虚拟机root教程/v2-1ea830be82cb35cab7e4d00b9883b048_1440w.jpg)

根据自己情况选择正确的命令，然后复制粘贴执行，等待一会，然后输出到这里就会停下来
[*] Install/Patch /sdcard/Download/fakeboot.img and hit Enter when done(max. 60s)
此时你有60秒可以去修补镜像：

![修补fakeboot.img](/file/在Android官方虚拟机root教程/v2-e89cfd90c4342ac834b9b49790f86906_1440w.jpg)

```bash
有时候也会出现卡在检查Magisk 版本的情况，多等一会就好了
[!] Checking available Magisk Versions
```
来到虚拟机，此时已经自动安装并启动了Magisk，点击安装
![安装Magisk](/file/在Android官方虚拟机root教程/v2-fdbc4b0b1d076af785d0ee055b8ae6e0_1440w.jpg)

选择并修补一个文件

![选择并修补文件](/file/在Android官方虚拟机root教程/v2-b93da4a77c591ad22db8c0579740343d_1440w.jpg)

需要修补fakeboot.img，位置在下载文件夹，选择它

![选择并修补文件](/file/在Android官方虚拟机root教程/v2-e5a74b143e18eaa5510ea194370efc1a_1440w.jpg)

最后Magisk修补文件显示完成就是成功了，输出如图：

![Magisk修补文件显示完成](/file/在Android官方虚拟机root教程/v2-7c66af0635980b353b5adb9c98a0ce57_1440w.jpg)

回到命令行，可以回车继续，60秒结束之后也会直接继续，最后输出如下：
```bash
...
[-] Performing Streamed Install
[-] Success
[-] Shut-Down and Reboot [Cold Boot Now] the AVD and see IF it worked
[-] Root and Su with Magisk for Android Studio AVDs
[-] Modded by NewBit XDA - Jan. 2021
[*] Huge Credits and big Thanks to topjohnwu, shakalaca and vvb2060
[-] Trying to shut down the AVD
[!] If the AVD doesnt shut down, try it manually!
```
此时虚拟机应该自动关机了，将其开机，打开Magisk显示已经安装，此时应用具有root权限

![Magisk显示已安装](/file/在Android官方虚拟机root教程/v2-8007c41625f8ad2bd705f7eed816d999_1440w.jpg)


```text
本文转载自:https://zhuanlan.zhihu.com/p/1957771634682360710
```