<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BienImmobilier;
use App\Models\Option;
use App\Models\User;

class EnhancedBienSeeder extends Seeder
{
    public function run(): void
    {
        $agent = User::where('email', 'agent1@immogestion.com')->first();
        if (! $agent) {
            return;
        }

        $options = Option::all()->keyBy('name');

        // Helper function to get option IDs safely
        $getOptionIds = function($optionNames) use ($options) {
            $ids = [];
            foreach ($optionNames as $name) {
                if (isset($options[$name])) {
                    $ids[] = $options[$name]->id;
                }
            }
            return $ids;
        };

        // Abidjan - Cocody Riviera
        $bien1 = BienImmobilier::create([
            'title' => 'Villa moderne Cocody Riviera',
            'type' => 'villa',
            'description' => 'Magnifique villa de 4 chambres avec piscine et jardin tropical. Idéale pour les familles et les événements.',
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
        $bien1->options()->sync([
            $options['Piscine']?->id,
            $options['Wi-Fi']?->id,
            $options['Garage']?->id,
            $options['Jardin']?->id,
        ]);

        // Abidjan - Plateau
        $bien2 = BienImmobilier::create([
            'title' => 'Appartement standing Plateau',
            'type' => 'appartement',
            'description' => 'Appartement de 3 pièces avec vue panoramique sur la lagune. Ascenseur, climatisation complète.',
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
        $bien2->options()->sync([
            $options['Wi-Fi']?->id,
            $options['Climatisation']?->id,
        ]);

        // Abidjan - Marcory
        $bien3 = BienImmobilier::create([
            'title' => 'Studio meublé Marcory',
            'type' => 'studio',
            'description' => 'Studio confortable et bien équipé, idéal pour un séjour d\'affaires ou une courte durée.',
            'address' => 'Zone 4, Rue du 7 Décembre',
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
        $bien3->options()->sync([
            $options['Wi-Fi']?->id,
            $options['Climatisation']?->id,
        ]);

        // Abidjan - Treichville
        $bien4 = BienImmobilier::create([
            'title' => 'Maison coloniale Treichville',
            'type' => 'maison',
            'description' => 'Maison coloniale rénovée avec charme, 3 chambres, cour arborée, très calme.',
            'address' => 'Rue de la Paix, Treichville',
            'city' => 'Abidjan',
            'price_per_night' => 95000,
            'surface' => 180,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'capacity' => 6,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien4->options()->sync([
            $options['Jardin']?->id,
            $options['Garage']?->id,
            $options['Wi-Fi']?->id,
        ]);

        // Abidjan - Yopougon
        $bien5 = BienImmobilier::create([
            'title' => 'Villa avec piscine Yopougon',
            'type' => 'villa',
            'description' => 'Belle villa 5 chambres avec piscine privée, climatisation partout, très sécurisée.',
            'address' => 'Boulevard de l\'Université',
            'city' => 'Abidjan',
            'price_per_night' => 180000,
            'surface' => 420,
            'bedrooms' => 5,
            'bathrooms' => 4,
            'capacity' => 10,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien5->options()->sync([
            $options['Piscine']?->id,
            $options['Climatisation']?->id,
            $options['Wi-Fi']?->id,
            $options['Garage']?->id,
        ]);

        // Assinie - Bungalow plage
        $bien6 = BienImmobilier::create([
            'title' => 'Bungalow vue mer Assinie',
            'type' => 'bungalow',
            'description' => 'Magnifique bungalow les pieds dans le sable. Accès direct à la plage privée.',
            'address' => 'Plage d\'Assinie, km 0',
            'city' => 'Assinie',
            'price_per_night' => 200000,
            'surface' => 150,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'capacity' => 6,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien6->options()->sync([
            $options['Wi-Fi']?->id,
            $options['Climatisation']?->id,
        ]);

        // Assinie - Villa resort
        $bien7 = BienImmobilier::create([
            'title' => 'Villa resort Assinie',
            'type' => 'villa',
            'description' => 'Villa de luxe 4 chambres avec piscine infinie, climatisation centralisée, sécurité 24/7.',
            'address' => 'Route côtière Assinie',
            'city' => 'Assinie',
            'price_per_night' => 250000,
            'surface' => 500,
            'bedrooms' => 4,
            'bathrooms' => 4,
            'capacity' => 8,
            'status' => 'maintenance',
            'image_url' => 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien7->options()->sync([
            $options['Piscine']?->id,
            $options['Climatisation']?->id,
            $options['Wi-Fi']?->id,
            $options['Garage']?->id,
        ]);

        // Yamoussoukro
        $bien8 = BienImmobilier::create([
            'title' => 'Résidence Yamoussoukro',
            'type' => 'appartement',
            'description' => 'Résidence moderne 2 chambres près du centre ville, idéale pour les voyageurs d\'affaires.',
            'address' => 'Avenue de la Paix, Yamoussoukro',
            'city' => 'Yamoussoukro',
            'price_per_night' => 65000,
            'surface' => 100,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'capacity' => 4,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien8->options()->sync([
            $options['Wi-Fi']?->id,
            $options['Climatisation']?->id,
        ]);

        // Bouaké
        $bien9 = BienImmobilier::create([
            'title' => 'Maison confortable Bouaké',
            'type' => 'maison',
            'description' => 'Maison 3 chambres sécurisée avec petite cour. Bon accès aux routes principales.',
            'address' => 'Quartier Aadja, Bouaké',
            'city' => 'Bouaké',
            'price_per_night' => 50000,
            'surface' => 140,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'capacity' => 6,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien9->options()->sync([
            $options['Climatisation']?->id,
        ]);

        // Abidjan - Deux-Plateaux Vallons
        $bien10 = BienImmobilier::create([
            'title' => 'Penthouse Deux-Plateaux Vallons',
            'type' => 'penthouse',
            'description' => 'Magnifique penthouse avec terrasse panoramique, vue 360° sur Abidjan.',
            'address' => 'Immeuble Le Belvedere, Vallons',
            'city' => 'Abidjan',
            'price_per_night' => 220000,
            'surface' => 300,
            'bedrooms' => 3,
            'bathrooms' => 3,
            'capacity' => 6,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien10->options()->sync([
            $options['Wi-Fi']?->id,
            $options['Climatisation']?->id,
            $options['Garage']?->id,
        ]);

        // Abidjan - Koumassi
        $bien11 = BienImmobilier::create([
            'title' => 'Apartment familial Koumassi',
            'type' => 'appartement',
            'description' => 'Grand appartement 4 pièces avec balcon, près des écoles et commerces.',
            'address' => 'Avenue Charles de Gaulle, Koumassi',
            'city' => 'Abidjan',
            'price_per_night' => 75000,
            'surface' => 160,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'capacity' => 6,
            'status' => 'reserve',
            'image_url' => 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien11->options()->sync([
            $options['Climatisation']?->id,
            $options['Wi-Fi']?->id,
        ]);

        // Abidjan - Attécoubé
        $bien12 = BienImmobilier::create([
            'title' => 'Villa charmante Attécoubé',
            'type' => 'villa',
            'description' => 'Villa 3 chambres avec piscine privée et jardin aménagé. Très tranquille.',
            'address' => 'Rue de l\'Océan, Attécoubé',
            'city' => 'Abidjan',
            'price_per_night' => 110000,
            'surface' => 250,
            'bedrooms' => 3,
            'bathrooms' => 2,
            'capacity' => 6,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien12->options()->sync([
            $options['Piscine']?->id,
            $options['Jardin']?->id,
            $options['Wi-Fi']?->id,
        ]);

        // Abidjan - Vridi
        $bien13 = BienImmobilier::create([
            'title' => 'Bungalow Vridi Canal',
            'type' => 'bungalow',
            'description' => 'Petit bungalow de charme avec vue sur le canal de Vridi. Très calme.',
            'address' => 'Canal de Vridi, Zone portuaire',
            'city' => 'Abidjan',
            'price_per_night' => 55000,
            'surface' => 70,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'capacity' => 4,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien13->options()->sync([
            $options['Wi-Fi']?->id,
        ]);

        // Abidjan - Abobo
        $bien14 = BienImmobilier::create([
            'title' => 'Maison spacieuse Abobo',
            'type' => 'maison',
            'description' => 'Maison 4 chambres, cuisine moderne, cour privée, accès facile aux transports.',
            'address' => 'Rue de la Prospérité, Abobo',
            'city' => 'Abidjan',
            'price_per_night' => 85000,
            'surface' => 200,
            'bedrooms' => 4,
            'bathrooms' => 2,
            'capacity' => 8,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien14->options()->sync([
            $options['Garage']?->id,
            $options['Climatisation']?->id,
        ]);

        // Abidjan - Adjamé
        $bien15 = BienImmobilier::create([
            'title' => 'Studio centralisé Adjamé',
            'type' => 'studio',
            'description' => 'Studio cosy au cœur du centre-ville, parfait pour les courts séjours.',
            'address' => 'Rue du Marché Central, Adjamé',
            'city' => 'Abidjan',
            'price_per_night' => 35000,
            'surface' => 35,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'capacity' => 2,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien15->options()->sync([
            $options['Wi-Fi']?->id,
            $options['Climatisation']?->id,
        ]);

        // Assinie - Petite villa
        $bien16 = BienImmobilier::create([
            'title' => 'Petite villa Assinie Maison',
            'type' => 'villa',
            'description' => 'Villa 2 chambres dans le quartier touristique d\'Assinie, à 50m de la plage.',
            'address' => 'Rue Côtière, Assinie Maison',
            'city' => 'Assinie',
            'price_per_night' => 120000,
            'surface' => 120,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'capacity' => 4,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien16->options()->sync([
            $options['Climatisation']?->id,
            $options['Wi-Fi']?->id,
        ]);

        // Grand-Bassam
        $bien17 = BienImmobilier::create([
            'title' => 'Maison historique Grand-Bassam',
            'type' => 'maison',
            'description' => 'Maison coloniale authentique dans la vieille ville. Charme et histoire garantis.',
            'address' => 'Rue du Phare, Grand-Bassam',
            'city' => 'Grand-Bassam',
            'price_per_night' => 70000,
            'surface' => 130,
            'bedrooms' => 2,
            'bathrooms' => 2,
            'capacity' => 4,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien17->options()->sync([
            $options['Jardin']?->id,
        ]);

        // San-Pédro
        $bien18 = BienImmobilier::create([
            'title' => 'Villa San-Pédro Front de Mer',
            'type' => 'villa',
            'description' => 'Villa moderne avec vue directe sur l\'océan, piscine privée, sécurité 24/7.',
            'address' => 'Front de Mer, San-Pédro',
            'city' => 'San-Pédro',
            'price_per_night' => 160000,
            'surface' => 280,
            'bedrooms' => 4,
            'bathrooms' => 3,
            'capacity' => 8,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien18->options()->sync([
            $options['Piscine']?->id,
            $options['Climatisation']?->id,
            $options['Wi-Fi']?->id,
        ]);

        // Abidjan - Riviera Golf (Luxe)
        $bien19 = BienImmobilier::create([
            'title' => 'Palais Riviera Golf',
            'type' => 'villa',
            'description' => 'Superbe résidence ultra-luxe 6 chambres, 2 piscines, spa, cinéma maison.',
            'address' => 'Résidence Riviera Golf, Plot VIP',
            'city' => 'Abidjan',
            'price_per_night' => 500000,
            'surface' => 800,
            'bedrooms' => 6,
            'bathrooms' => 6,
            'capacity' => 12,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien19->options()->sync([
            $options['Piscine']?->id,
            $options['Climatisation']?->id,
            $options['Wi-Fi']?->id,
            $options['Garage']?->id,
            $options['Jardin']?->id,
        ]);

        // Abidjan - Économique
        $bien20 = BienImmobilier::create([
            'title' => 'Petit logement économique Yopougon',
            'type' => 'studio',
            'description' => 'Petite chambre indépendante avec coin cuisine, salle d\'eau. Pratique et abordable.',
            'address' => 'Rue Principale, Yopougon',
            'city' => 'Abidjan',
            'price_per_night' => 25000,
            'surface' => 25,
            'bedrooms' => 1,
            'bathrooms' => 1,
            'capacity' => 1,
            'status' => 'disponible',
            'image_url' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
            'agent_id' => $agent->id,
        ]);
        $bien20->options()->sync([
            $options['Climatisation']?->id,
        ]);
    }
}