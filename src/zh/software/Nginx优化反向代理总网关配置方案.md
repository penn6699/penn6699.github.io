
### Nginx 优化反向代理总网关配置方案

针对您需要将 Nginx 作为总网关管理多个子应用，并实现单独限流和日志记录的需求，我设计了一套结构化的优化配置方案。这个配置将公共设置与应用特定设置分离，便于维护和扩展。

### 配置结构说明

以下配置分为几个主要部分：
- 全局基础配置
- HTTP 公共设置（包括日志格式、Gzip 等）
- 限流配置（每个应用单独限流）
- 总网关 Server 配置
- 子应用反向代理配置示例
- 特殊应用优化配置示例

### 完整优化配置

```nginx
# 全局配置
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

# 工作进程配置
events {
    worker_connections 10240;
    multi_accept on;
    use epoll;
}

# HTTP 全局配置
http {
    # 日志格式定义
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                     '$status $body_bytes_sent "$http_referer" '
                     '"$http_user_agent" "$http_x_forwarded_for" '
                     '$upstream_addr $upstream_status $upstream_response_time $request_time';
    
    log_format json '{"time":"$time_iso8601",'
                    '"remote_addr":"$remote_addr",'
                    '"remote_user":"$remote_user",'
                    '"request":"$request",'
                    '"status":$status,'
                    '"body_bytes_sent":$body_bytes_sent,'
                    '"referer":"$http_referer",'
                    '"user_agent":"$http_user_agent",'
                    '"x_forwarded_for":"$http_x_forwarded_for",'
                    '"upstream_addr":"$upstream_addr",'
                    '"upstream_status":$upstream_status,'
                    '"upstream_time":$upstream_response_time,'
                    '"request_time":$request_time,"host":"$host"}';
    
    # 访问日志缓冲区设置
    access_log /var/log/nginx/access.log main buffer=32k;
    
    # 全局代理设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50m;
    client_body_buffer_size 128k;
    
    # Gzip 压缩设置
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 限流配置 - 每个应用单独配置
    limit_req_zone $binary_remote_addr zone=app1_limit:10m rate=20r/s;
    limit_req_zone $binary_remote_addr zone=app2_limit:10m rate=50r/s;
    limit_req_zone $binary_remote_addr zone=app3_limit:10m rate=10r/s;
    
    # 缓存配置
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;
    proxy_temp_path /var/temp/nginx;
    
    # 总网关 Server 配置
    server {
        listen 80;
        server_name your-domain.com;
        access_log /var/log/nginx/global_access.log main;
        
        # HTTPS 重定向
        return 301 https://$host$request_uri;
    }
    
    server {
        listen 443 ssl http2;
        server_name your-domain.com;
        access_log /var/log/nginx/global_https_access.log main;
        
        # SSL 配置
        ssl_certificate /path/to/your/cert.pem;
        ssl_certificate_key /path/to/your/key.pem;
        ssl_session_timeout 5m;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
        
        # HSTS 配置
        add_header Strict-Transport-Security "max-age=31536000; includeSubdomains; preload" always;
        
        # 公共 Location 配置
        location / {
            return 404;
        }
        
        # 静态资源 Location (可公共复用)
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 7d;
            add_header Cache-Control "public";
            access_log off;
        }
        
        # 子应用 1 反向代理配置
        location /app1/ {
            # 应用1 限流配置
            limit_req zone=app1_limit burst=10 nodelay;
            
            # 应用1 单独日志
            access_log /var/log/nginx/app1_access.log main;
            
            # 反向代理设置
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_pass http://app1-server:8080/;
            
            # 代理超时设置
            proxy_connect_timeout 30s;
            proxy_read_timeout 60s;
            proxy_send_timeout 60s;
            proxy_buffer_size 16k;
            proxy_buffers 4 16k;
            
            # 健康检查
            health_check interval=30s fail_count=3 pass_count=2;
        }
        
        # 子应用 2 反向代理配置
        location /app2/ {
            # 应用2 限流配置 (更高限制)
            limit_req zone=app2_limit burst=20 nodelay;
            
            # 应用2 单独日志
            access_log /var/log/nginx/app2_access.log json;
            
            # 反向代理设置
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_pass http://app2-server:9090/;
            
            # 针对app2的特殊优化 - 长连接支持
            proxy_http_version 1.1;
            proxy_set_header Connection "keep-alive";
            
            # 缓存配置
            proxy_cache my_cache;
            proxy_cache_valid 200 302 10m;
            proxy_cache_valid 404 1m;
            proxy_cache_key $host$request_uri;
        }
        
        # 子应用 3 反向代理配置 (带路径重写)
        location /app3/ {
            # 应用3 限流配置 (较低限制)
            limit_req zone=app3_limit burst=5 nodelay;
            
            # 应用3 单独日志
            access_log /var/log/nginx/app3_access.log main;
            
            # 路径重写 - 去除app3前缀
            rewrite ^/app3/(.*) /$1 break;
            
            # 反向代理设置
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_pass http://app3-server:8081/;
            
            # 特殊安全头配置
            add_header X-Frame-Options "SAMEORIGIN";
            add_header X-Content-Type-Options "nosniff";
            add_header X-XSS-Protection "1; mode=block";
        }
        
        # 特殊应用优化配置示例 - 微服务网格入口
        location /microservice/ {
            # 更高的连接数限制
            limit_req zone=app2_limit burst=50 nodelay;
            
            # 单独日志
            access_log /var/log/nginx/microservice_access.log main;
            
            # 针对微服务的特殊优化
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Service-Name "microservice-gateway";
            
            # 负载均衡策略 - 轮询
            proxy_pass http://microservice-load-balancer/;
            
            # 针对微服务的超时优化
            proxy_connect_timeout 10s;
            proxy_read_timeout 300s;  # 长请求支持
            proxy_send_timeout 300s;
            proxy_buffer_size 32k;
            proxy_buffers 8 32k;
            proxy_busy_buffers_size 64k;
        }
    }
}
```

