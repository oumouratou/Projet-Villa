<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // EnsureFrontendRequestsAreStateful retiré : inutile pour une API token-based
        // et provoque des erreurs CSRF token mismatch sur les routes /api/*

        $middleware->trustProxies(at: '*');

        $middleware->alias([
            'auth.token' => \App\Http\Middleware\AuthenticateApiToken::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();