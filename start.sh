#!/bin/sh

echo "Running migrations..."
php artisan migrate --force

echo "Creating log files..."
touch /var/www/html/storage/logs/worker.log
chown -R www-data:www-data /var/www/html/storage

echo "Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf