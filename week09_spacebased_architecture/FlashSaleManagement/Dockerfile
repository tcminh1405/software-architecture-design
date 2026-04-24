# --- STAGE 1: Backend Services ---
FROM node:18-alpine AS backend-base
ARG SERVICE_NAME
WORKDIR /app

# Sao chép package.json và cài đặt thư viện
COPY ./${SERVICE_NAME}/package*.json ./
RUN npm install --omit=dev

# Sao chép toàn bộ mã nguồn của service (bao gồm cả redis.js đã được nhân bản)
COPY ./${SERVICE_NAME}/ .

EXPOSE 8080
CMD ["node", "index.js"]

# --- STAGE 2: Build Frontend ---
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ .
RUN npm run build

# --- STAGE 3: Production Frontend (Nginx) ---
FROM nginx:stable-alpine AS frontend-final
COPY --from=frontend-build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
