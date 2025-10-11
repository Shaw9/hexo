---
title: MQTT的初次研究
date: 2025-09-16 08:42:51
tags:
---

MQTT是一种基于发布/订阅模式的轻量级消息传输协议，可以实现类似智能家居的通信，需要一个中间者

MQTT服务器搭建  (不能商用)
```bash
docker pull emqx/emqx
```
启动容器
```bash
docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8084:8084 -p 8883:8883 -p 18083:18083 emqx/emqx:latest
```
发布者
```python
import time
import paho.mqtt.client as mqtt
import json

MQTT_SERVER = 'localhost'
MQTT_PORT = 1883
client = mqtt.Client()
client.connect(MQTT_SERVER, MQTT_PORT, 60)
client.loop_start()
data = {"id": 1, "name": "tiger", "status": 0, "timestamp": time.time()}
while True:

    if(data['status'] == 0):
        data['status'] = 1
    else:
        data['status'] = 0
    msg = json.dumps(data)
    client.publish('test', msg, 1)
    print('send:', data)
    time.sleep(1)
```

订阅者
```python
import paho.mqtt.client as mqtt
import json

MQTT_SERVER = 'localhost'
MQTT_PORT = 1883

# 定义消息处理函数
def on_message(client, userdata, msg):
    try:
        # 尝试解析JSON数据
        data = json.loads(msg.payload)
        print(f"收到主题 {msg.topic} 的消息: {data}")
    except json.JSONDecodeError:
        # 如果不是JSON格式，直接打印原始消息
        print(f"收到主题 {msg.topic} 的消息: {msg.payload}")

# 创建客户端实例
client = mqtt.Client()

# 先设置消息处理函数
client.on_message = on_message

# 连接到MQTT服务器
client.connect(MQTT_SERVER, MQTT_PORT, 60)

# 订阅主题
client.subscribe('test', 1)

# 开始循环处理
client.loop_start()

# 保持程序运行
try:
    while True:
        pass  # 保持主程序运行
except KeyboardInterrupt:
    print("程序已停止")
    client.loop_stop()
    client.disconnect()


```