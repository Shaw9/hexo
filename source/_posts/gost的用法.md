---
title: gost的用法
date: 2026-03-17 14:31:31
tags:
  - 工具学习
  - gost
---

```bash
gost -L tcp://:8080/192.168.1.1:80
```
>可以让本地的8080端口代理到192.168.1.1的80端口,当有请求过来时，会先到达本地的8080端口，然后再由gost转发到192.168.1.1的80端口，也就是说访问127.0.0.1:8080就相当于访问192.168.1.1:80

```bash
gost -L=rtcp://:2222/:22 -F socks5://192.168.1.2:1080
```
> 可以让192.168.1.2的2222端口转发到本地的22端口，也就是说访问192.168.1.2:2222就相当于访问本地的22端口（需要一个socks5代理）

```bash
 gost -L socks5://:1080
 ```
> 可以让本地的1080端口开启一个socks5代理



 ## tun 代理
 服务端
```bash
gost -L "tun://:8422?net=10.0.0.1/24&mtu=1420"
```
> 启动一个tun代理服务器，tun的ip地址为10.0.0.1，子网掩码为24位，也就是说tun的ip地址范围为10.0.0.0/24

如果需要认证则使用配置文件，配置文件内容如下：
```yaml
services:
- name: service-0
  addr: :8422
  handler:
    type: tun
    auther: tun-auth  # 关联认证器
  listener:
    type: tun
    metadata:
      net: 10.0.0.1/24  # 服务端隧道IP
      mtu: 1420

# 认证器配置
authers:
- name: tun-auth
  auths:
  - username: 10.0.0.2  # 客户端隧道IP（必须和客户端net一致）
    password: MyPass123  # 认证密码（自定义，最长16位）
```


客户端
```bash

gost.exe -L "tun://:8422/43.165.135.237:8422?net=10.0.0.2/24&keepalive=true"
```
> 启动一个tun代理客户端，链接到43.165.135.237的8422端口，tun的ip地址为10.0.0.2，子网掩码为24位，也就是说tun的ip地址范围为10.0.0.0/24

如果需要认证则：
```bash
 gost -L "tun://:0/43.165.135.237:8422?net=10.0.0.2/24&mtu=1420&passphrase=MyPass123&keepalive=true"
 ```

 > 每个设备的IP记得要不同


一键脚本：
```bash
#!/bin/bash
# install-gost-server.sh

# 安装 gost
wget https://github.com/go-gost/gost/releases/download/v3.0.0-rc10/gost_3.0.0-rc10_linux_amd64.tar.gz
tar -xzf gost_3.0.0-rc10_linux_amd64.tar.gz
sudo mv gost /usr/local/bin/

# 创建配置
sudo mkdir -p /etc/gost
sudo tee /etc/gost/server.yaml > /dev/null << 'EOF'
services:
- name: service-0
  addr: :8422
  handler:
    type: tun
    auther: tun-auth
  listener:
    type: tun
    metadata:
      net: 10.0.0.1/24
      mtu: 1420

authers:
- name: tun-auth
  auths:
  - username: 10.0.0.2
    password: MyPass123
  - username: 10.0.0.3
    password: MyPass123

log:
  level: info
EOF

# 开启转发
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-gost-forward.conf
sudo sysctl --system

# 配置防火墙
sudo iptables -A FORWARD -i tun0 -o tun0 -j ACCEPT
sudo iptables -A FORWARD -s 10.0.0.0/24 -d 10.0.0.0/24 -j ACCEPT
sudo apt install iptables-persistent -y
sudo netfilter-persistent save

# 创建 systemd 服务
sudo tee /etc/systemd/system/gost-tun.service > /dev/null << 'EOF'
[Unit]
Description=GOST TUN Server
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/gost -C /etc/gost/server.yaml
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable gost-tun
sudo systemctl start gost-tun

echo "GOST TUN 服务端已启动，端口 8422"
echo "查看状态: sudo systemctl status gost-tun"
echo "查看日志: sudo journalctl -u gost-tun -f"
```