<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\BienImmobilierController;
use App\Http\Controllers\OptionController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\ReclamationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\NotificationController;

// Authentication publique
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Auth aliases
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// Routes publiques
Route::apiResource('roles', RoleController::class);
Route::apiResource('permissions', PermissionController::class);
Route::apiResource('clients', ClientController::class);
Route::apiResource('biens', BienImmobilierController::class);
Route::apiResource('properties', BienImmobilierController::class);
Route::apiResource('options', OptionController::class);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Réservations
    Route::apiResource('reservations', ReservationController::class);

    // Réclamations
    Route::apiResource('reclamations', ReclamationController::class);
    Route::apiResource('complaints', ReclamationController::class);

    // Gestion utilisateurs (agents) — admin only
    Route::apiResource('users', UserController::class);

    // Notifications
    Route::get('/notifications/summary', [NotificationController::class, 'summary']);
});

// Versioned v1
Route::prefix('v1')->group(function () {
    Route::apiResource('biens', BienImmobilierController::class);
    Route::apiResource('properties', BienImmobilierController::class);
    Route::apiResource('options', OptionController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('clients', ClientController::class);

    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('reservations', ReservationController::class);
        Route::apiResource('reclamations', ReclamationController::class);
        Route::apiResource('complaints', ReclamationController::class);
        Route::apiResource('users', UserController::class);
        Route::get('/notifications/summary', [NotificationController::class, 'summary']);
    });
});