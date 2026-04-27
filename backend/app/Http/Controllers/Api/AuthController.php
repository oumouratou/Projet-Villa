<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $payload['email'])->first();

        if (! $user || ! Hash::check($payload['password'], $user->password)) {
            return response()->json(['message' => 'Identifiants invalides.'], 401);
        }

        if ($user->status !== 'actif') {
            return response()->json(['message' => 'Compte inactif.'], 403);
        }

        $token = Str::random(64);
        $user->forceFill(['api_token' => hash('sha256', $token)])->save();

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => $user->loadMissing(['client.agent']),
            ],
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        $user = User::create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'phone' => $payload['phone'] ?? null,
            'role' => 'client',
            'status' => 'actif',
            'password' => $payload['password'],
        ]);

        $names = preg_split('/\s+/', trim($payload['name'])) ?: [$payload['name']];
        $client = Client::updateOrCreate([
            'email' => $payload['email'],
        ], [
            'first_name' => $names[0] ?? $payload['name'],
            'last_name' => $names[1] ?? '',
            'email' => $payload['email'],
            'phone' => $payload['phone'] ?? '',
            'status' => 'actif',
            'user_id' => $user->id,
            'agent_id' => Client::where('email', $payload['email'])->value('agent_id'),
        ]);

        return response()->json(['data' => $client->load('user')], 201);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => $request->user()?->loadMissing(['client.agent'])]);
    }

    public function logout(Request $request): JsonResponse
    {
        if ($request->user()) {
            $request->user()->forceFill(['api_token' => null])->save();
        }

        return response()->json(['message' => 'Déconnecté.']);
    }
}
