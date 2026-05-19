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
        $openComplaints = (clone $complaintsQuery)->whereIn('statut', ['ouverte', 'en_cours', 'en_attente'])->count();

        $dbNotifications = $user->notifications()->limit(15)->get();
        $notifications = [];

        foreach ($dbNotifications as $notif) {
            $data = $notif->data;
            
            $notifications[] = [
                'id' => $notif->id,
                'db_id' => $notif->id,
                'type' => $data['type'] ?? 'info',
                'message' => $data['message'] ?? 'Nouvelle notification',
                'status' => $data['status'] ?? null,
                'subject' => $data['subject'] ?? null,
                'reservation_id' => $data['reservation_id'] ?? null,
                'reclamation_id' => $data['reclamation_id'] ?? null,
                'time' => $notif->created_at?->toISOString(),
                'unread' => is_null($notif->read_at),
            ];
        }

        $unreadCount = $user->unreadNotifications()->count();

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
