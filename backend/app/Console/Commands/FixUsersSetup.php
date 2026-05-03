<?php

namespace App\Console\Commands;

use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class FixUsersSetup extends Command
{
    protected $signature   = 'fix:users';
    protected $description = 'Corrige la table users et crée les comptes admin/agent/client';

    public function handle(): void
    {
        $this->info('🔧 Correction de la table users...');

        // 1. Ajouter les colonnes manquantes sans erreur
        Schema::table('users', function ($table) {
            if (! Schema::hasColumn('users', 'first_name')) {
                $table->string('first_name')->nullable()->after('id');
                $this->info('  ✅ Colonne first_name ajoutée');
            }
            if (! Schema::hasColumn('users', 'last_name')) {
                $table->string('last_name')->nullable()->after('first_name');
                $this->info('  ✅ Colonne last_name ajoutée');
            }
            if (! Schema::hasColumn('users', 'status')) {
                $table->string('status')->default('actif')->after('phone');
                $this->info('  ✅ Colonne status ajoutée');
            }
        });

        // 2. Marquer la migration comme exécutée dans la table migrations
        $migrationName = '2026_05_01_150000_add_first_last_name_to_users_table';
        DB::table('migrations')->updateOrInsert(
            ['migration' => $migrationName],
            ['batch' => DB::table('migrations')->max('batch') + 1]
        );

        $migrationName2 = '2026_05_02_000001_add_status_to_users_table';
        DB::table('migrations')->updateOrInsert(
            ['migration' => $migrationName2],
            ['batch' => DB::table('migrations')->max('batch')]
        );

        $this->info('  ✅ Migrations marquées comme exécutées');

        // 3. Récupérer les rôles
        $adminRoleId  = Role::where('name', 'admin')->value('id');
        $agentRoleId  = Role::where('name', 'agent')->value('id');
        $clientRoleId = Role::where('name', 'client')->value('id');

        if (! $adminRoleId || ! $agentRoleId || ! $clientRoleId) {
            $this->error('❌ Rôles manquants. Lance d\'abord: php artisan db:seed --class=RoleSeeder');
            return;
        }

        $this->info('');
        $this->info('👤 Création des comptes...');

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
        $admin1->roles()->sync([$adminRoleId]);
        $this->info('  ✅ Admin1 : mlamaranapalaga21@gmail.com / Admin@2024!');

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
        $admin2->roles()->sync([$adminRoleId]);
        $this->info('  ✅ Admin2 : oumouratoubarry52@gmail.com / Admin@2024!');

        // AGENT
        $agent = User::updateOrCreate(
            ['email' => 'agent1@immogestion.com'],
            [
                'first_name' => 'Awa',
                'last_name'  => 'Traoré',
                'name'       => 'Awa Traoré',
                'password'   => Hash::make('Agent@2024!'),
                'status'     => 'actif',
            ]
        );
        $agent->roles()->sync([$agentRoleId]);
        $this->info('  ✅ Agent  : agent1@immogestion.com / Agent@2024!');

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
        $client->roles()->sync([$clientRoleId]);
        if (! $client->client) {
            Client::create([
                'user_id' => $client->id,
                'phone'   => '771234567',
                'address' => 'Dakar, Sénégal',
            ]);
        }
        $this->info('  ✅ Client : client@immogestion.com / Client@2024!');

        $this->info('');
        $this->info('🎉 Tout est prêt ! Tu peux te connecter maintenant.');
    }
}
