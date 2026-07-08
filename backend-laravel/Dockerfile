FROM php:8.2-cli

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y git unzip libpq-dev libzip-dev libonig-dev zip \
    && docker-php-ext-install pdo pdo_pgsql sockets \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && chmod +x /usr/local/bin/composer

COPY . ./

RUN composer install --no-interaction --optimize-autoloader --prefer-dist --no-security-blocking
RUN if [ ! -f .env ]; then cp .env.example .env; fi
RUN if ! grep -q "^APP_KEY=base64:" .env; then php artisan key:generate --ansi || true; fi

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
