#!/bin/bash

# Make EVERYTHING writable immediately
chmod -R 777 /app/var /app/public 2>/dev/null || true
chown -R www-data:www-data /app/var /app/public 2>/dev/null || true

# Run migrations
[ ! -z "$DATABASE_URL" ] && php /app/bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration 2>/dev/null || true

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
