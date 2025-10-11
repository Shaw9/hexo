---
title: 创建博客（hexo）
date: 2025-07-29 16:13:51
tags:
    - 博客
categories:
    - 开发编程
---

## 需要的物品
1. 一台服务器(阿里云、腾讯云、华为云等)
2. Liunx系统（Ubuntu）
## 可选项
1. 域名
2. 备案
3. SSL

# 具体步骤：
### 1. 安装 fnm
```bash
wget https://github.com/Schniz/fnm/releases/download/v1.38.1/fnm-linux.zip
```
### 2. 解压
```bash
unzip fnm-linux.zip
```
### 3. 移动到 ~/.local/bin
```bash
mv fnm ~/.local/bin
```
### 4. 将fnm加入环境变量
```bash
echo 'export PATH="$HOME/.local/bin/fnm:$PATH"' >> /etc/profile
echo 'eval "$(fnm env)"' >> /etc/profile
source /etc/profile
```
### 5. 安装 nodejs
```bash
fnm install 20.18.0
fnm use 20.18.0
```
### 6. 安装 hexo
```bash
npm install hexo -g
```
### 7. 初始化 hexo
```bash
mkdir blog
cd blog
hexo init
```
> 测试搭建是否完成,使用命令`
> hexo server`
> 访问 http://【服务器IP】:4000 即可看到 hexo 博客

### 8. 安装Butterfly主题
点击进入 <a href="https://butterfly.js.org/posts/21cfbf15/">Butterfly官方教程</a>
在你的 Hexo 根目录内

```bash
git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git
```
然后将主题配置文件复制到 Hexo 根目录
```bash
cp -f hexo-theme-butterfly/_config.yml ./_config.butterfly.yml
```
> 升级方法：在主题目录下，运行 git pull
#### 应用主题
修改 Hexo 根目录下的_`config.yml` ，把主题改为 `butterfly`
```yaml
theme: butterfly
```
> 如果你遇到了导航栏布局问题，请修改`themes\butterfly\source\css\_layout\head.styl`加一个`display: flex;`
> ```css

  &.fixed
    #nav
      position: fixed
      display: flex !important  // 这里，解决了导航栏和侧边栏垂直显示的问题

    & + .layout
      & > .aside-content > .sticky_layout
        top: 70px
        transition: top .5s

      #card-toc
        .toc-content
          max-height: calc(100vh - 170px)
```