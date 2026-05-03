<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'nullable|required_without:name|string|max:255',
            'last_name' => 'nullable|required_without:name|string|max:255',
            'name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:50',
            'password' => 'required|string|min:8',
        ], [
            'email.unique' => 'Cet email est déjà utilisé.',
            'email.email' => 'Veuillez saisir un email valide.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'first_name.required_without' => 'Le prénom est requis.',
            'last_name.required_without' => 'Le nom est requis.',
        ]);

        $firstName = $validatedData['first_name'] ?? null;
        $lastName = $validatedData['last_name'] ?? null;
        $fullName = $validatedData['name'] ?? trim(($firstName ?? '') . ' ' . ($lastName ?? ''));

        $user = User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'name' => $fullName,
            'email' => $validatedData['email'],
            'phone' => $validatedData['phone'] ?? null,
            'password' => Hash::make($validatedData['password']),
        ]);

        $clientRoleId = Role::query()->where('name', 'client')->value('id');
        if ($clientRoleId) {
            $user->roles()->syncWithoutDetaching([$clientRoleId]);
        }

        Client::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'phone' => $validatedData['phone'] ?? '0000000000',
                'address' => 'Adresse non renseignée',
            ]
        );

        $role = $user->roles()->value('name') ?? 'client';

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => array_merge($user->toArray(), ['role' => $role]),
            ],
            // backwards-compatible keys
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.'
            ], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();
        $role = $user->roles()->value('name') ?? 'client';

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => array_merge($user->toArray(), ['role' => $role]),
            ],
            // backwards-compatible keys
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'data' => true,
            'message' => 'Logged out'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $role = $user?->roles()->value('name') ?? 'client';

        return response()->json([
            'data' => $user ? array_merge($user->toArray(), ['role' => $role]) : null,
        ]);
    }
}
