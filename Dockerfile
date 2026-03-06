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
    && rm -rf /var/lib/apt/lists/*

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
    echo "post_max_size=10M" >> "$PHP_INI_DIR/conf.d/uploads.ini"

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files first for better layer caching
COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --no-cache --ignore-platform-reqs

# Copy package files for Node dependencies
COPY package.json ./
# Remove lock file to regenerate it with proper versions
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build frontend assets
RUN npm run build

# Finish Composer installation with scripts
RUN composer install --no-dev --optimize-autoloader --no-interaction && \
    composer dump-autoload --optimize --classmap-authoritative

# Create necessary directories with correct permissions
RUN mkdir -p var/cache var/log public/uploads/projects && \
    chown -R www-data:www-data var public/uploads && \
    chmod -R 775 var public/uploads

# Copy nginx configuration
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Copy supervisor configuration
COPY docker/supervisor/supervisord.conf /etc/supervisord.conf

# Expose port
EXPOSE 8080

# Start supervisor (manages nginx + php-fpm)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
