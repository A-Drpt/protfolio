#!/bin/bash

# Fix all permissions - make everything writable
chmod -R 777 /app/var 2>/dev/null || true
chmod -R 777 /tmp 2>/dev/null || true
chmod -R 777 /app/public/uploads 2>/dev/null || true
chown -R www-data:www-data /app/var /app/public/uploads 2>/dev/null || true

# Run migrations if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
    php /app/bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration 2>/dev/null || true
fi

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
