#!/bin/bash
set -e

# Fix permissions for cache and logs
echo "🔧 Fixing permissions..."
chown -R www-data:www-data /app/var /app/public/uploads
chmod -R 775 /app/var /app/public/uploads

# Run migrations if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
    echo "🔄 Running database migrations..."
    php /app/bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration || true
    echo "✅ Migrations completed"
fi

# Clear cache
echo "🧹 Clearing cache..."
php /app/bin/console cache:clear --no-warmup || true
php /app/bin/console cache:warmup || true

echo "✅ Application ready!"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
