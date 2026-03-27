# Docker Image Optimization - Node.js Demo

So sánh 3 cách build image Node.js với kích thước khác nhau.

## Cấu trúc

```
docker_image_optimization/
├── app/
│   ├── index.js          ← Express app
│   └── package.json
├── Dockerfile.1-heavy      ← node:18-slim       ~240MB
├── Dockerfile.2-alpine     ← node:18-alpine      ~180MB
└── Dockerfile.3-multistage ← multi-stage alpine  ~160MB  ← tối ưu nhất
```

## Chạy demo

Mở PowerShell trong thư mục `docker_image_optimization`:

```powershell
# Bước 1: Build cả 3 image
docker build -f Dockerfile.1-heavy      -t demo-app:heavy      .
docker build -f Dockerfile.2-alpine     -t demo-app:alpine     .
docker build -f Dockerfile.3-multistage -t demo-app:optimized  .

# Bước 2: So sánh kích thước
docker images | Select-String "demo-app"
```

## Kết quả kỳ vọng

| Tag       | Base image      | Kích thước |
|-----------|-----------------|------------|
| heavy     | node:18-slim    | ~240MB     |
| alpine    | node:18-alpine  | ~180MB     |
| optimized | multi-stage     | ~160MB     |

## Chạy thử container

```powershell
docker run -d --name demo -p 3000:3000 demo-app:optimized
# Truy cập http://localhost:3000
docker stop demo; docker rm demo
```

## Tại sao multi-stage nhỏ hơn?

- Copy `package.json` trước khi copy source code
  → Docker cache layer deps, rebuild nhanh hơn khi chỉ sửa code
- Stage `final` chỉ chứa `node_modules` + `index.js`, không có npm cache hay build tools thừa
