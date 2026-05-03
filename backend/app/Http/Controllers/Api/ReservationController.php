<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BienImmobilier;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        if (($user->role ?? null) !== 'client') {
            return response()->json(['message' => 'Accès refusé. Seul un client peut réserver.'], 403);
        }

        $client = $user->client;
        if (! $client) {
            return response()->json(['message' => 'Profil client introuvable.'], 422);
        }

        $payload = $request->validate([
            'property_id' => ['required', 'integer', 'exists:biens,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
        ]);

        /** @var BienImmobilier $property */
        $property = BienImmobilier::query()->findOrFail($payload['property_id']);

        if (($property->status ?? 'disponible') !== 'disponible') {
            return response()->json(['message' => 'Ce bien n\'est pas disponible.'], 422);
        }

        $start = Carbon::parse($payload['start_date'])->startOfDay();
        $end = Carbon::parse($payload['end_date'])->startOfDay();
        $nights = $start->diffInDays($end);

        if ($nights < 1) {
            return response()->json(['message' => 'La période doit contenir au moins 1 nuit.'], 422);
        }

        $hasOverlap = Reservation::query()
            ->where('bien_immobilier_id', $property->id)
            ->whereIn('statut', ['en_attente', 'confirmee'])
            ->where(function ($query) use ($start, $end) {
                $query
                    ->where('date_debut', '<=', $end->toDateString())
                    ->where('date_fin', '>=', $start->toDateString());
            })
            ->exists();

        if ($hasOverlap) {
            return response()->json(['message' => 'Ce bien est déjà réservé sur ces dates.'], 422);
        }

        $totalPrice = (int) $nights * (int) ($property->price_per_night ?? 0);

        $reservation = Reservation::create([
            'bien_immobilier_id' => $property->id,
            'client_id' => $client->id,
            'date_debut' => $start->toDateString(),
            'date_fin' => $end->toDateString(),
            'statut' => 'en_attente',
            'total_price' => $totalPrice,
            'commentaire_agent' => null,
            'agent_id' => $client->agent_id ?? $property->agent_id,
        ]);

        return response()->json([
            'data' => $reservation->load([
                'bien',
                'client',
                'agent',
            ]),
        ], 201);
    }
}