# Alibaba Cloud Linux 4 安装docker

Alibaba Cloud Linux 4 默认已经把 **Moby**（Docker 的开源上游）作为默认容器运行时预置了，如果你只是跑容器，`yum install -y moby` 就够了。但要装 **Docker CE（docker-ce）**，得手动挂 CentOS 的 repo 并把 `$releasever` 换成 9（Alinux 4 对应 RHEL 9 系，网上有些教程写 8 是错的）。

参考文档：[https://www.alibabacloud.com/help/zh/ecs/user-guide/install-and-use-docker?spm=0.0.0.i0](https://https://www.alibabacloud.com/help/zh/ecs/user-guide/install-and-use-docker?spm=0.0.0.i0)

下面给的是 **Docker CE** 的完整走法，ECS 上直接复制执行即可。

## 一、卸载旧组件（干净安装）

Alinux 4 可能自带 moby/docker 残件，先清掉避免冲突：

```bash
sudo rm -f /etc/yum.repos.d/docker*.repo
sudo dnf -y remove docker moby docker-ce containerd.io \
    docker-ce-rootless-extras docker-buildx-plugin \
    docker-ce-cli docker-compose-plugin
```

> 镜像/容器/卷默认在 `/var/lib/docker/`，卸载不会删，想清空再手动 `rm -rf /var/lib/docker`。

## 二、添加 Docker CE 仓库（阿里云镜像源，比官方快）

```bash
# 下 repo 文件
sudo wget -O /etc/yum.repos.d/docker-ce.repo \
    http://mirrors.cloud.aliyuncs.com/docker-ce/linux/centos/docker-ce.repo

# 把 baseurl 换成阿里云内网源（ECS 用很稳）
sudo sed -i 's|https://mirrors.aliyun.com|http://mirrors.cloud.aliyuncs.com|g' \
    /etc/yum.repos.d/docker-ce.repo

# 关键：Alinux 4 对应 CentOS 9 系，$releasever 原值是 alinux4，yum 会找不到包
sudo sed -i 's|$releasever|9|' /etc/yum.repos.d/docker-ce.repo
```

## 三、安装 Docker CE + Compose

```bash
sudo dnf -y install \
    docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
```

## 四、启动 & 开机自启 & 验证

```bash
sudo systemctl enable --now docker
docker --version
sudo systemctl status docker --no-pager
```

跑个 hello-world 确认 daemon 正常：

```bash
sudo docker run hello-world
```

## 五、两个常用附赠

### 👤 普通用户免 sudo 用 docker

```bash
sudo usermod -aG docker $USER
newgrp docker   # 当前 shell 生效，或重登
```

之后直接 `docker ps` 不用 sudo。

### 🚀 配阿里云镜像加速（拉镜像快很多）

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://<你的ID>.mirror.aliyuncs.com"]
}
EOF
sudo systemctl restart docker
```

镜像加速器地址在阿里云控制台「容器镜像服务 → 镜像加速器」里拿，替换 `<你的ID>` 那段。

#### 配置镜像加速器地址

路径：/etc/docker/daemon.json

```json
{
    "registry-mirrors": [
        "https://0vmzj3q6.mirror.aliyuncs.com",
        "https://docker.m.daocloud.io",
        "https://mirror.baidubce.com",
        "https://dockerproxy.com",
        "https://mirror.iscas.ac.cn",
        "https://huecker.io",
        "https://dockerhub.timeweb.cloud",
        "https://noohub.ru",
        "https://vlgh0kqj.mirror.aliyuncs.com"
    ]
}

```

## 六、只想用 Moby 的话（官方推荐方案）

如果你不硬要 docker-ce，Alinux 4 官方主推的就是 moby，一条命令搞定，后续随系统一起更新：

```bash
sudo yum install -y moby
sudo systemctl enable --now docker
```

CLI 用法和 docker-ce 一样，`docker`/`docker compose` 都能用。

> ⚠️ 以后如果想换回 moby：`sudo yum remove -y docker-ce docker-ce-cli && sudo rm -rf /etc/yum.repos.d/docker-ce.repo`，再装 moby 就行。
