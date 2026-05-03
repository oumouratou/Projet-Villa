<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BienImmobilier;
use App\Models\User;

class BienImmobilierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agent = User::where('email', 'agent@example.com')->first();

        BienImmobilier::create([
            'title' => 'Villa moderne Cocody Riviera',
            'type' => 'villa',
            'description' => 'Magnifique villa de 4 chambres avec piscine et jardin tropical.',
            'address' => 'Riviera Golf, Rue des Ambassades',
            'city' => 'Abidjan',
            'price_per_night' => 150000,
            'surface' => 350,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'capacity' => 8,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);

        BienImmobilier::create([
            'title' => 'Appartement standing Plateau',
            'type' => 'appartement',
            'description' => 'Appartement de 3 pieces avec vue sur la lagune.',
            'address' => 'Avenue Franchet d\'Esperey',
            'city' => 'Abidjan',
            'price_per_night' => 80000,
            'surface' => 120,
            'bedrooms' => 2,
            'bathrooms' => 2,
            'capacity' => 4,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);

        BienImmobilier::create([
            'title' => 'Studio meuble Marcory',
            'type' => 'studio',
            'description' => 'Studio confortable et bien equipe, ideal pour un sejour d\'affaires.',
            'address' => 'Zone 4, Rue du 7 Decembre',
            'city' => 'Abidjan',
            'price_per_night' => 45000,
            'surface' => 40,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'capacity' => 2,
            'status' => 'reserve',
            'image_url' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
    }
}
