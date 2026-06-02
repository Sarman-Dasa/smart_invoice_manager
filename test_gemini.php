<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$ai = app(\App\Contracts\AiGeneratorInterface::class);
echo "Starting stream...\n";
try {
    foreach ($ai->stream('Hello') as $chunk) {
        echo "CHUNK: " . $chunk . "\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
echo "Done.\n";
