#!/usr/bin/env bash
set -e

# Ensure SQLite database exists
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

# Ensure storage directories exist and have proper permissions
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Run database migrations if needed
php artisan migrate --force --no-interaction || true

# Clear cached config on container boot
php artisan config:clear || true

# Determine port (Render supplies $PORT, fallback to 8000)
PORT="${PORT:-8000}"

echo "======================================================="
echo " Starting Compare Anything AI Backend on port ${PORT} "
echo "======================================================="

# Run the high-performance Laravel server
exec php artisan serve --host=0.0.0.0 --port="${PORT}"
