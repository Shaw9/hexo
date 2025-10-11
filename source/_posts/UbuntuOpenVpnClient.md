---
title: UbuntuOpenVpnClient
date: 2025-08-20 23:31:00
tags:
---

```bash
sudo nmcli connection import type openvpn file <openvpn配置文件路径>

sudo nmcli connection modify <vpn_name> vpn.user-name "ShawLiu"
sudo nmcli connection up <vpn_name>
```


docker 创建Open VPN服务器
```bash
docker run -d   --name=openvpn-as --device /dev/net/tun   --cap-add=MKNOD --cap-add=NET_ADMIN   -p 943:943 -p 443:443 -p 1194:1194/udp   -v ./opt/openvpn:/openvpn   --restart=unless-stopped   openvpn/openvpn-as
```