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
use App\Http\Controllers\Api\RealEstateController;
use App\Http\Controllers\UserController;
use App\Models\User;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Api\NotificationController;

// Authentication publique
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Auth aliases
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
    Route::post('/reset-password', [ResetPasswordController::class, 'reset']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// Routes publiques (index + show)
Route::apiResource('roles', RoleController::class)->only(['index','show']);
Route::apiResource('permissions', PermissionController::class)->only(['index','show']);
Route::apiResource('clients', ClientController::class)->only(['index','show']);
Route::get('biens', [BienImmobilierController::class, 'index']);
Route::get('biens/{bien}', [BienImmobilierController::class, 'show']);
// expose properties (same controller) but keep route param name consistent with controller ($bien)
Route::get('properties', [BienImmobilierController::class, 'index']);
Route::get('properties/{bien}', [BienImmobilierController::class, 'show']);
Route::apiResource('options', OptionController::class)->only(['index','show']);

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

    // Protected bien/property actions (create/update/delete)
    Route::post('biens', [BienImmobilierController::class, 'store']);
    Route::put('biens/{bien}', [BienImmobilierController::class, 'update']);
    Route::delete('biens/{bien}', [BienImmobilierController::class, 'destroy']);

    Route::post('properties', [BienImmobilierController::class, 'store']);
    Route::put('properties/{bien}', [BienImmobilierController::class, 'update']);
    Route::delete('properties/{bien}', [BienImmobilierController::class, 'destroy']);
    // Protected options CRUD
    Route::post('options', [OptionController::class, 'store']);
    Route::put('options/{option}', [OptionController::class, 'update']);
    Route::delete('options/{option}', [OptionController::class, 'destroy']);
    // Uploads
    Route::post('uploads', [\App\Http\Controllers\UploadController::class, 'store']);
});

// Versioned v1
Route::prefix('v1')->group(function () {
    // v1 public index + show
    Route::get('biens', [BienImmobilierController::class, 'index']);
    Route::get('biens/{bien}', [BienImmobilierController::class, 'show']);
    Route::get('properties', [BienImmobilierController::class, 'index']);
    Route::get('properties/{bien}', [BienImmobilierController::class, 'show']);
    Route::apiResource('options', OptionController::class)->only(['index','show']);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('clients', ClientController::class);

    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/dashboard/stats', [RealEstateController::class, 'dashboardStats']);
        Route::apiResource('reservations', ReservationController::class);
        Route::apiResource('reclamations', ReclamationController::class);
        Route::apiResource('complaints', ReclamationController::class);
        Route::apiResource('users', UserController::class);
        Route::get('/notifications/summary', [NotificationController::class, 'summary']);

        // Protected v1 actions for biens/properties
        Route::post('biens', [BienImmobilierController::class, 'store']);
        Route::put('biens/{bien}', [BienImmobilierController::class, 'update']);
        Route::delete('biens/{bien}', [BienImmobilierController::class, 'destroy']);

        Route::post('properties', [BienImmobilierController::class, 'store']);
        Route::put('properties/{bien}', [BienImmobilierController::class, 'update']);
        Route::delete('properties/{bien}', [BienImmobilierController::class, 'destroy']);
        // Uploads v1
        Route::post('uploads', [\App\Http\Controllers\UploadController::class, 'store']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        $user = User::with(['roles', 'client', 'agent'])->find($request->user()->id);
        return response()->json($user);
    });

    Route::get('/notifications', function (Request $request) {
        return $request->user()->notifications;
    });

    Route::post('/notifications/mark-all-read', function (Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['status' => 'success']);
    });

    Route::post('/notifications/{id}/read', function (Request $request, $id) {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return response()->json(['status' => 'success']);
    });
});