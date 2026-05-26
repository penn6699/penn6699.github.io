# Docker操作命令

Docker 常用操作命令的分类整理，涵盖**镜像管理、容器生命周期、资源清理、网络与数据卷**等核心场景，适合新手快速查阅或日常运维参考。

## 一、镜像（Image）管理


| 命令                                 | 说明          | 示例                            |
| ------------------------------------ | ------------- | ------------------------------- |
| `docker pull <镜像名>[:标签]`        | 拉取镜像      | `docker pull nginx:latest`      |
| `docker images`/`docker image ls`    | 查看本地镜像  | `docker images`                 |
| `docker build -t <名称:标签> <路径>` | 构建镜像      | `docker build -t myapp:v1 .`    |
| `docker rmi <镜像ID或名称>`          | 删除镜像      | `docker rmi nginx`              |
| `docker tag <源镜像> <新镜像名>`     | 重命名/打标签 | `docker tag nginx mynginx:v1`   |
| `docker save <镜像> > file.tar`      | 导出镜像      | `docker save nginx > nginx.tar` |
| `docker load < file.tar`             | 导入镜像      | `docker load < nginx.tar`       |

---

## 二、容器（Container）生命周期

### 1. 创建与启动


| 命令                         | 说明           | 示例                           |
| ---------------------------- | -------------- | ------------------------------ |
| `docker run [参数] <镜像>`   | 创建并启动容器 | `docker run -d -p 80:80 nginx` |
| `docker start <容器ID/名>`   | 启动已停止容器 | `docker start my_nginx`        |
| `docker stop <容器ID/名>`    | 停止容器       | `docker stop my_nginx`         |
| `docker restart <容器ID/名>` | 重启容器       | `docker restart my_nginx`      |

### 常用 `docker run`参数

```
-d        # 后台运行
-p 主机端口:容器端口  # 端口映射
-v 主机目录:容器目录  # 挂载数据卷
--name 容器名         # 指定容器名
--rm                  # 退出后自动删除容器
-e KEY=VALUE          # 设置环境变量
--network 网络名      # 指定网络
```

### 2. 查看与管理


| 命令                             | 说明             | 示例                               |
| -------------------------------- | ---------------- | ---------------------------------- |
| `docker ps`                      | 查看运行中的容器 | `docker ps`                        |
| `docker ps -a`                   | 查看所有容器     | `docker ps -a`                     |
| `docker logs <容器>`             | 查看日志         | `docker logs my_nginx`             |
| `docker exec -it <容器> bash`    | 进入容器         | `docker exec -it my_nginx sh`      |
| `docker inspect <容器/镜像>`     | 查看详细信息     | `docker inspect nginx`             |
| `docker cp <容器>:路径 主机路径` | 复制文件         | `docker cp my_nginx:/etc/nginx ./` |

### 3. 停止与删除


| 命令                         | 说明         | 示例                 |
| ---------------------------- | ------------ | -------------------- |
| `docker rm <容器>`           | 删除容器     | `docker rm my_nginx` |
| `docker rm $(docker ps -aq)` | 删除所有容器 | ⚠️ 谨慎使用        |

---

## 三、资源清理（释放磁盘空间）


| 命令                     | 说明                            |
| ------------------------ | ------------------------------- |
| `docker container prune` | 删除所有停止的容器              |
| `docker image prune`     | 删除未使用的镜像                |
| `docker volume prune`    | 删除未使用的数据卷              |
| `docker system prune`    | 清理所有未使用资源（⚠️ 慎用） |

---

## 四、数据卷（Volume）


| 命令                           | 说明       |
| ------------------------------ | ---------- |
| `docker volume create <卷名>`  | 创建数据卷 |
| `docker volume ls`             | 查看数据卷 |
| `docker volume rm <卷名>`      | 删除数据卷 |
| `docker volume inspect <卷名>` | 查看卷详情 |

✅ 使用示例：

```
docker run -d -v mysql_data:/var/lib/mysql mysql
```

---

## 五、网络（Network）


| 命令                                   | 说明           |
| -------------------------------------- | -------------- |
| `docker network ls`                    | 查看网络       |
| `docker network create <网络名>`       | 创建自定义网络 |
| `docker network inspect <网络名>`      | 查看网络详情   |
| `docker network connect <网络> <容器>` | 连接容器到网络 |

---

## 六、Docker Compose（多容器管理）

> Docker Compose 有两条调用形式：**新版**（内置插件）用 `docker compose`（中间空格），**旧版**用独立的 `docker-compose`（横杠）。下面以新版 `docker compose` 为主，括号里标注旧写法。

### 1、最核心的


| 命令                             | 说明                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `docker compose up -d`        | 启动服务 —— 根据 compose.yml 创建/启动所有服务（最常用的那条）  不带 -d 会前台运行，Ctrl+C 停掉 |
| `docker compose down`       | 停止并删除服务 —— 停容器 + 删容器 + 删默认网络（⚠️ 默认不删 volumes）                         |
| `docker compose stop`       | 停止 —— 停但不删容器/网络（可再 start 恢复）                                                    |
| `docker compose start`      | 启动（从 stopped 状态恢复）                                                                       |
| `docker compose ps`         | 查看服务状态                                                                                      |
| `docker compose logs`       | 查看日志                                                                                          |

