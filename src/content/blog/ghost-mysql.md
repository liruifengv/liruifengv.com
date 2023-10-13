---
title: "ghost 使用 mysql"
description: "上一篇文章使用 Ghost 从零搭建博客系统 写了如何搭建 Ghost，但是 Ghost 默认使用 SQLite 数据库，我们想使用 mysql 数据库，这篇文章就实践一下。"
pubDatetime: 2021-12-17
author: liruifengv
featured: false
draft: false
postSlug: ghost-mysql
tags:
  - ghost
  - 建站
  - blog
  - mysql
---

上一篇文章[使用 Ghost 从零搭建博客系统](/posts/ghost/) 写了如何搭建 Ghost，但是 Ghost 默认使用 SQLite 数据库，我们想使用 mysql 数据库，这篇文章就实践一下。

之前是使用的 docker 镜像，那么我们直接使用 通过 [docker stack deploy](https://docs.docker.com/engine/reference/commandline/stack_deploy/) or [docker-compose](https://github.com/docker/compose) 的方式，同时启动多个服务。

创建一个 stack.yml 文件，内容如下

```yaml
version: "3.1"

services:
  ghost:
    image: ghost
    restart: always
    container_name: ghost
    volumes:
      - /home/ghost/data:/var/lib/ghost/content
    ports:
      - 3001:2368
    environment:
      # see https://ghost.org/docs/config/#configuration-options
      database__client: mysql
      database__connection__host: db
      database__connection__user: root
      database__connection__password: password
      database__connection__database: ghost
      # this url value is just an example, and is likely wrong for your environment!
      url: http://127.0.0.1:3000
      # contrary to the default mentioned in the linked documentation, this image defaults to NODE_ENV=production (so development mode needs to be explicitly specified if desired)
      #NODE_ENV: development

  db:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: password
```

然后执行命令：

```sh
docker stack deploy -c stack.yml ghost
```

![插图](https://bucket.liruifengv.com/ghost-mysql/img1.webp)

`docker service ls` 看到了两个服务

![插图](https://bucket.liruifengv.com/ghost-mysql/img2.webp)

```sh
docker ps
```

![插图](https://bucket.liruifengv.com/ghost-mysql/img3.webp)

打开网站，发现我们的博客也顺利启动起来了，那么看一下数据库链接是否变成了 mysql

```sh
docker exec -it 5e66ec87a27a mysql -p
```

进入 mysql 容器

```sh
use ghost;
show tables;
```

![插图](https://bucket.liruifengv.com/ghost-mysql/img4.webp)

我们能看到 mysql 中新建了 ghost 数据库，以及相关的表。

至此，说明我们切换 mysql 成功了！

往期文章：[使用 Ghost 从零搭建博客系统](/posts/ghost/)
