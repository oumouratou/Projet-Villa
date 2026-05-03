<?php



namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Les bases (Rôles et Permissions d'abord)
            RoleSeeder::class,
            PermissionSeeder::class,
            
            // 2. Les utilisateurs (qui ont besoin des rôles)
            UserSeeder::class,
            
            // 3. Les entités liées aux utilisateurs ou indépendantes
            ClientSeeder::class,
            OptionSeeder::class,
            
            // 4. Les données métiers (Biens, Reservations, etc.)
            EnhancedBienSeeder::class,
            ReservationSeeder::class,
            ReclamationSeeder::class,
        ]);
    }
}

