<?php

namespace App\Http\Controllers;

use App\Models\BienImmobilier;
use App\Models\Reservation;
use App\Notifications\ReservationStatusNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    public function index()
    {
        $user = request()->user();
        $isClient = $this->userHasRole($user, 'client');
        $isAgent = $this->userHasRole($user, 'agent');

        $query = Reservation::query()
            ->with([
                'bien:id,title,city,price_per_night,agent_id',
                'client:id,user_id,phone,address',
                'client.user:id,first_name,last_name,name,email',
                'agent:id,name,email,status',
            ])
            ->orderByDesc('created_at');

        if ($isClient && $user?->client) {
            $query->where('client_id', $user->client->id);
        } elseif ($isAgent && $user) {
            $query->where(function ($subQuery) use ($user) {
                $subQuery->where('agent_id', $user->id)->orWhereNull('agent_id');
            });
        }

        return response()->json([
            'data' => $query->get()->map(fn (Reservation $r) => $this->serializeReservation($r))->values(),
        ]);
    }

    public function store(Request $request)
    {
        if (! $request->user()) {
            return response()->json(['message' => 'Authentification requise pour réserver ce bien.'], 401);
        }

        $payload = $request->validate([
            'property_id'        => 'nullable|integer|exists:bien_immobiliers,id',
            'bien_immobilier_id' => 'nullable|integer|exists:bien_immobiliers,id',
            'start_date'         => 'nullable|date',
            'end_date'           => 'nullable|date',
            'date_debut'         => 'nullable|date',
            'date_fin'           => 'nullable|date',
            'client_id'          => 'nullable|integer|exists:clients,id',
            'statut'             => 'nullable|string|max:50',
            'commentaire_agent'  => 'nullable|string',
            'guest_name'         => 'nullable|string|max:255',
            'guest_email'        => 'nullable|email|max:255',
            'guest_phone'        => 'nullable|string|max:50',
        ]);

        $bienId = $payload['property_id'] ?? $payload['bien_immobilier_id'] ?? null;
        if (! $bienId) {
            return response()->json(['message' => 'Le bien est requis.'], 422);
        }

        $startRaw = $payload['start_date'] ?? $payload['date_debut'] ?? null;
        $endRaw   = $payload['end_date']   ?? $payload['date_fin']   ?? null;
        if (! $startRaw || ! $endRaw) {
            return response()->json(['message' => 'Les dates de début et de fin sont requises.'], 422);
        }

        $start = Carbon::parse($startRaw)->startOfDay();
        $end   = Carbon::parse($endRaw)->startOfDay();
        if ($end->lessThanOrEqualTo($start)) {
            return response()->json(['message' => 'La date de fin doit être après la date de début.'], 422);
        }

        $nights = $start->diffInDays($end);
        if ($nights < 1) {
            return response()->json(['message' => 'La période doit contenir au moins 1 nuit.'], 422);
        }

        $bien = BienImmobilier::query()->findOrFail($bienId);
        if (($bien->status ?? 'disponible') !== 'disponible') {
            return response()->json(['message' => 'Ce bien n\'est pas disponible.'], 422);
        }

        $hasOverlap = Reservation::query()
            ->where('bien_immobilier_id', $bien->id)
            ->whereIn('statut', ['en_attente', 'confirmee'])
            ->where(function ($query) use ($start, $end) {
                $query->where('date_debut', '<', $end->toDateString())
                      ->where('date_fin', '>', $start->toDateString());
            })->exists();

        if ($hasOverlap) {
            return response()->json(['message' => 'Ce bien est déjà réservé sur ces dates.'], 422);
        }

        $clientId = $payload['client_id'] ?? optional($request->user()?->client)->id;
        if (! $clientId) {
            return response()->json(['message' => 'Votre compte client est requis pour finaliser la réservation.'], 422);
        }

        $reservation = Reservation::create([
            'client_id'          => $clientId,
            'agent_id'           => $bien->agent_id,
            'guest_name'         => null,
            'guest_email'        => null,
            'guest_phone'        => null,
            'bien_immobilier_id' => $bien->id,
            'date_debut'         => $start->toDateString(),
            'date_fin'           => $end->toDateString(),
            'statut'             => $payload['statut'] ?? 'en_attente',
            'commentaire_agent'  => $payload['commentaire_agent'] ?? null,
        ]);

        return response()->json(['data' => $this->serializeReservation($reservation)], 201);
    }

    public function show(Reservation $reservation)
    {
        $this->authorizeReservationAccess($reservation);
        $reservation->load([
            'bien:id,title,city,price_per_night,agent_id',
            'client:id,user_id,phone,address',
            'client.user:id,first_name,last_name,name,email',
            'agent:id,name,email,status',
        ]);
        return response()->json(['data' => $this->serializeReservation($reservation)]);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $payload = $request->validate([
            'client_id'          => 'sometimes|nullable|integer|exists:clients,id',
            'bien_immobilier_id' => 'sometimes|required|integer|exists:bien_immobiliers,id',
            'agent_id'           => 'sometimes|nullable|integer|exists:users,id',
            'date_debut'         => 'sometimes|required|date',
            'date_fin'           => 'sometimes|required|date|after:date_debut',
            'statut'             => 'sometimes|required|in:en_attente,confirmee,refusee,annulee',
            'commentaire_agent'  => 'nullable|string',
            'status'             => 'sometimes|in:en_attente,confirmee,refusee,annulee',
            'guest_name'         => 'sometimes|nullable|string|max:255',
            'guest_email'        => 'sometimes|nullable|email|max:255',
            'guest_phone'        => 'sometimes|nullable|string|max:50',
        ]);

        // Accepter "status" envoyé par le frontend Vue
        if (isset($payload['status']) && ! isset($payload['statut'])) {
            $payload['statut'] = $payload['status'];
            unset($payload['status']);
        }

        $user = $request->user();
        if ($user && $this->userHasRole($user, 'agent')) {
            $this->authorizeReservationAccess($reservation);
            $payload = array_intersect_key($payload, array_flip(['statut', 'commentaire_agent']));
        }

        $oldStatut = $reservation->statut;
        $reservation->update($payload);

        $reservation->load([
            'bien:id,title,city,price_per_night,agent_id',
            'client:id,user_id,phone,address',
            'client.user:id,first_name,last_name,name,email',
            'agent:id,name,email,status',
        ]);

        // Notification email si statut changé
        if (isset($payload['statut']) && $payload['statut'] !== $oldStatut) {
            $clientUser = $reservation->client?->user;
            if ($clientUser) {
                try {
                    $clientUser->notify(new ReservationStatusNotification($reservation));
                } catch (\Throwable $e) {
                    Log::warning('Notification email failed: ' . $e->getMessage());
                }
            }
        }

        return response()->json(['data' => $this->serializeReservation($reservation->fresh())]);
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(['data' => true], 200);
    }

    private function serializeReservation(Reservation $reservation): array
    {
        $bien       = $reservation->relationLoaded('bien') ? $reservation->bien : BienImmobilier::query()->find($reservation->bien_immobilier_id);
        $client     = $reservation->relationLoaded('client') ? $reservation->client : null;
        $clientUser = $client?->relationLoaded('user') ? $client->user : null;
        $start      = $reservation->date_debut ? Carbon::parse($reservation->date_debut)->startOfDay() : null;
        $end        = $reservation->date_fin   ? Carbon::parse($reservation->date_fin)->startOfDay()   : null;
        $nights     = ($start && $end) ? $start->diffInDays($end) : 0;
        $totalPrice = $bien ? (int) $nights * (int) ($bien->price_per_night ?? 0) : 0;

        return [
            'id'                 => $reservation->id,
            'client_id'          => $reservation->client_id,
            'clientId'           => $reservation->client_id,
            'agent_id'           => $reservation->agent_id,
            'agentId'            => $reservation->agent_id,
            'guest_name'         => $reservation->guest_name,
            'guest_email'        => $reservation->guest_email,
            'guest_phone'        => $reservation->guest_phone,
            'bien_immobilier_id' => $reservation->bien_immobilier_id,
            'property_id'        => $reservation->bien_immobilier_id,
            'propertyId'         => $reservation->bien_immobilier_id,
            'date_debut'         => $reservation->date_debut?->toDateString(),
            'start_date'         => $reservation->date_debut?->toDateString(),
            'startDate'          => $reservation->date_debut?->toDateString(),
            'date_fin'           => $reservation->date_fin?->toDateString(),
            'end_date'           => $reservation->date_fin?->toDateString(),
            'endDate'            => $reservation->date_fin?->toDateString(),
            'statut'             => $reservation->statut,
            'status'             => $reservation->statut,
            'commentaire_agent'  => $reservation->commentaire_agent,
            'agent_comment'      => $reservation->commentaire_agent,
            'agentComment'       => $reservation->commentaire_agent,
            'agent'  => $reservation->relationLoaded('agent') ? $reservation->agent : null,
            'client' => $client ? [
                'id'         => $client->id,
                'user_id'    => $client->user_id,
                'phone'      => $client->phone,
                'address'    => $client->address,
                'name'       => $clientUser?->name ?? trim(($clientUser?->first_name ?? '') . ' ' . ($clientUser?->last_name ?? '')),
                'email'      => $clientUser?->email,
                'first_name' => $clientUser?->first_name,
                'last_name'  => $clientUser?->last_name,
            ] : null,
            'property' => $bien ? [
                'id'              => $bien->id,
                'title'           => $bien->title,
                'city'            => $bien->city,
                'price_per_night' => $bien->price_per_night,
                'pricePerNight'   => $bien->price_per_night,
                'images'          => $bien->images ?? [],
                'surface'         => $bien->surface,
                'bedrooms'        => $bien->bedrooms,
                'bathrooms'       => $bien->bathrooms,
                'address'         => $bien->address,
            ] : null,
            'totalPrice'  => $totalPrice,
            'total_price' => $totalPrice,
            'created_at'  => optional($reservation->created_at)->toISOString(),
        ];
    }

    private function authorizeReservationAccess(Reservation $reservation): void
    {
        $user = request()->user();
        if ($this->userHasRole($user, 'client') && (! $user?->client || (int) $reservation->client_id !== (int) $user->client->id)) {
            abort(response()->json(['message' => 'Accès refusé.'], 403));
        }
        if ($this->userHasRole($user, 'agent') && $user && $reservation->agent_id !== null && (int) $reservation->agent_id !== (int) $user->id) {
            abort(response()->json(['message' => 'Accès refusé.'], 403));
        }
    }

    private function userHasRole($user, string $role): bool
    {
        if (! $user) {
            return false;
        }

        // Compatibilite avec un ancien schema qui stockait un role direct sur users.
        if (isset($user->role) && is_string($user->role) && $user->role !== '') {
            return $user->role === $role;
        }

        $user->loadMissing('roles');

        return $user->roles->contains('name', $role);
    }
}