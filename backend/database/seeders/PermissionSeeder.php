<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'manage roles']);
        Permission::create(['name' => 'manage permissions']);
        Permission::create(['name' => 'manage biens']);
        Permission::create(['name' => 'manage reservations']);
        Permission::create(['name' => 'manage reclamations']);
    }
}