### 2、服务生命周期完整对照


| 命令                            | 作用                                              | 等价于手动做了什么              |
| ------------------------------- | ------------------------------------------------- | ------------------------------- |
| `docker compose up`             | 创建并启动**全部**服务                            | build → create → start        |
| `docker compose up -d`          | 同上，但**后台运行**                              | —                              |
| `docker compose up -d --build`  | 先重新构建镜像再启动                              | `build --no-cache` 可强制无缓存 |
| `docker compose stop`           | 发 SIGTERM 优雅停，**保留容器**                   | `docker stop ...`               |
| `docker compose start`          | 把 stop 掉的容器重新拉起                          | `docker start ...`              |
| `docker compose restart`        | 重启所有服务                                      | stop → start                   |
| `docker compose down`           | 停 +**删容器** + 删默认 network                   | 干净收尾                        |
| `docker compose down -v`        | 同上 +**顺带删 named volumes**（⚠️ 数据可能丢） | 彻底清理                        |
| `docker compose down --rmi all` | 停 + 删容器 + 删 compose 创建的镜像               | —                              |
| `docker compose pause`          | 暂停（cgroup freeze）                             | 进程挂起但不退出                |
| `docker compose unpause`        | 恢复                                              | —                              |
| `docker compose kill`           | 直接 SIGKILL 强杀（不等优雅退出）                 | 紧急情况用                      |

> 💡 **stop vs down 的关键区别**：`stop` 只是关机，`down` 是拆台——容器和网络都没了（volumes 默认还留着）。

### 3、查看状态 & 日志

#### 状态查看

```bash
# 看服务状态（类似 docker ps 但只列 compose 管理的）
docker compose ps

# 看每个服务的进程
docker compose top

# 看 compose 拉起的是哪些镜像
docker compose images
```

#### 日志（超级常用）

```bash
# 所有服务日志（尾部跟踪，-f 持续输出）
docker compose logs -f

# 只看某个服务
docker compose logs -f web

# 只看最近 100 行，不看实时
docker compose logs --tail=100 web

# 不加 -f 就一次性打印完
docker compose logs web
```

---

### 4、在容器内执行命令（exec）

```bash
# 进容器（交互式 shell）
docker compose exec web bash
# 有些精简镜像只有 sh
docker compose exec web sh

# 直接跑一条命令
docker compose exec db psql -U postgres -d mydb -c "\dt"
```

> ⚠️ `exec` 只能对 **running** 状态的容器用。容器没起来就用 `docker run` 临时起一个，或者先 `up`。

---

### 5、构建相关

```bash
# 只构建，不启动
docker compose build

# 强制无缓存重建
docker compose build --no-cache

# up 时顺便构建（最常用组合）
docker compose up -d --build

# 只对某个服务构建
docker compose build web
```

---

### 6、单服务操作（而不是全量）

```bash
# 只启动/重启/停止某一个服务
docker compose up -d web
docker compose restart web
docker compose stop web

# 扩缩容（前提：服务没写固定端口映射 80:80 这种！）
docker compose up -d --scale web=3
```

---

### 7、环境变量 & 多文件叠加

```bash
# Compose 默认读同目录下的 .env 文件
# 你可以在 .env 里写：
#   POSTGRES_PASSWORD=mypassword
# 然后在 compose.yml 里用 ${POSTGRES_PASSWORD}

# 指定非默认文件名
docker compose -f docker-compose.prod.yml up -d

# 叠加多个文件（后面的覆盖前面的）
docker compose -f compose.yml -f compose.prod.yml up -d
```

---

### 8、清理与磁盘回收

```bash
# 停掉并移除容器/网络（最常用收尾）
docker compose down

# 连 volumes 一起删（⚠️ 确认数据不需要了！）
docker compose down -v

# 全局 Docker 垃圾回收（不属于 compose 独有）
docker system prune -f
```

---

### 9、最小实战模板（方便你对照着改）

```yaml
# compose.yml（v2 默认文件名，也可以是 docker-compose.yml）
services:
  web:
    build: .
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./app:/app
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

然后一句起飞：

```bash
docker compose up -d --build
docker compose logs -f web
```

### 10、新旧写法对照（怕你脚本里看到两种混着）


| 新版（推荐）                 | 旧版（逐步淘汰但仍常见）     |
| ---------------------------- | ---------------------------- |
| `docker compose up -d`       | `docker-compose up -d`       |
| `docker compose down`        | `docker-compose down`        |
| `docker compose ps`          | `docker-compose ps`          |
| `docker compose exec web sh` | `docker-compose exec web sh` |

判断你机器用的是哪种：

```bash
docker compose version     # 有输出 → v2（空格版）
docker-compose version     # 有输出 → 老版还在
```

## 七、实用技巧

```
# 查看容器资源占用
docker stats

# 实时查看日志
docker logs -f my_nginx

# 批量停止所有容器
docker stop $(docker ps -q)

# 查看 Docker 磁盘占用
docker system df
```
