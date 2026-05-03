<?php

namespace App\Http\Controllers;

use App\Models\Reclamation;
use App\Models\Reservation;
use App\Notifications\ReclamationResponseNotification;
use Illuminate\Http\Request;

class ReclamationController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $role = (string) ($user?->role ?? '');

        $query = Reclamation::query()
            ->with([
                'client:id,user_id,phone,address',
                'client.user:id,first_name,last_name,name,email',
                'reservation:id,client_id,bien_immobilier_id,date_debut,date_fin,statut',
                'reservation.bien:id,title,city,price_per_night',
                'agent:id,name,email,role,status',
            ])
            ->orderByDesc('created_at');

        if ($role === 'client' && $user?->client) {
            $query->where('client_id', $user->client->id);
        } elseif ($role === 'agent' && $user) {
            $query->where(function ($subQuery) use ($user) {
                $subQuery->where('agent_id', $user->id)->orWhereNull('agent_id');
            });
        }

        return response()->json([
            'data' => $query->get()->map(fn (Reclamation $r) => $this->serializeReclamation($r))->values(),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Authentification requise pour déposer une réclamation.'], 401);
        }

        $payload = $request->validate([
            'reservation_id' => 'required|integer|exists:reservations,id',
            'subject'        => 'required_without:sujet|string|max:255',
            'description'    => 'required_without:message|string|max:5000',
            'sujet'          => 'required_without:subject|string|max:255',
            'message'        => 'required_without:description|string|max:5000',
            'statut'         => 'nullable|in:ouverte,en_cours,traitee,fermee',
        ]);

        $reservation = Reservation::query()->findOrFail($payload['reservation_id']);

        $client = $user->client ?? null;
        if (! $client || $reservation->client_id !== $client->id) {
            return response()->json(['message' => 'Accès refusé. Vous devez être le client ayant effectué la réservation.'], 403);
        }

        $subject     = $payload['subject']     ?? $payload['sujet'];
        $description = $payload['description'] ?? $payload['message'];

        $reclamation = Reclamation::create([
            'client_id'      => $client->id,
            'reservation_id' => $reservation->id,
            'agent_id'       => $reservation->agent_id,
            'sujet'          => $subject,
            'message'        => $description,
            'statut'         => $payload['statut'] ?? 'ouverte',
        ]);

        $reclamation->load([
            'client:id,user_id,phone,address',
            'client.user:id,first_name,last_name,name,email',
            'reservation:id,client_id,bien_immobilier_id,date_debut,date_fin,statut',
            'reservation.bien:id,title,city,price_per_night',
            'agent:id,name,email,role,status',
        ]);

        return response()->json([
            'data' => $this->serializeReclamation($reclamation),
        ], 201);
    }

    public function show(Reclamation $reclamation)
    {
        $reclamation->load([
            'client:id,user_id,phone,address',
            'client.user:id,first_name,last_name,name,email',
            'reservation:id,client_id,bien_immobilier_id,date_debut,date_fin,statut',
            'reservation.bien:id,title,city,price_per_night',
            'agent:id,name,email,role,status',
        ]);

        return response()->json([
            'data' => $this->serializeReclamation($reclamation),
        ]);
    }

    public function update(Request $request, Reclamation $reclamation)
    {
        $payload = $request->validate([
            'client_id'      => 'sometimes|nullable|exists:clients,id',
            'reservation_id' => 'sometimes|nullable|exists:reservations,id',
            'agent_id'       => 'sometimes|nullable|exists:users,id',
            'subject'        => 'sometimes|required|string|max:255',
            'description'    => 'sometimes|required|string|max:5000',
            'sujet'          => 'sometimes|required|string|max:255',
            'message'        => 'sometimes|required|string|max:5000',
            'statut'         => 'sometimes|required|in:ouverte,en_cours,traitee,fermee',
            'agent_response' => 'sometimes|nullable|string|max:5000',
        ]);

        if (isset($payload['subject'])) {
            $payload['sujet'] = $payload['subject'];
            unset($payload['subject']);
        }
        if (isset($payload['description'])) {
            $payload['message'] = $payload['description'];
            unset($payload['description']);
        }

        $reclamation->update($payload);

        $reclamation->load([
            'client:id,user_id,phone,address',
            'client.user:id,first_name,last_name,name,email',
            'reservation:id,client_id,bien_immobilier_id,date_debut,date_fin,statut',
            'reservation.bien:id,title,city,price_per_night',
            'agent:id,name,email,role,status',
        ]);

        // Notification email au client si réponse agent ajoutée
        if (isset($payload['agent_response']) && $payload['agent_response']) {
            $clientUser = $reclamation->client?->user;
            if ($clientUser) {
                try {
                    $clientUser->notify(new ReclamationResponseNotification($reclamation));
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning('Notification email failed: ' . $e->getMessage());
                }
            }
        }

        return response()->json([
            'data' => $this->serializeReclamation($reclamation),
        ]);
    }

    public function destroy(Reclamation $reclamation)
    {
        $reclamation->delete();
        return response()->json(null, 204);
    }

    private function serializeReclamation(Reclamation $reclamation): array
    {
        return [
            'id'             => $reclamation->id,
            'client_id'      => $reclamation->client_id,
            'clientId'       => $reclamation->client_id,
            'reservation_id' => $reclamation->reservation_id,
            'reservationId'  => $reclamation->reservation_id,
            'agent_id'       => $reclamation->agent_id,
            'agentId'        => $reclamation->agent_id,
            'subject'        => $reclamation->sujet,
            'description'    => $reclamation->message,
            'sujet'          => $reclamation->sujet,
            'message'        => $reclamation->message,
            'statut'         => $reclamation->statut,
            'status'         => $reclamation->statut,
            'agent_response' => $reclamation->agent_response,
            'agentResponse'  => $reclamation->agent_response,
            'client' => $reclamation->relationLoaded('client') ? [
                'id'         => $reclamation->client->id,
                'user_id'    => $reclamation->client->user_id,
                'phone'      => $reclamation->client->phone,
                'address'    => $reclamation->client->address,
                'name'       => $reclamation->client->relationLoaded('user')
                    ? ($reclamation->client->user->name ?? trim(($reclamation->client->user->first_name ?? '') . ' ' . ($reclamation->client->user->last_name ?? '')))
                    : null,
                'email'      => $reclamation->client->relationLoaded('user') ? $reclamation->client->user->email : null,
                'first_name' => $reclamation->client->relationLoaded('user') ? $reclamation->client->user->first_name : null,
                'last_name'  => $reclamation->client->relationLoaded('user') ? $reclamation->client->user->last_name : null,
            ] : null,
            'reservation' => $reclamation->relationLoaded('reservation') ? $reclamation->reservation : null,
            'agent'       => $reclamation->relationLoaded('agent') ? $reclamation->agent : null,
            'created_at'  => optional($reclamation->created_at)->toISOString(),
        ];
    }
}