# Production Dockerfile for Compare Anything AI Backend (Render.com Free Tier Compatible)
FROM php:8.3-cli-alpine

# Install system dependencies & PHP extensions required by Laravel
RUN apk add --no-cache \
    bash \
    curl \
    git \
    unzip \
    libzip-dev \
    sqlite-dev \
    oniguruma-dev \
    && docker-php-ext-install -j$(nproc) \
    bcmath \
    mbstring \
    pdo \
    pdo_sqlite \
    opcache

# Install latest Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application source code
COPY . .

# Install production dependencies (skip dev dependencies for small image size)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Create storage and database directories
RUN mkdir -p database storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
    && touch database/database.sqlite \
    && chmod -R 775 storage bootstrap/cache database

# Make entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port (Render automatically assigns $PORT)
EXPOSE 8000 10000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
