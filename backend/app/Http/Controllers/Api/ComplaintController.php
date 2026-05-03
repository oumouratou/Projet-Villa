<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reclamation;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        if (($user->role ?? null) !== 'client') {
            return response()->json(['message' => 'Accès refusé. Seul un client peut déposer une réclamation.'], 403);
        }

        $client = $user->client;
        if (! $client) {
            return response()->json(['message' => 'Profil client introuvable.'], 422);
        }

        $payload = $request->validate([
            'reservation_id' => ['required', 'integer', 'exists:reservations,id'],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
        ]);

        /** @var Reservation $reservation */
        $reservation = Reservation::query()->findOrFail($payload['reservation_id']);

        // A client can only file a complaint for their own reservation
        if ((int) $reservation->client_id !== (int) $client->id) {
            return response()->json(['message' => 'Accès refusé. Cette réservation ne vous appartient pas.'], 403);
        }

        $complaint = Reclamation::create([
            'reservation_id' => $reservation->id,
            'client_id' => $client->id,
            'sujet' => $payload['subject'],
            'message' => $payload['description'],
            'statut' => 'ouverte',
            'agent_id' => $reservation->agent_id,
        ]);

        return response()->json([
            'data' => $complaint->load([
                'client:id,user_id,phone,address',
                'client.user:id,first_name,last_name,name,email',
                'reservation:id,bien_immobilier_id,date_debut,date_fin,statut,total_price',
                'reservation.bien:id,title,city,address',
                'agent:id,name,email,role,status',
            ]),
        ], 201);
    }
}