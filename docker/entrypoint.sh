#!/bin/bash
set -e

# Run migrations if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
    echo "🔄 Running database migrations..."
    php /app/bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration || true
    echo "✅ Migrations completed"
fi

echo "✅ Application ready!"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
