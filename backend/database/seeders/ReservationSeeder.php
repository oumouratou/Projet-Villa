<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Reservation;
use App\Models\Client;
use App\Models\BienImmobilier;

class ReservationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $client = Client::first();
        $bien = BienImmobilier::first();

        if (! $client || ! $bien) {
            return;
        }

        Reservation::create([
            'client_id' => $client->id,
            'bien_immobilier_id' => $bien->id,
            'date_debut' => now(),
            'date_fin' => now()->addDays(5),
            'statut' => 'confirmee',
        ]);
    }
}
