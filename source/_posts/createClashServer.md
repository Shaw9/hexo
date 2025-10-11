---
title: 搭建clash服务器
date: 2025-07-26 07:23:06
tags:
    - 网络代理
categories:
    - 开发编程
---

> 这个文章是为了搭建一个clash服务器，用于代理网络流量，可是这样搭建的服务器只能用来代理http和https的流量，不够全局，比如不能打游戏啦，所以更推荐看这篇文章：{% btn '/2025/08/05/vmess/',这里 %}

### 需要的物品：
1. 外网的 vps（国外的服务器）,
    - Microsoft Azure 订阅
    - 腾讯云
2. 一个域名
    1.  在{% btn 'https://www.spaceship.com/',这里 %}获取一个域名
    
3. 一个SSL证书
    1. 参考：{% btn 'https://www.runoob.com/http/ssl-certbot.html',这里 %}


### 具体步骤
##### 1. 进入vps，然后安装 1panel
```bash
(bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)") # 在这个过程中会自动安装docker
```
##### 2. 将域名和IP绑定
    1. 登录cloudflare，将域名加入cloudflare的防御
    2. 进入https://dash.cloudflare.com/68e38eexxxxxxxxx/<YOUR.DOMAIN.COM>/dns
    3. 添加一条A记录，将域名指向vps的IP地址
##### 3. 安装证书
参考：https://www.runoob.com/http/ssl-certbot.html
生成的证书会在`/etc/letsencrypt/live/<YOUR.DOMAIN.COM/>`目录下，这个证书90天后就过期了，所以，需要定期更新证书
手动更新:
```bash 
certbot certonly --force-renewal --manual -d '<YOUR.DOMAIN.COM/>' \
--preferred-challenges dns \
--server https://acme-v02.api.letsencrypt.org/directory
```
可以做一下证书的自动化更新。
##### 4. 运行代理服务器（关键）
```bash
#!/bin/bash

# 下面的四个参数需要改成你的
DOMAIN="YOU.DOMAIN.NAME"
USER="username"
PASS="password"
PORT=443

BIND_IP=0.0.0.0
CERT_DIR=/etc/letsencrypt
CERT=${CERT_DIR}/live/${DOMAIN}/fullchain.pem
KEY=${CERT_DIR}/live/${DOMAIN}/privkey.pem
sudo docker run -d --name gost \
    -v ${CERT_DIR}:${CERT_DIR}:ro \
    --net=host ginuerzh/gost \
    -L "http2://${USER}:${PASS}@${BIND_IP}:${PORT}?cert=${CERT}&key=${KEY}&probe_resist=code:404&knock=www.google.com"
```
> 关于 gost 的参数， 你可以参看其文档：Gost Wiki，上面我设置一个参数 probe_resist=code:404 意思是，如果服务器被探测，或是用浏览器来访问，返回404错误，也可以返回一个网页（如：probe_resist=file:/path/to/file.txt 或其它网站 probe_resist=web:example.com/page.html）

如无意外，你的服务就启起来了。 你可以使用如下命令在检查有没有启动成功：
sudo docker ps 来查看 gost 是否在运行。
netstat -nolp | grep 443 来查看 gost 是否在监听 443 端口。
sudo docker logs gost 来查看 gost 的日志。
你可以使用下面的命令验证你的 gost 服务是否正常。

```bash
curl -v "https://www.google.com" --proxy "https://${DOMAIN}" --proxy-user '${USER}:${PASS}'
```
##### 5. 配置Clash 
下列为Clash配置文件示例
```text
mixed-port: 7890
allow-lan: true
bind-address: '*'
mode: rule
log-level: info
external-controller: '127.0.0.1:9090'
dns:
    enable: false
    ipv6: true
    default-nameserver: [223.5.5.5, 119.29.29.29, 8.8.8.8]
    enhanced-mode: fake-ip
    fake-ip-range: 198.18.0.1/16
    use-hosts: true
    nameserver: ['https://doh.pub/dns-query', 'https://dns.alidns.com/dns-query']
    fallback: ['https://doh.dns.sb/dns-query', 'https://dns.cloudflare.com/dns-query', 'https://dns.twnic.tw/dns-query', 'tls://8.8.4.4:853']
    fallback-filter: { geoip: true, ipcidr: [240.0.0.0/4, 0.0.0.0/32] }
proxies:
    - { name: 'pansyliu-proxy', type: http, server: <YOUR.DOMAIN.COM/>, port: 443, username: USER, password: PASS, tls: true ,http2: true}
```