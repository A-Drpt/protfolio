#!/bin/bash
set +e

log() { echo "ENTRYPOINT: $*"; }

# Ensure base dirs exist and try to set sane perms
log "creating var and upload directories"
mkdir -p /app/var/cache/prod /app/var/cache/dev /app/var/log /app/public/uploads/projects
chmod -R 0775 /app/var /app/public 2>/dev/null || true
chown -R www-data:www-data /app/var /app/public 2>/dev/null || true

# Kill any PHP processes that might be holding locks
pkill -9 php-fpm 2>/dev/null || true
sleep 1

# If vendor is missing, try to run composer at runtime (best-effort recovery)
if [ ! -f /app/vendor/autoload_runtime.php ]; then
	log "vendor missing: attempting runtime composer install"
	if [ -x /usr/local/bin/composer ]; then
		/usr/local/bin/composer install --no-dev --no-interaction --no-scripts --prefer-dist --no-progress || log "composer install (runtime) failed"
	else
		log "composer binary not found at /usr/local/bin/composer"
	fi
fi

if [ -f /app/vendor/autoload_runtime.php ]; then
	log "vendor present"
else
	log "vendor STILL MISSING after attempt. Listing /app for debugging:"
	ls -la /app || true
	ls -la /app/vendor || true
fi

# Health check: test write + rename into app cache (symfony needs rename to work)
TMPTEST="/app/var/cache/entrypoint-test-$$.tmp"
TARGET="/app/var/cache/entrypoint-rename-$$.tmp"
echo "x" > "$TMPTEST" 2>/dev/null || log "failed to write $TMPTEST"
mv "$TMPTEST" "$TARGET" 2>/dev/null
if [ $? -ne 0 ]; then
	log "rename test failed; fixing perms and retrying"
	chmod -R 0775 /app/var || true
	chown -R www-data:www-data /app/var || true
	mv "$TMPTEST" "$TARGET" 2>/dev/null || log "rename still failing after chmod/chown"
else
	log "rename test OK"
fi

# Run migrations if DATABASE_URL is provided (ignore errors)
[ ! -z "$DATABASE_URL" ] && php /app/bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration 2>/dev/null || true

# Start fresh supervisor
exec /usr/bin/supervisord -c /etc/supervisord.conf
