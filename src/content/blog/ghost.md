---
title: "使用 Ghost 从零搭建博客系统"
description: "Ghost 是一个开源的 CMS 博客系统，使用 Node.js 技术栈，让有需求的个人或团队能够快速的搭建想要的博客站点"
pubDatetime: 2021-11-19
author: liruifengv
featured: false
draft: false
postSlug: ghost
tags:
  - 建站
---

### Ghost 介绍

[GitHub](https://github.com/tryghost/ghost/)

[官网](https://ghost.org/)

这是官方介绍：

> Ghost is an open source, professional publishing platform built on a modern Node.js technology stack — designed for teams who need power, flexibility and performance.

简单来说，Ghost 是一个开源的 CMS 博客系统，使用 Node.js 技术栈，让有需求的个人或团队能够快速的搭建想要的博客站点。

话不多说，开始干吧~

### 本地安装

我们先在自己的电脑本地跑起来，看看是什么样子。

这里是[官网教程](https://ghost.org/docs/install/local/)

因为 Ghost 是 Node.js 开发的，它提供了一个脚手架 Ghost-CLI，对于有前端或者 Node.js 知识的同学应该很熟悉。

这里先全局安装

```sh
npm install ghost-cli@latest -g
```

输入 `ghost -v`，能正确输出版本号说明安装成功了。

创建个新目录

```sh
mkdir test-ghost
cd test-ghost
```

使用脚手架安装

```sh
ghost install local
```

出现了个报错，安装失败

![插图](https://bucket.liruifengv.com/ghost/img1.webp)

看下报错信息说我的 Node.js 版本不支持。

查看[文档](https://ghost.org/docs/faq/node-versions/)，找到支持的版本，使用 nvm 或者 n 来切换 node 版本，这里我使用了 14.18。

重新执行

```sh
ghost install local
```

![插图](https://bucket.liruifengv.com/ghost/img2.webp)

运行成功！

浏览器打开 http://localhost:2368/ghost/

![插图](https://bucket.liruifengv.com/ghost/img3.webp)

第一步让创建一个管理员账号，我们输入相关信息，

第二步让邀请团队成员，可以先跳过，后面再邀请，这里直接进入。

进入后看到的是一个管理员的后台界面。我们可以看到左上角我们设置的网站名称

![插图](https://bucket.liruifengv.com/ghost/img4.webp)

点击 View stie，能看到普通用户的前端页面

![插图](https://bucket.liruifengv.com/ghost/img5.webp)

同时我们可以看到侧边栏，有文章，草稿，页面等管理项。

我们先点击左下角的设置。

![插图](https://bucket.liruifengv.com/ghost/img6.webp)

有一些设置选项，通用、设计、导航等。点击通用

![插图](https://bucket.liruifengv.com/ghost/img7.webp)

可以设置网站名称和描述

时区默认 UTC，我们改成北京时间。

设置语言。查看官方的多语言设置文档。

https://ghost.org/docs/themes/helpers/translate/

到这一步需要了解一下项目的目录结构了。打开一开始创建的目录，会发现 ghost 在该目录下生成了一个项目

![插图](https://bucket.liruifengv.com/ghost/img8.jpeg)

那么如何设置语言呢，在 content/themes 下，是 Ghost 的主题，默认主题是 casper。我们可以在官网找到很多主题，有收费的有免费的。

想要设置语言，在主题下面，新建 locales 文件夹，然后新建 en.json 和 zh.json 文件。使用 i18n 进行国际化的同学应该很熟悉这是干什么的了。编辑你想要的翻译文件。然后根据文档，需要补全两个模板文件：pagination.hbs 和 navigation.hbs。然后在主题下的所有模板文件下查找要翻译的文字，使用`{{t key}}` 语法来进行翻译。

一切都搞定之后，使用 `ghost restart` 命令重启，使得新增文件生效。

![插图](https://bucket.liruifengv.com/ghost/img9.webp)

ok，我们改的一些文字生效了。

### 在服务器安装

在本地安装之后，发现很轻松的就跑起来了，那么去服务器试试吧。

[文档](https://ghost.org/docs/install/)中有几种安装方式，我们这里直接使用 docker 安装。docker 的使用暂且不过多赘述。

这是 Ghost 的 docker [镜像](https://hub.docker.com/_/ghost/)。

首先拉取镜像:

```sh
docker pull ghost
```

镜像拉取成功，我们直接运行

```
docker run -d --name my-ghost -e url=http://域名 -p 3001:2368 ghost
```

请注意替换自己的域名和容器名称。以上命令同时把 3001 端口映射到了容器的 2368 端口。然后我们在 nginx 配置，指向 3001。这时候直接访问我们的域名，就可以查看 ghost 站点了。

执行一下命令可以进入容器内

```
docker exec -it my-ghost /bin/bash
```

这时候我想在容器里面执行一下 ghost 命令。

![插图](https://bucket.liruifengv.com/ghost/img10.png)

突然报错说不能使用 root 用户来运行命令。查看对应文档。不得不说 ghost 的报错信息提示还是很不错的，每个报错都对应了文档链接。这里说让创建个普通用户来执行 ghost 命令。

然后我创建了普通用户，结果普通用户不能进入 docker 容器。于是我又给了这个用户 root 权限。进入容器后执行命令，又报错不能使用 root 用户。我百思不得其解。

后来在 [GitHub Issue](https://github.com/TryGhost/Ghost-CLI/issues/981) 中找到，要在命令后面加`--allow-root`。这下可以愉快的执行 ghost 命令了。

### 总结

到此基本安装完成了。无论是本地安装还是服务器安装，都挺简单的。但是跑起来的还是个比较简单的博客站点，还要做的工作还有很多，比如主题的选择或定制、汉化翻译、文章目录归档等。由于 Ghost 是完全开源并且可以定制的，很多想要的功能，都可以想办法实现。

Ghost 系列文章还会再更新，包括没讲到的团队版如何使用，如何协作。
