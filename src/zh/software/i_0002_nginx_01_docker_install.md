# nginx的docker-compose部署nginx并配置Https证书

Nginx + Let's Encrypt（docker compose / 生产用）

镜像版本：

- nginx:1.30.0-alpine
- certbot/certbot:v5.6.0

网络：

- 使用已存在的外部网络 `web_net`

目录说明：

- `docker-compose.yml`：Nginx + Certbot 两个服务
- `nginx/conf.d/00-http.conf`：HTTP + ACME challenge（并将业务流量 301 到 HTTPS）
- `nginx/conf.d/10-https.conf.example`：HTTPS 配置示例（首次签发证书后再启用）
- `certbot/entrypoint.sh`：定时续期脚本（续期成功后 reload Nginx）

 目录附件：[nginx_web-20260710.zip](..\..\assets\file\nginx_web-20260710.zip) 

 目录文件内容：

`docker-compose.yml`：Nginx + Certbot 两个服务

```yaml
name: nginx_web
services:
  nginx:
    image: nginx:1.30.3-alpine
    container_name: nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/www:/var/www/certbot:ro
      - ./certbot/conf:/etc/letsencrypt:ro
    networks:
      - web_net

  certbot:
    image: certbot/certbot:v5.6.0
    container_name: certbot
    restart: unless-stopped
    depends_on:
      - nginx
    pid: "service:nginx"
    # 首次签发证书，注释 entrypoint 节点
    entrypoint:
      - /bin/sh
      - /entrypoint.sh
    volumes:
      - ./certbot/www:/var/www/certbot
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/entrypoint.sh:/entrypoint.sh:ro
    networks:
      - web_net

networks:
  web_net:
    external: true

```

`nginx/conf.d/00-http.conf`：HTTP + ACME challenge（并将业务流量 301 到 HTTPS）

```bash
server {
    listen 80;
    listen [::]:80;

    server_name penn.ink abc.penn.ink;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type "text/plain";
        try_files $uri =404;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}


```

`nginx/conf.d/10-https.conf.example`：HTTPS 配置示例（首次签发证书后再启用）

```bash
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name penn.ink abc.penn.ink;

    ssl_certificate /etc/letsencrypt/live/penn.ink/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/penn.ink/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location ^~ /.well-known/acme-challenge/ {
        root /var/www/certbot;
        default_type "text/plain";
        try_files $uri =404;
    }

    location / {
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }
}


```

`certbot/entrypoint.sh`：定时续期脚本（续期成功后 reload Nginx）

```bash
set -eu

sleep_seconds="${RENEW_INTERVAL_SECONDS:-43200}"

while true; do
  certbot renew \
    --webroot -w /var/www/certbot \
    --deploy-hook 'kill -HUP 1' \
    --quiet

  sleep "$sleep_seconds"
done


```



## 0. 前置条件

1) DNS 已解析到这台服务器（至少包含 `penn.ink`，如需子域名也要解析）
2) 服务器安全组/防火墙放行 80 与 443
3) 已存在 docker 网络 `web_net`（外部网络）

## 1. 首次启动（只启 HTTP）

首次签发证书前，不能启用 HTTPS 配置文件，否则 Nginx 会因证书文件不存在而启动失败。

1) 先启动 Nginx（仅 HTTP 配置生效）

```bash
docker compose up -d nginx
```

2) 首次签发证书（生产环境）

将 `EMAIL` 替换为你的邮箱；`-d` 后面按需追加子域名（例如 `-d abc.penn.ink`）。

注释 docker-compose.yml 中 certbot 的注释 entrypoint 节点，签发证书后取消注释

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d penn.ink \
  -d abc.penn.ink \
  --email EMAIL \
  --agree-tos \
  --no-eff-email
```

可选：先用 staging 验证流程（避免触发生产限额），仅需加上：
`--staging`

示例：

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d penn.ink \
  -d abc.penn.ink \
  --email penn6699@126.com \
  --agree-tos \
  --no-eff-email


```


3) 启用 HTTPS 配置并 reload Nginx

把 `nginx/conf.d/10-https.conf.example` 改名为 `10-https.conf`：

```bash
# 在仓库目录执行（Linux/macOS）
mv nginx/conf.d/10-https.conf.example nginx/conf.d/10-https.conf

docker compose exec nginx nginx -t
docker compose exec nginx nginx -s reload
```

Windows 环境也可以直接用编辑器重命名文件，然后执行 reload 命令即可。

4) 启动 certbot 常驻续期服务

```bash
docker compose up -d certbot
```

## 2. 自动续期与自动 reload 原理

- Nginx 容器只负责读取 `/etc/letsencrypt` 下的证书文件提供 HTTPS
- Certbot 容器会定时执行：
  - `certbot renew --webroot -w /var/www/certbot`
  - 当某个证书“实际完成续期”时，`--deploy-hook` 会执行 `kill -HUP 1`
- 由于 compose 中设置了 `pid: "service:nginx"`，certbot 与 nginx 共享 PID namespace；`kill -HUP 1` 会给 nginx 主进程发送 HUP，从而完成 reload 并加载新证书

续期间隔可通过环境变量调整：

- `RENEW_INTERVAL_SECONDS`（默认 43200，即 12 小时）

示例：

```bash
RENEW_INTERVAL_SECONDS=21600 docker compose up -d certbot
```

## 3. 配置多个子域名

Let’s Encrypt 的 HTTP-01 验证不能签发 `*.penn.ink` 这种通配符证书（通配符需要 DNS-01）。

这里采用的方式是：把需要的子域名作为 SAN 加到同一张证书里（多写几个 `-d`）。

如果要新增域名：

1) 先确保 DNS 已解析到本机
2) 重新执行一次 `certbot certonly --webroot ...`，把新的 `-d` 也加上
3) 修改 `server_name`（`00-http.conf` 与 `10-https.conf` 都要一致）
4) reload Nginx

## 4. 常用维护命令

查看证书：

```bash
docker compose exec certbot certbot certificates
```

手动触发续期（并在成功时 reload）：

```bash
docker compose exec certbot certbot renew --webroot -w /var/www/certbot --deploy-hook 'kill -HUP 1'
```

检查 Nginx 配置：

```bash
docker compose exec nginx nginx -t
```
