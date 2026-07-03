FROM serversideup/php:8.3-fpm-nginx

WORKDIR /var/www/html

COPY . .

RUN composer install \
    --no-dev \
    --optimize-autoloader

RUN npm install

RUN npm run build

RUN php artisan optimize

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8080