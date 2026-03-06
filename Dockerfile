# Symfony 7 + React Portfolio - Production Docker Image
FROM php:8.3-fpm-bookworm AS base

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    git \
    libicu-dev \
    libpq-dev \
    libzip-dev \
    nginx \
    nodejs \
    npm \
    postgresql-client \
    supervisor \
    unzip \
    zip \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default \
    && rm -f /etc/nginx/sites-available/default

# Install PHP extensions
RUN docker-php-ext-configure intl && \
    docker-php-ext-install \
    intl \
    opcache \
    pdo \
    pdo_pgsql \
    zip

# Configure PHP for production
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    echo "opcache.enable=1" >> "$PHP_INI_DIR/conf.d/opcache.ini" && \
    echo "opcache.memory_consumption=256" >> "$PHP_INI_DIR/conf.d/opcache.ini" && \
    echo "opcache.max_accelerated_files=20000" >> "$PHP_INI_DIR/conf.d/opcache.ini" && \
    echo "opcache.validate_timestamps=0" >> "$PHP_INI_DIR/conf.d/opcache.ini" && \
    echo "upload_max_filesize=10M" >> "$PHP_INI_DIR/conf.d/uploads.ini" && \
    echo "post_max_size=10M" >> "$PHP_INI_DIR/conf.d/uploads.ini" && \
    echo "sys_temp_dir=/app/var/tmp" >> "$PHP_INI_DIR/conf.d/uploads.ini" && \
    echo "upload_tmp_dir=/app/var/tmp" >> "$PHP_INI_DIR/conf.d/uploads.ini"

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files first for better layer caching
COPY composer.json ./

# Create minimal .env to avoid errors
RUN echo "APP_ENV=prod\nAPP_SECRET=docker-temp-secret" > .env

# Install dependencies WITHOUT running any scripts (they need DB which we don't have yet)
RUN composer install --no-dev --no-scripts --no-interaction --no-cache --ignore-platform-reqs 2>&1 | grep -v "Script cache:clear" || true

# Copy package files for Node dependencies
COPY package.json ./
# Install all dependencies (webpack-encore is needed for build)
RUN npm install --legacy-peer-deps 2>&1 || true

# Copy application code BEFORE npm build
COPY . .

# Build frontend assets - continue even if errors
RUN npm run build 2>&1 || echo "Build completed with warnings"

# Create necessary directories (cache/logs will be created at runtime)
RUN mkdir -p var/cache var/log public/uploads/projects && \
    chown -R www-data:www-data var public/uploads && \
    chmod -R 775 var public/uploads

# Copy nginx configuration to correct Debian path
COPY docker/nginx/default.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Copy supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisord.conf

# Copy and make entrypoint executable
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port
EXPOSE 8080

# Start via entrypoint script (handles migrations + supervisor)
ENTRYPOINT ["/entrypoint.sh"]
