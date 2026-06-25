# 🐳 Docker 网络命令 — 完整速查与实战指南

## 一、核心子命令一览


| 命令                                        | 作用                               |
| ------------------------------------------- | ---------------------------------- |
| `docker network ls`                         | 列出所有网络                       |
| `docker network inspect <网络名>`           | 查看网络详细配置（JSON）           |
| `docker network create [选项] <网络名>`     | 创建新网络                         |
| `docker network connect <网络名> <容器>`    | 将容器接入网络                     |
| `docker network disconnect <网络名> <容器>` | 将容器从网络断开                   |
| `docker network rm <网络名...>`             | 删除指定网络                       |
| `docker network prune`                      | 清理所有**未被任何容器使用**的网络 |

## 二、Docker 默认网络驱动（理解这些才能用好）


| 驱动               | 说明                                                         | 典型场景                     |
| ------------------ | ------------------------------------------------------------ | ---------------------------- |
| **bridge**（默认） | 通过虚拟网桥`docker0` 通信，容器获得内网 IP，经 NAT 访问外网 | 单机多容器                   |
| **host**           | 容器**直接共享宿主机网络栈**，无隔离，不分配独立 IP          | 追求极致性能、不需要端口隔离 |
| **none**           | 容器只有`lo`（回环），完全无网络                             | 安全隔离/离线批处理          |
| **overlay**        | 跨多台 Docker 主机的容器通信（需 Swarm）                     | 集群/编排                    |
| **macvlan**        | 给容器分配 MAC 地址，让它像一台物理设备出现在局域网          | 遗留系统需直连物理网         |

> ⚠️ **不要用默认 `bridge` 做容器互访**——它不支持自动 DNS 解析（容器名→IP）。请创建**自定义 bridge 网络**，自定义网络自带嵌入式 DNS，容器之间可以用 **名字** 互相 ping 通。

## 三、逐条命令详解 + 示例

### 1. `docker network ls` — 列出网络

```bash
docker network ls
```

常用选项：

```bash
# 过滤驱动类型
docker network ls --filter driver=bridge

# 自定义输出格式
docker network ls --format "table {{.Name}}\t{{.Driver}}\t{{.Scope}}"
```

典型输出：

```
NETWORK ID     NAME      DRIVER    SCOPE
abc123456789   bridge    bridge    local
def098765432   host      host      local
ghi789012345   none      null      local
```

### 2. `docker network inspect` — 看网络详情（排查神器）

```bash
docker network inspect my-net
```

只看关键信息（Go 模板）：

```bash
# 查看子网
docker network inspect --format '{{range .IPAM.Config}}{{.Subnet}}{{end}}' my-net

# 列出连入该网络的容器及其 IP
docker network inspect --format '{{range .Containers}}{{.Name}} → {{.IPv4Address}}{{"\n"}}{{end}}' my-net
```

返回完整 JSON，包含：`Subnet`、`Gateway`、`Containers`（每个容器的 Name/IP/MAC）。

### 3. `docker network create` — 创建自定义网络 ⭐ 最常用

```bash
# ▶ 最简方式（推荐日常用）
docker network create my-app-net

# ▶ 指定子网、网关
docker network create \
  --driver bridge \
  --subnet 192.168.100.0/24 \
  --gateway 192.168.100.1 \
  my-app-net

# ▶ 内部网络（容器间能通，但禁止访问外网）→ 常用于 DB 层隔离
docker network create --internal isolated-net

# ▶ Overlay 网络（Swarm 集群）
docker network create -d overlay --attachable my-overlay-net
```

> `--attachable` 允许普通容器（非 Swarm Service）也能接入 overlay 网络，开发调试很有用。

### 4. 启动容器时指定网络

```bash
docker run -d \
  --name web \
  --network my-app-net \
  -p 8080:80 \
  nginx:alpine
```

也可在 `docker-compose.yml` 中声明网络，但纯命令行就靠 `--network`。

### 5. `docker network connect` — 把**正在运行**的容器接入网络

```bash
# 基本用法
docker network connect my-app-net redis-1

# 指定固定 IP
docker network connect --ip 192.168.100.10 my-app-net db-container

# 加网络别名（其他容器可通过别名访问它）
docker network connect --alias db my-app-net postgres
```

> 一个容器可以同时连入**多个网络**（比如前端网络 + 后端网络），实现网络隔离拓扑。

### 6. `docker network disconnect` — 断开连接

```bash
docker network disconnect my-app-net redis-1

# 强制断开
docker network disconnect -f my-app-net redis-1
```

### 7. `docker network rm` / `docker network prune` — 删除网络

```bash
# 删除指定网络（必须先断开所有容器）
docker network rm my-app-net

# 一键清理所有「没有任何容器连着」的网络
docker network prune
# 加 -f 跳过确认
docker network prune -f
```

## 四、🌟 经典实战：前后端 + 数据库 三层隔离

```bash
# 1. 创建网络
docker network create frontend-net
docker network create backend-net

# 2. 数据库只在 backend-net（外部不可达）
docker run -d --name mysql \
  --network backend-net \
  -e MYSQL_ROOT_PASSWORD=secret \
  mysql:8

# 3. 后端 API 同时接入 backend + frontend
docker run -d --name api \
  --network backend-net \
  my-api:latest
docker network connect frontend-net api

# 4. Nginx 只在前端网络，对外暴露端口
docker run -d --name nginx \
  --network frontend-net \
  -p 80:80 \
  nginx:alpine
```

这样：

- `nginx` ↔ `api` 通（同在 `frontend-net`）
- `api` ↔ `mysql` 通（同在 `backend-net`）
- `nginx` **无法直接访问** `mysql`（不在同一网络）→ 天然隔离 ✅

## 五、常见排查速查

```bash
# ① 容器到底挂在哪个网络上？
docker inspect <容器> --format='{{json .NetworkSettings.Networks}}' | python3 -m json.tool

# ② 网络中有哪些容器、IP 是什么？
docker network inspect <网络名>

# ③ 容器间能不能通？
docker exec -it app1 ping app2          # 同自定义 bridge 可用名称解析
docker exec -it app1 ping 192.168.100.x # 或直接试 IP

# ④ 容器能不能出外网？
docker exec -it app1 ping 8.8.8.8

# ⑤ 清理孤儿网络
docker network prune -f
```
