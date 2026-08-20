#!/usr/bin/env bash
set -euo pipefail

# Đảm bảo script chạy từ thư mục chứa repo
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Xác định file compose theo môi trường (mặc định là prod)
ENV_NAME="${1:-prod}"
if [ "$ENV_NAME" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
elif [ "$ENV_NAME" = "dev" ]; then
    COMPOSE_FILE="docker-compose.yml"
else
    echo "Lỗi: môi trường không hợp lệ. Chỉ chấp nhận 'dev' hoặc 'prod'."
    exit 1
fi

echo "==> Môi trường: $ENV_NAME"
echo "==> Sử dụng file compose: $COMPOSE_FILE"

# 1. Tạo file .env nếu chưa có (trong Jenkins .env thường bị ignore)
if [ ! -f .env ]; then
    echo "==> Chưa có .env, sao chép từ .env.example ..."
    cp .env.example .env
fi

# 2. Pull code mới nhất nếu chạy trực tiếp trên server (không phải trong Jenkins)
# Jenkins tự động checkout code nên bưc này sẽ bỏ qua khi có biến JENKINS_URL.
if [ -z "${JENKINS_URL:-}" ] && [ -d .git ]; then
    BRANCH="${2:-main}"
    echo "==> Pull code mới nhất từ origin/$BRANCH ..."
    git fetch origin
    git reset --hard "origin/$BRANCH"
fi

# 3. Build và khởi động containers
echo "==> Build & run docker compose ..."
docker compose -f "$COMPOSE_FILE" pull || true
docker compose -f "$COMPOSE_FILE" up --build -d

# 4. Hiển thị trạng thái
echo "==> Containers đang chạy:"
docker compose -f "$COMPOSE_FILE" ps

# 5. Dọn dẹp images/containers không còn sử dụng (tùy chọn, bỏ qua nếu lỗi)
echo "==> Dọn dẹp Docker resources cũ ..."
docker system prune -f || true

echo "==> Hoàn tất build & deploy!"
