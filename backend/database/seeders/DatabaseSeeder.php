<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Complaint;
use App\Models\Property;
use App\Models\PropertyOption;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Complaint::query()->delete();
        Reservation::query()->delete();
        Client::query()->delete();
        Property::query()->delete();
        PropertyOption::query()->delete();
        User::query()->delete();

        $admin = User::create([
            'name' => 'Marie Kone',
            'email' => 'marie.kone@immogestion.ci',
            'phone' => '+2252722000001',
            'role' => 'admin',
            'status' => 'actif',
            'password' => Hash::make('password'),
        ]);

        $agent1 = User::create([
            'name' => 'Yao Kouadio',
            'email' => 'yao.kouadio@immogestion.ci',
            'phone' => '+2252722000002',
            'role' => 'agent',
            'status' => 'actif',
            'password' => Hash::make('password'),
        ]);

        $agent2 = User::create([
            'name' => 'Awa Traore',
            'email' => 'awa.traore@immogestion.ci',
            'phone' => '+2252722000003',
            'role' => 'agent',
            'status' => 'actif',
            'password' => Hash::make('password'),
        ]);

        $clientUser1 = User::create([
            'name' => 'Kouame Aka',
            'email' => 'kouame.aka@gmail.com',
            'phone' => '+2250708091011',
            'role' => 'client',
            'status' => 'actif',
            'password' => Hash::make('password'),
        ]);

        $clientUser2 = User::create([
            'name' => 'Aminata Diallo',
            'email' => 'aminata.diallo@yahoo.fr',
            'phone' => '+2250506070809',
            'role' => 'client',
            'status' => 'actif',
            'password' => Hash::make('password'),
        ]);

        $optionWifi = PropertyOption::create(['name' => 'WiFi', 'icon' => 'wifi', 'description' => 'Connexion internet haut debit']);
        $optionPiscine = PropertyOption::create(['name' => 'Piscine', 'icon' => 'waves', 'description' => 'Piscine privee']);
        $optionParking = PropertyOption::create(['name' => 'Parking', 'icon' => 'car', 'description' => 'Place de parking incluse']);
        $optionClim = PropertyOption::create(['name' => 'Climatisation', 'icon' => 'wind', 'description' => 'Climatisation dans toutes les pieces']);
        $optionCuisine = PropertyOption::create(['name' => 'Cuisine equipee', 'icon' => 'utensils', 'description' => 'Cuisine equipee']);

        $prop1 = Property::create([
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
            'agent_id' => $admin->id,
        ]);

        $prop2 = Property::create([
            'title' => 'Appartement standing Plateau',
            'type' => 'appartement',
            'description' => 'Superbe appartement au coeur du Plateau avec vue lagune.',
            'address' => 'Boulevard Carde, Immeuble CCIA',
            'city' => 'Abidjan',
            'price_per_night' => 85000,
            'surface' => 120,
            'bedrooms' => 2,
            'bathrooms' => 2,
            'capacity' => 4,
            'status' => 'reserve',
            'image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
            'agent_id' => $agent1->id,
        ]);

        $prop3 = Property::create([
            'title' => 'Villa bord de mer Assinie',
            'type' => 'villa',
            'description' => 'Villa pieds dans l eau avec acces direct a la plage.',
            'address' => 'Assinie-Mafia, front de mer',
            'city' => 'Assinie',
            'price_per_night' => 250000,
            'surface' => 400,
            'bedrooms' => 5,
            'bathrooms' => 4,
            'capacity' => 10,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop',
            'agent_id' => $agent2->id,
        ]);

        $prop1->options()->attach([$optionWifi->id, $optionPiscine->id, $optionParking->id, $optionClim->id]);
        $prop2->options()->attach([$optionWifi->id, $optionParking->id, $optionCuisine->id]);
        $prop3->options()->attach([$optionWifi->id, $optionPiscine->id, $optionParking->id, $optionClim->id, $optionCuisine->id]);

        $client1 = Client::create([
            'first_name' => 'Kouame',
            'last_name' => 'Aka',
            'email' => 'kouame.aka@gmail.com',
            'phone' => '+2250708091011',
            'address' => 'Cocody, Abidjan',
            'status' => 'actif',
            'user_id' => $clientUser1->id,
            'agent_id' => $agent1->id,
        ]);

        $client2 = Client::create([
            'first_name' => 'Aminata',
            'last_name' => 'Diallo',
            'email' => 'aminata.diallo@yahoo.fr',
            'phone' => '+2250506070809',
            'address' => 'Marcory, Abidjan',
            'status' => 'actif',
            'user_id' => $clientUser2->id,
            'agent_id' => $agent2->id,
        ]);

        $reservation1 = Reservation::create([
            'property_id' => $prop1->id,
            'client_id' => $client1->id,
            'start_date' => '2026-05-01',
            'end_date' => '2026-05-07',
            'status' => 'confirmee',
            'total_price' => 1050000,
            'agent_comment' => 'Client regulier, excellent dossier.',
            'agent_id' => $agent1->id,
        ]);

        $reservation2 = Reservation::create([
            'property_id' => $prop2->id,
            'client_id' => $client2->id,
            'start_date' => '2026-05-15',
            'end_date' => '2026-05-20',
            'status' => 'en_attente',
            'total_price' => 425000,
            'agent_comment' => null,
            'agent_id' => $agent1->id,
        ]);

        Complaint::create([
            'reservation_id' => $reservation1->id,
            'client_id' => $client1->id,
            'subject' => 'Probleme de climatisation',
            'description' => 'La climatisation du salon ne fonctionne plus.',
            'status' => 'en_cours',
            'agent_response' => null,
            'agent_id' => $agent1->id,
        ]);

        Complaint::create([
            'reservation_id' => $reservation2->id,
            'client_id' => $client2->id,
            'subject' => 'Question sur annulation',
            'description' => 'Merci de preciser les conditions exactes d annulation.',
            'status' => 'ouverte',
            'agent_response' => null,
            'agent_id' => $agent1->id,
        ]);

        $this->call(PropertyImagesSeeder::class);
    }
}
