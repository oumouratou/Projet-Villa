<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $plainToken = $request->bearerToken() ?: $request->header('X-API-TOKEN');

        if (! $plainToken) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        $hashedToken = hash('sha256', $plainToken);
        $user = Auth::getProvider()->retrieveByCredentials(['api_token' => $hashedToken]);

        if (! $user) {
            return response()->json(['message' => 'Jeton invalide.'], 401);
        }

        Auth::setUser($user);
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
