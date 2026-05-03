<?php

namespace App\Http\Controllers;

use App\Models\BienImmobilier;
use Illuminate\Http\Request;

class BienImmobilierController extends Controller
{
    public function index()
    {
        $biens = BienImmobilier::query()
            ->with(['options'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $biens->map(fn (BienImmobilier $bien) => $this->serializeBien($bien))->values(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'description' => 'required|string',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'price_per_night' => 'required|numeric|min:0',
            'surface' => 'required|integer|min:0',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'capacity' => 'required|integer|min:0',
            'status' => 'required|string|max:50',
            'image_url' => 'nullable|string|max:2048',
            'agent_id' => 'required|exists:users,id',
        ]);

        $bien = BienImmobilier::create($request->only([
            'title',
            'type',
            'description',
            'address',
            'city',
            'price_per_night',
            'surface',
            'bedrooms',
            'bathrooms',
            'capacity',
            'status',
            'image_url',
            'agent_id',
        ]));

        return response()->json([
            'data' => $this->serializeBien($bien->load('options')),
        ], 201);
    }

    public function show(BienImmobilier $bien)
    {
        return response()->json([
            'data' => $this->serializeBien($bien->load('options')),
        ]);
    }

    public function update(Request $request, BienImmobilier $bien)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|required|string',
            'address' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'price_per_night' => 'sometimes|required|numeric|min:0',
            'surface' => 'sometimes|required|integer|min:0',
            'bedrooms' => 'sometimes|required|integer|min:0',
            'bathrooms' => 'sometimes|required|integer|min:0',
            'capacity' => 'sometimes|required|integer|min:0',
            'status' => 'sometimes|required|string|max:50',
            'image_url' => 'nullable|string|max:2048',
            'agent_id' => 'sometimes|required|exists:users,id',
        ]);

        $bien->update($request->only([
            'title',
            'type',
            'description',
            'address',
            'city',
            'price_per_night',
            'surface',
            'bedrooms',
            'bathrooms',
            'capacity',
            'status',
            'image_url',
            'agent_id',
        ]));

        return response()->json([
            'data' => $this->serializeBien($bien->fresh()->load('options')),
        ]);
    }

    public function destroy(BienImmobilier $bien)
    {
        $bien->delete();

        return response()->json(['data' => true], 200);
    }

    private function serializeBien(BienImmobilier $bien): array
    {
        $images = [];
        if (!empty($bien->image_url)) {
            $images[] = $bien->image_url;
        }

        return [
            'id' => $bien->id,
            'title' => $bien->title,
            'type' => $bien->type,
            'description' => $bien->description,
            'address' => $bien->address,
            'city' => $bien->city,
            'postal_code' => null,
            'price' => (float) $bien->price_per_night,
            'price_per_night' => (float) $bien->price_per_night,
            'surface' => (int) $bien->surface,
            'bedrooms' => (int) $bien->bedrooms,
            'bathrooms' => (int) $bien->bathrooms,
            'capacity' => (int) $bien->capacity,
            'status' => $bien->status,
            'images' => $images,
            'options' => $bien->relationLoaded('options') ? $bien->options->map(fn ($o) => [
                'id' => $o->id,
                'name' => $o->name,
            ])->values() : [],
            'agent_id' => $bien->agent_id,
            'created_at' => optional($bien->created_at)->toISOString(),
        ];
    }
}
