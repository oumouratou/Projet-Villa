<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reclamation;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        $role = (string) ($user->role ?? '');
        $clientId = is_numeric($user->client?->id ?? null) ? (int) $user->client->id : null;

        $reservationsQuery = Reservation::query();
        if ($role === 'client') {
            $reservationsQuery->where('client_id', $clientId ?? 0);
        } elseif ($role === 'agent') {
            $reservationsQuery->where(function ($query) use ($user) {
                $query->where('agent_id', $user->id)->orWhereNull('agent_id');
            });
        }

        $complaintsQuery = Reclamation::query();
        if ($role === 'client') {
            $complaintsQuery->where('client_id', $clientId ?? 0);
        } elseif ($role === 'agent') {
            $complaintsQuery->where(function ($query) use ($user) {
                $query->where('agent_id', $user->id)->orWhereNull('agent_id');
            });
        }

        $pendingReservations = (clone $reservationsQuery)->where('statut', 'en_attente')->count();
        $openComplaints = (clone $complaintsQuery)->whereIn('statut', ['ouverte', 'en_cours'])->count();

        $latestReservations = (clone $reservationsQuery)
            ->with(['bien:id,title,city'])
            ->orderByDesc('id')
            ->limit(5)
            ->get(['id', 'bien_immobilier_id', 'statut', 'created_at']);

        $latestComplaints = (clone $complaintsQuery)
            ->with(['reservation:id,bien_immobilier_id', 'reservation.bien:id,title,city'])
            ->orderByDesc('id')
            ->limit(5)
            ->get(['id', 'reservation_id', 'sujet', 'statut', 'created_at']);

        $notifications = [];

        foreach ($latestReservations as $reservation) {
            $propertyTitle = $reservation->bien?->title;
            $message = $propertyTitle
                ? "Nouvelle reservation: {$propertyTitle}"
                : "Nouvelle reservation #{$reservation->id}";

            $notifications[] = [
                'id' => (int) $reservation->id,
                'type' => 'reservation',
                'message' => $message,
                'status' => (string) $reservation->statut,
                'time' => $reservation->created_at?->toISOString(),
                'unread' => (string) $reservation->statut === 'en_attente',
            ];
        }

        foreach ($latestComplaints as $complaint) {
            $propertyTitle = $complaint->reservation?->bien?->title;
            $message = $propertyTitle
                ? "Nouvelle reclamation: {$propertyTitle}"
                : "Nouvelle reclamation #{$complaint->id}";

            $notifications[] = [
                'id' => (int) $complaint->id,
                'type' => 'complaint',
                'message' => $message,
                'subject' => (string) $complaint->sujet,
                'status' => (string) $complaint->statut,
                'time' => $complaint->created_at?->toISOString(),
                'unread' => in_array((string) $complaint->statut, ['ouverte', 'en_cours'], true),
            ];
        }

        usort($notifications, function (array $a, array $b) {
            $ta = $a['time'] ?? '';
            $tb = $b['time'] ?? '';
            return strcmp((string) $tb, (string) $ta);
        });

        $notifications = array_slice($notifications, 0, 7);
        $unreadCount = count(array_filter($notifications, fn (array $item) => (bool) ($item['unread'] ?? false)));

        return response()->json([
            'data' => [
                'pendingReservations' => $pendingReservations,
                'openComplaints' => $openComplaints,
                'unreadCount' => $unreadCount,
                'notifications' => $notifications,
            ],
        ]);
    }
}
