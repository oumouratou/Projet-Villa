<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$agent = \App\Models\User::where('email', 'agent1@immogestion.com')->first();
if ($agent) {
    echo $agent->id . "\n";
} else {
    echo "NOT_FOUND\n";
}
