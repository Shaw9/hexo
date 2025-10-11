---
title: 创建Home Assistant服务
date: 2025-08-23 21:39:53
tags:
---

1.创建docker容器
```bash
sudo docker run -d --name homeassistant --privileged --restart=unless-stopp
ed -e TZ=Asia/Shanghai -v /data/homeassistant:/config --network=host homeassistant/home-as
sistant


mkdir /data/homeassistant
mkdir /data/homeassistant/www
mkdir /data/homeassistant/custom_components
mkdir /data/homeassistant/custom_components/hacs

cd /data/homeassistant/custom_components/hacs
wget https://github.com/hacs/integration/releases/download/2.0.5/hacs.zip # 下载hacs插件 可以自己下载最新版本
unzip hacs.zip
rm hacs.zip
```

2.进入WebUI(http://IP:8123/developer-tools/yaml)重启Home Assistant服务

3.进入 HACS ，下载Xiaomi Home 插件 并重启Home Assistant服务(http://IP:8123/developer-tools/yaml)

4.进入 设置-> 设备&服务-> 添加集成-> 搜索Xiaomi Home 并添加
