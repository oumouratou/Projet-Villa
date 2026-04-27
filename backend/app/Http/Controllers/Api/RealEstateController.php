<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Complaint;
use App\Models\Property;
use App\Models\PropertyOption;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class RealEstateController extends Controller
{
    public function dashboardStats(): JsonResponse
    {
        $totalReservations = Reservation::count();
        $pendingReservations = Reservation::where('status', 'en_attente')->count();
        $totalProperties = Property::count();

        $stats = [
            'totalProperties' => $totalProperties,
            'totalReservations' => $totalReservations,
            'pendingReservations' => $pendingReservations,
            'totalClients' => Client::count(),
            'totalRevenue' => (int) Reservation::where('status', 'confirmee')->sum('total_price'),
            'occupancyRate' => $totalProperties > 0
                ? round((Property::where('status', 'reserve')->count() / $totalProperties) * 100, 2)
                : 0,
        ];

        return response()->json(['data' => $stats]);
    }

    public function properties(): JsonResponse
    {
        $data = Property::with([
            'options:id,name,icon',
            'agent:id,name,email,role,status',
            'propertyImages:id,property_id,url,order'
        ])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $data]);
    }

    public function propertyShow(Property $property): JsonResponse
    {
        return response()->json([
            'data' => $property->load([
                'options:id,name,icon',
                'agent:id,name,email,role,status',
                'propertyImages:id,property_id,url,order'
            ]),
        ]);
    }

    public function clients(): JsonResponse
    {
        $data = Client::with(['agent:id,name,email,role,status'])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $data]);
    }

    public function clientShow(Client $client): JsonResponse
    {
        return response()->json([
            'data' => $client->load([
                'agent:id,name,email,role,status',
                'reservations.property:id,title,city,price_per_night,image_url',
                'reservations.agent:id,name,email,role,status',
                'complaints.reservation.property:id,title,city',
                'complaints.agent:id,name,email,role,status',
            ]),
        ]);
    }

    public function users(): JsonResponse
    {
        $query = User::query()->select(['id', 'name', 'email', 'phone', 'role', 'status', 'created_at']);

        $role = request()->query('role');
        if (is_string($role) && $role !== '') {
            $query->where('role', $role);
        }

        return response()->json(['data' => $query->orderByDesc('id')->get()]);
    }

    public function userShow(User $user): JsonResponse
    {
        return response()->json(['data' => $user]);
    }

    public function reservations(): JsonResponse
    {
        $data = Reservation::with([
            'property:id,title,city,price_per_night',
            'client:id,first_name,last_name,email,phone',
            'agent:id,name,email,role,status',
        ])->orderByDesc('id')->get();

        return response()->json(['data' => $data]);
    }

    public function reservationShow(Reservation $reservation): JsonResponse
    {
        return response()->json([
            'data' => $reservation->load([
                'property:id,title,city,price_per_night',
                'client:id,first_name,last_name,email,phone',
                'agent:id,name,email,role,status',
                'complaints:id,reservation_id,subject,status,created_at',
            ]),
        ]);
    }

    public function complaints(): JsonResponse
    {
        $data = Complaint::with([
            'client:id,first_name,last_name,email',
            'reservation:id,property_id,start_date,end_date,status',
            'reservation.property:id,title,city',
            'agent:id,name,email,role,status',
        ])->orderByDesc('id')->get();

        return response()->json(['data' => $data]);
    }

    public function complaintShow(Complaint $complaint): JsonResponse
    {
        return response()->json([
            'data' => $complaint->load([
                'client:id,first_name,last_name,email,phone',
                'reservation:id,property_id,start_date,end_date,status,total_price',
                'reservation.property:id,title,city,address',
                'agent:id,name,email,role,status',
            ]),
        ]);
    }

    public function options(): JsonResponse
    {
        return response()->json(['data' => PropertyOption::orderBy('name')->get()]);
    }
}
