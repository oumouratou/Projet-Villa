<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Option;

class OptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Option::create(['name' => 'Piscine']);
        Option::create(['name' => 'Jardin']);
        Option::create(['name' => 'Garage']);
        Option::create(['name' => 'Wi-Fi']);
        Option::create(['name' => 'Climatisation']);
    }
}