### 配置说明与优化点

1. **结构化设计**：将全局配置、公共设置与应用特定配置分离，便于维护和扩展

2. **单独限流实现**：
   - 使用 `limit_req_zone` 为每个应用创建独立的限流区域
   - 不同应用可设置不同的限流速率（req/s）和突发容量
   - `nodelay` 参数确保突发请求被立即处理

3. **独立日志系统**：
   - 每个应用使用独立的 `access_log` 指令
   - 支持不同的日志格式（普通格式和 JSON 格式）
   - 日志路径清晰标识所属应用

4. **性能优化措施**：
   - 使用 `epoll` 事件模型提升高并发性能
   - 开启 `sendfile` 和 `tcp_nopush` 优化文件传输
   - Gzip 压缩减少带宽占用
   - 连接超时和缓冲区优化

5. **安全增强配置**：
   - SSL/TLS 配置支持最新加密协议和算法
   - HSTS 强制 HTTPS 访问
   - 安全响应头（X-Frame-Options, X-XSS-Protection 等）

6. **特殊应用支持**：
   - 路径重写功能（`rewrite` 指令）
   - 长连接支持（`proxy_http_version` 和 `Connection` 头）
   - 缓存配置（`proxy_cache` 指令）
   - 微服务特殊头信息传递

### 使用与扩展建议

1. 将上述配置保存为 `nginx.conf` 或包含在 `conf.d` 目录下的配置文件中
2. 根据实际应用需求调整限流速率、日志路径和代理目标
3. 对于新增应用，只需添加新的 `location` 块并配置对应的限流和日志
4. 建议定期分析各应用的日志，根据访问模式调整限流策略
5. 生产环境部署前，建议使用 `nginx -t` 命令检查配置正确性

这个配置方案充分考虑了作为总网关的需求，既保证了整体性能和安全性，又为每个子应用提供了灵活的定制空间。