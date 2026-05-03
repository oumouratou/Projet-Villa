<?php
namespace Database\Seeders;

use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRoleId  = Role::where('name', 'admin')->value('id');
        $agentRoleId  = Role::where('name', 'agent')->value('id');
        $clientRoleId = Role::where('name', 'client')->value('id');

        // ADMIN 1
        $admin1 = User::updateOrCreate(
            ['email' => 'mlamaranapalaga21@gmail.com'],
            [
                'first_name' => 'Mlamarana',
                'last_name'  => 'Palaga',
                'name'       => 'Mlamarana Palaga',
                'password'   => Hash::make('Admin@2024!'),
                'status'     => 'actif',
            ]
        );
        if ($adminRoleId) $admin1->roles()->sync([$adminRoleId]);

        // ADMIN 2
        $admin2 = User::updateOrCreate(
            ['email' => 'oumouratoubarry52@gmail.com'],
            [
                'first_name' => 'Oumouratou',
                'last_name'  => 'Barry',
                'name'       => 'Oumouratou Barry',
                'password'   => Hash::make('Admin@2024!'),
                'status'     => 'actif',
            ]
        );
        if ($adminRoleId) $admin2->roles()->sync([$adminRoleId]);

        // AGENT 1
        $agent1 = User::updateOrCreate(
            ['email' => 'agent1@immogestion.com'],
            [
                'first_name' => 'Awa',
                'last_name'  => 'Traoré',
                'name'       => 'Awa Traoré',
                'password'   => Hash::make('Agent@2024!'),
                'status'     => 'actif',
            ]
        );
        if ($agentRoleId) $agent1->roles()->sync([$agentRoleId]);

        // CLIENT DÉMO
        $client = User::updateOrCreate(
            ['email' => 'client@immogestion.com'],
            [
                'first_name' => 'Fatou',
                'last_name'  => 'Diallo',
                'name'       => 'Fatou Diallo',
                'password'   => Hash::make('Client@2024!'),
                'phone'      => '771234567',
                'status'     => 'actif',
            ]
        );
        if ($clientRoleId) $client->roles()->sync([$clientRoleId]);
        if (! $client->client) {
            Client::create([
                'user_id' => $client->id,
                'phone'   => '771234567',
                'address' => 'Dakar, Sénégal',
            ]);
        }

        $this->command->info('✅ Admin1  → mlamaranapalaga21@gmail.com / Admin@2024!');
        $this->command->info('✅ Admin2  → oumouratoubarry52@gmail.com / Admin@2024!');
        $this->command->info('✅ Agent   → agent1@immogestion.com      / Agent@2024!');
        $this->command->info('✅ Client  → client@immogestion.com      / Client@2024!');
    }
}