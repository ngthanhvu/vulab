#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

ENV_NAME="${1:-prod}"

if [ "$ENV_NAME" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
elif [ "$ENV_NAME" = "dev" ]; then
    COMPOSE_FILE="docker-compose.yml"
else
    echo "❌ Môi trường không hợp lệ: $ENV_NAME"
    exit 1
fi

echo "==> Môi trường: $ENV_NAME"
echo "==> Compose file: $COMPOSE_FILE"

# Tạo .env nếu chưa tồn tại
if [ ! -f .env ]; then
    echo "==> Tạo .env từ .env.example ..."
    cp .env.example .env
fi

# Nếu chạy trực tiếp ngoài Jenkins thì pull code mới
if [ -z "${JENKINS_URL:-}" ] && [ -d .git ]; then
    BRANCH="${2:-main}"

    echo "==> Pull origin/$BRANCH ..."

    git fetch origin
    git reset --hard "origin/$BRANCH"
fi

# ==========================================
# STOP CONTAINER CŨ
# ==========================================

echo "==> Dừng containers cũ ..."

docker compose \
    -f "$COMPOSE_FILE" \
    down --remove-orphans || true


# ==========================================
# XÓA IMAGE CŨ KHÔNG CÒN DÙNG
# ==========================================

echo "==> Xóa images cũ ..."

docker image prune -f || true


# ==========================================
# PULL BASE IMAGE
# ==========================================

echo "==> Pull base images ..."

docker compose \
    -f "$COMPOSE_FILE" \
    pull || true


# ==========================================
# BUILD IMAGE MỚI
# ==========================================

echo "==> Build images mới ..."

docker compose \
    -f "$COMPOSE_FILE" \
    build --pull


# ==========================================
# START CONTAINER MỚI
# ==========================================

echo "==> Start containers mới ..."

docker compose \
    -f "$COMPOSE_FILE" \
    up -d


# ==========================================
# STATUS
# ==========================================

echo "==> Containers đang chạy:"

docker compose \
    -f "$COMPOSE_FILE" \
    ps


# ==========================================
# CLEANUP
# ==========================================

echo "==> Cleanup images/build cache cũ ..."

docker image prune -f || true
docker builder prune -f || true

echo "========================================"
echo "✅ Deploy hoàn tất!"
echo "========================================"