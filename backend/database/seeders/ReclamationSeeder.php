<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Reclamation;
use App\Models\Client;

class ReclamationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = Client::first();

        Reclamation::create([
            'client_id' => $client->id,
            'sujet' => 'Problème avec la réservation',
            'message' => 'Le prix de la réservation ne correspond pas.',
            'statut' => 'ouverte',
        ]);
    }
}
