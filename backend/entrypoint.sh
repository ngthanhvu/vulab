#!/bin/sh
set -e

echo "Đang chạy database migration..."
node dist/database/migrate.js

echo "Migration hoàn tất. Đang khởi động backend..."
exec "$@"
