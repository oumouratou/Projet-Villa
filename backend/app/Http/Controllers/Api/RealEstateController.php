<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BienImmobilier;
use App\Models\Client;
use App\Models\Option;
use App\Models\Reservation;
use App\Models\Reclamation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RealEstateController extends Controller
{
    private function currentRole(Request $request): string
    {
        return (string) ($request->user()?->role ?? '');
    }

    private function currentClientId(Request $request): ?int
    {
        $user = $request->user();
        $clientId = $user?->client?->id;
        return is_numeric($clientId) ? (int) $clientId : null;
    }

    public function dashboardStats(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $this->currentRole($request);

        $reservationsQuery = Reservation::query();
        if ($role === 'client') {
            $clientId = $this->currentClientId($request);
            $reservationsQuery->where('client_id', $clientId ?? 0);
        } elseif ($role === 'agent' && $user) {
            $reservationsQuery->where(function ($query) use ($user) {
                $query->where('agent_id', $user->id)->orWhereNull('agent_id');
            });
        }

        $totalReservations = (clone $reservationsQuery)->count();
        $pendingReservations = (clone $reservationsQuery)->where('statut', 'en_attente')->count();
        $totalProperties = BienImmobilier::count();

        $stats = [
            'totalProperties' => $totalProperties,
            'totalReservations' => $totalReservations,
            'pendingReservations' => $pendingReservations,
            'totalClients' => $role === 'client' ? 1 : Client::count(),
            'totalRevenue' => 0,
            'occupancyRate' => 0,
        ];

        return response()->json(['data' => $stats]);
    }

    public function properties(): JsonResponse
    {
        $data = BienImmobilier::with([
            'options:id,name,icon',
            'agent:id,name,email,status',
            'propertyImages:id,property_id,url,order'
        ])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $data]);
    }

    public function propertyShow(BienImmobilier $property): JsonResponse
    {
        return response()->json([
            'data' => $property->load([
                'options:id,name,icon',
                'agent:id,name,email,status',
                'propertyImages:id,property_id,url,order'
            ]),
        ]);
    }

    public function clients(): JsonResponse
    {
        $role = (string) (request()->user()?->role ?? '');
        if ($role === 'client') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $data = Client::with(['agent:id,name,email,status'])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $data]);
    }

    public function clientShow(Client $client): JsonResponse
    {
        $role = (string) (request()->user()?->role ?? '');
        if ($role === 'client') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return response()->json([
            'data' => $client->load([
                'agent:id,name,email,status',
                'reservations.property:id,title,city,price_per_night,image_url',
                'reservations.agent:id,name,email,status',
                'complaints.reservation.property:id,title,city',
                'complaints.agent:id,name,email,status',
            ]),
        ]);
    }

    public function users(): JsonResponse
    {
        $roleOfRequester = (string) (request()->user()?->role ?? '');
        if ($roleOfRequester === 'client') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $query = User::query()->select(['id', 'name', 'email', 'phone', 'status', 'created_at'])
            ->with(['roles:id,name']);

        $role = request()->query('role');
        if (is_string($role) && $role !== '') {
            $query->whereHas('roles', function ($subQuery) use ($role) {
                $subQuery->where('name', $role);
            });
        }

        return response()->json(['data' => $query->orderByDesc('id')->get()]);
    }

    public function userShow(User $user): JsonResponse
    {
        $role = (string) (request()->user()?->role ?? '');
        if ($role === 'client') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return response()->json(['data' => $user]);
    }

    public function reservations(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $this->currentRole($request);

        $query = Reservation::with([
            'property:id,title,city,price_per_night',
            'client:id,first_name,last_name,email,phone',
            'agent:id,name,email,status',
        ])->orderByDesc('id');

        if ($role === 'client') {
            $clientId = $this->currentClientId($request);
            $query->where('client_id', $clientId ?? 0);
        } elseif ($role === 'agent' && $user) {
            $query->where(function ($q) use ($user) {
                $q->where('agent_id', $user->id)->orWhereNull('agent_id');
            });
        }

        $data = $query->get();

        return response()->json(['data' => $data]);
    }

    public function reservationShow(Request $request, Reservation $reservation): JsonResponse
    {
        $user = $request->user();
        $role = $this->currentRole($request);

        if ($role === 'client') {
            $clientId = $this->currentClientId($request);
            if (! $clientId || (int) $reservation->client_id !== (int) $clientId) {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }
        } elseif ($role === 'agent' && $user) {
            if ($reservation->agent_id !== null && (int) $reservation->agent_id !== (int) $user->id) {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }
        }

        return response()->json([
            'data' => $reservation->load([
                'property:id,title,city,price_per_night',
                'client:id,first_name,last_name,email,phone',
                'agent:id,name,email,status',
                'complaints:id,reservation_id,subject,status,created_at',
            ]),
        ]);
    }

    public function complaints(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $this->currentRole($request);

        $query = Reclamation::with([
            'client:id,first_name,last_name,email',
            'reservation:id,property_id,start_date,end_date,status',
            'reservation.property:id,title,city',
            'agent:id,name,email,status',
        ])->orderByDesc('id');

        if ($role === 'client') {
            $clientId = $this->currentClientId($request);
            $query->where('client_id', $clientId ?? 0);
        } elseif ($role === 'agent' && $user) {
            $query->where(function ($q) use ($user) {
                $q->where('agent_id', $user->id)->orWhereNull('agent_id');
            });
        }

        $data = $query->get();

        return response()->json(['data' => $data]);
    }

    public function complaintShow(Request $request, Reclamation $complaint): JsonResponse
    {
        $user = $request->user();
        $role = $this->currentRole($request);

        if ($role === 'client') {
            $clientId = $this->currentClientId($request);
            if (! $clientId || (int) $complaint->client_id !== (int) $clientId) {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }
        } elseif ($role === 'agent' && $user) {
            if ($complaint->agent_id !== null && (int) $complaint->agent_id !== (int) $user->id) {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }
        }

        return response()->json([
            'data' => $complaint->load([
                'client:id,first_name,last_name,email,phone',
                'reservation:id,property_id,start_date,end_date,status,total_price',
                'reservation.property:id,title,city,address',
                'agent:id,name,email,status',
            ]),
        ]);
    }

    public function options(): JsonResponse
    {
        return response()->json(['data' => Option::orderBy('name')->get()]);
    }
}
