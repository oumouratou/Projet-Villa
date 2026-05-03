<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    /**
     * Get all properties with optional filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Property::with([
            'options:id,name,icon',
            'agent:id,name,email,role,status',
            'propertyImages:id,property_id,url,order'
        ]);

        // Filter by city
        if ($request->has('city') && $request->input('city') !== '') {
            $query->where('city', $request->input('city'));
        }

        // Filter by status
        if ($request->has('status') && $request->input('status') !== '') {
            $query->where('status', $request->input('status'));
        }

        // Filter by type
        if ($request->has('type') && $request->input('type') !== '') {
            $query->where('type', $request->input('type'));
        }

        // Filter by price range
        if ($request->has('minPrice')) {
            $query->where('price_per_night', '>=', (int) $request->input('minPrice'));
        }
        if ($request->has('maxPrice')) {
            $query->where('price_per_night', '<=', (int) $request->input('maxPrice'));
        }

        // Filter by bedrooms
        if ($request->has('bedrooms')) {
            $query->where('bedrooms', '>=', (int) $request->input('bedrooms'));
        }

        // Search
        if ($request->has('search') && $request->input('search') !== '') {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->input('sortBy', 'newest');
        match ($sortBy) {
            'price-asc' => $query->orderBy('price_per_night', 'asc'),
            'price-desc' => $query->orderBy('price_per_night', 'desc'),
            'oldest' => $query->orderBy('created_at', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $data = $query->get();

        return response()->json(['data' => $data]);
    }

    /**
     * Store a newly created property
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Only admin and agent can create properties
        if (!$user || !in_array($user->role, ['admin', 'agent'])) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:villa,appartement,studio,maison',
            'description' => 'required|string',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'price_per_night' => 'required|integer|min:0',
            'surface' => 'required|integer|min:0',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|string|in:disponible,reserve,maintenance',
            'image_url' => 'nullable|string',
            'options' => 'nullable|array',
            'options.*' => 'integer|exists:property_options,id',
        ]);

        $validated['agent_id'] = $user->id;

        $property = Property::create($validated);

        if (!empty($validated['options'])) {
            $property->options()->attach($validated['options']);
        }

        return response()->json([
            'message' => 'Propriété créée avec succès.',
            'data' => $property->load(['options:id,name,icon', 'agent:id,name,email'])
        ], 201);
    }

    /**
     * Display the specified property
     */
    public function show(Property $property): JsonResponse
    {
        return response()->json([
            'data' => $property->load([
                'options:id,name,icon',
                'agent:id,name,email,role,status',
                'propertyImages:id,property_id,url,order'
            ]),
        ]);
    }

    /**
     * Update the specified property
     */
    public function update(Request $request, Property $property): JsonResponse
    {
        $user = $request->user();

        // Only admin and the property's agent can update
        if (!$user || ($user->role === 'agent' && $property->agent_id !== $user->id && $user->role !== 'admin')) {
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:villa,appartement,studio,maison',
            'description' => 'sometimes|string',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'price_per_night' => 'sometimes|integer|min:0',
            'surface' => 'sometimes|integer|min:0',
            'bedrooms' => 'sometimes|integer|min:0',
            'bathrooms' => 'sometimes|integer|min:0',
            'capacity' => 'sometimes|integer|min:1',
            'status' => 'sometimes|string|in:disponible,reserve,maintenance',
            'image_url' => 'nullable|string',
            'options' => 'nullable|array',
            'options.*' => 'integer|exists:property_options,id',
        ]);

        $property->update($validated);

        if (isset($validated['options'])) {
            $property->options()->sync($validated['options']);
        }

        return response()->json([
            'message' => 'Propriété mise à jour avec succès.',
            'data' => $property->load(['options:id,name,icon', 'agent:id,name,email'])
        ]);
    }

    /**
     * Delete the specified property
     */
    public function destroy(Request $request, Property $property): JsonResponse
    {
        $user = $request->user();

        // Only admin and the property's agent can delete
        if (!$user || ($user->role === 'agent' && $property->agent_id !== $user->id && $user->role !== 'admin')) {
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }
        }

        $property->delete();

        return response()->json(['message' => 'Propriété supprimée avec succès.']);
    }

    /**
     * Get property statistics
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user?->role ?? '';

        $query = Property::query();
        
        if ($role === 'agent') {
            $query->where('agent_id', $user->id);
        }

        $stats = [
            'total' => (clone $query)->count(),
            'available' => (clone $query)->where('status', 'disponible')->count(),
            'reserved' => (clone $query)->where('status', 'reserve')->count(),
            'maintenance' => (clone $query)->where('status', 'maintenance')->count(),
            'averagePrice' => (int) (clone $query)->avg('price_per_night') ?? 0,
        ];

        return response()->json(['data' => $stats]);
    }
}
