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
            'first_name' => ['nullable', 'required_without:name', 'string', 'max:255'],
            'last_name' => ['nullable', 'required_without:name', 'string', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8'],
        ], [
            'email.unique' => 'Cet email est déjà utilisé.',
            'email.email' => 'Veuillez saisir un email valide.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ]);

        $firstName = $payload['first_name'] ?? null;
        $lastName = $payload['last_name'] ?? null;

        if (! $firstName || ! $lastName) {
            $names = preg_split('/\s+/', trim($payload['name'] ?? '')) ?: [];
            $firstName = $firstName ?? ($names[0] ?? null);
            $lastName = $lastName ?? (count($names) > 1 ? implode(' ', array_slice($names, 1)) : null);
        }

        $displayName = trim(($firstName ?? '') . ' ' . ($lastName ?? ''));
        if ($displayName === '') {
            $displayName = $payload['name'] ?? 'Client';
        }

        $user = User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'name' => $displayName,
            'email' => $payload['email'],
            'phone' => $payload['phone'] ?? null,
            'password' => $payload['password'],
        ]);

        $client = Client::updateOrCreate([
            'email' => $payload['email'],
        ], [
            'first_name' => $firstName ?? $displayName,
            'last_name' => $lastName ?? '',
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
