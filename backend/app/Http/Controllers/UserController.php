<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Seuls ces 2 admins peuvent gérer les agents
    private const ALLOWED_ADMINS = [
        'mlamaranapalaga21@gmail.com',
        'oumouratoubarry52@gmail.com',
    ];

    public function index()
    {
        $users = User::with('roles')
            ->whereHas('roles', fn ($q) => $q->whereIn('name', ['admin', 'agent']))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (User $u) => $this->serialize($u));

        return response()->json(['data' => $users]);
    }

    public function store(Request $request)
    {
        $currentUser = $request->user();
        $currentRole = $currentUser?->roles()->value('name');

        if ($currentRole !== 'admin' || ! in_array($currentUser?->email, self::ALLOWED_ADMINS)) {
            return response()->json([
                'message' => 'Accès refusé. Seuls les administrateurs autorisés peuvent créer des agents.'
            ], 403);
        }

        $payload = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'phone'      => 'nullable|string|max:50',
            'password'   => 'required|string|min:8',
            'role'       => 'nullable|in:agent,admin',
            'status'     => 'nullable|in:actif,inactif',
        ]);

        $roleName = $payload['role'] ?? 'agent';
        $roleId   = Role::where('name', $roleName)->value('id');

        $user = User::create([
            'first_name' => $payload['first_name'],
            'last_name'  => $payload['last_name'],
            'name'       => trim($payload['first_name'] . ' ' . $payload['last_name']),
            'email'      => $payload['email'],
            'phone'      => $payload['phone'] ?? null,
            'password'   => Hash::make($payload['password']),
            'status'     => $payload['status'] ?? 'actif',
        ]);

        if ($roleId) {
            $user->roles()->attach($roleId);
        }

        $user->load('roles');

        return response()->json(['data' => $this->serialize($user)], 201);
    }

    public function show(User $user)
    {
        $user->load('roles');
        return response()->json(['data' => $this->serialize($user)]);
    }

    public function update(Request $request, User $user)
    {
        $currentUser = $request->user();
        $currentRole = $currentUser?->roles()->value('name');

        if ($currentRole !== 'admin' || ! in_array($currentUser?->email, self::ALLOWED_ADMINS)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $payload = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name'  => 'sometimes|string|max:255',
            'phone'      => 'nullable|string|max:50',
            'status'     => 'sometimes|in:actif,inactif',
            'password'   => 'nullable|string|min:8',
            'role'       => 'nullable|in:agent,admin',
        ]);

        if (isset($payload['password']) && $payload['password']) {
            $payload['password'] = Hash::make($payload['password']);
        } else {
            unset($payload['password']);
        }

        if (isset($payload['first_name']) || isset($payload['last_name'])) {
            $payload['name'] = trim(
                ($payload['first_name'] ?? $user->first_name) . ' ' .
                ($payload['last_name']  ?? $user->last_name)
            );
        }

        if (isset($payload['role'])) {
            $roleId = Role::where('name', $payload['role'])->value('id');
            if ($roleId) {
                $user->roles()->sync([$roleId]);
            }
            unset($payload['role']);
        }

        $user->update($payload);
        $user->load('roles');

        return response()->json(['data' => $this->serialize($user)]);
    }

    public function destroy(User $user)
    {
        $currentUser = request()->user();
        $currentRole = $currentUser?->roles()->value('name');

        if ($currentRole !== 'admin' || ! in_array($currentUser?->email, self::ALLOWED_ADMINS)) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        if (in_array($user->email, self::ALLOWED_ADMINS)) {
            return response()->json([
                'message' => 'Impossible de supprimer un administrateur principal.'
            ], 403);
        }

        $user->roles()->detach();
        $user->delete();

        return response()->json(null, 204);
    }

    private function serialize(User $user): array
    {
        return [
            'id'         => $user->id,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'name'       => $user->name ?? trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? '')),
            'email'      => $user->email,
            'phone'      => $user->phone,
            'status'     => $user->status ?? 'actif',
            'role'       => $user->roles->first()?->name ?? 'agent',
            'roles'      => $user->roles->map(fn ($r) => ['id' => $r->id, 'name' => $r->name]),
            'created_at' => optional($user->created_at)->toISOString(),
        ];
    }
}