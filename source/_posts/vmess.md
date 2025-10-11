---
title: vmess协议代理搭建
date: 2025-08-05 00:41:59
tags:
    - 网络代理
categories:
    - 开发编程
---

> 这种代理方式更方便，不需要域名，也不需要证书，只需要在客户端配置好vmess的地址和端口，就可以直接使用了，而且支持游戏加速，但是我没找到所谓的 rule 模式 所以是默认全局的这点非常不方便。

# 搭建vmess服务器

## 服务器端
需要的物品：
1. 外网的 vps（国外的服务器）,
    - Microsoft Azure 订阅
    - 腾讯云
2. 一个健全的大脑
3. 一个有耐心的人

运行安装脚本
```bash
bash <(curl -s -L https://raw.githubusercontent.com/xyz690/v2ray/master/install.sh)
```

回车选择1安装
然后协议选择2(tcp-http)，端口号默认即可，
广告拦截别选，因为会减速
可选安装 Shadowsocks （应该可以靠这个给clash使用，虽然我不会配置）
复制一下链接

## 客户端
点击{% btn '/file/vmess/v2rayN-3.29.zip',这里 %}下载
打开后直接ctrl+v导入该配置并启用
然后打开设置，确认这两个参数：
<img src="/file/vmess/3f59facaa8c84414920cc6a52b7ab959~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp"></img>
点击确定，接下来下载SSTAP(游戏加速器)，链接如下
{% btn '/file/vmess/SSTap-beta-setup-1.0.9.7.exe',这里 %}
安装SSTAP
下载后，运行SSTAP.exe程序,选择添加socks5：
<img src="/file/vmess/2599aa508b86439fa193f3b22aaba1ca~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp"></img>
服务器IP填127.0.0.1，端口填10808，分组名称选default，country选择你的服务器地区，点击保存，返回进入主页面，模式下拉列表选择你的游戏，没有的话直接第一个全局内置规则即可，点击连接即启动游戏加速器，一般而言SG和HK的延迟在100ms左右，勉强是够用的，可以打打FPS。
如果不用的话点击断开连接，否则可能会出现电脑浏览器连不上网络的情况
