<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Database\Seeder;

class PropertyImagesSeeder extends Seeder
{
    public function run(): void
    {
        // Images de test depuis Unsplash
        $imageGroups = [
            [
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=900&fit=crop',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=900&fit=crop',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&h=900&fit=crop',
            ],
            [
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=900&fit=crop',
                'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=900&fit=crop',
                'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&h=900&fit=crop',
            ],
            [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=900&fit=crop',
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=900&fit=crop',
                'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200&h=900&fit=crop',
            ],
        ];

        $properties = Property::all();
        
        foreach ($properties as $index => $property) {
            $imageSet = $imageGroups[$index % count($imageGroups)];
            
            foreach ($imageSet as $order => $imageUrl) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'url' => $imageUrl,
                    'order' => $order,
                ]);
            }
        }
    }
}
