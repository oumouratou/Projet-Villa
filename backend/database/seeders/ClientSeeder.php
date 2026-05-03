<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Client;
use App\Models\User;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clientUser = User::where('email', 'client@example.com')->first();
        if (! $clientUser) {
            return;
        }

        Client::create([
            'user_id' => $clientUser->id,
            'phone' => $clientUser->phone,
            'address' => '123 Rue des Clients, Abidjan',
        ]);
    }
}
