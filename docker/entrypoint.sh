#!/bin/bash
set +e

# NUCLEAR OPTION: Fix EVERYTHING
mkdir -p /app/var/cache/prod /app/var/cache/dev /app/var/log /app/public/uploads/projects
chmod -R 777 /app/var /app/public 2>/dev/null || true
chown -R www-data:www-data /app/var /app/public 2>/dev/null || true

# Kill any PHP processes that might be holding locks
pkill -9 php-fpm 2>/dev/null || true
sleep 1

# Run migrations
[ ! -z "$DATABASE_URL" ] && php /app/bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration 2>/dev/null || true

# Start fresh supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
