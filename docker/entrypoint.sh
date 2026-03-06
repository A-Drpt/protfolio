#!/bin/bash
set -e

# Run migrations if DATABASE_URL is set
if [ ! -z "$DATABASE_URL" ]; then
    echo "🔄 Running database migrations..."
    php /app/bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration || true
    
    # Only load fixtures if no tables exist (first time)
    if php /app/bin/console doctrine:query:sql "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'" 2>/dev/null | grep -q "1"; then
        echo "✅ Database already initialized"
    else
        echo "📦 Loading initial data..."
        php /app/bin/console doctrine:fixtures:load --no-interaction --append || true
    fi
fi

echo "✅ Application ready!"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
