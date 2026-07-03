#!/bin/sh

echo "Running migrations..."

php artisan migrate --force

echo "Starting Apache..."

exec apache2-foreground