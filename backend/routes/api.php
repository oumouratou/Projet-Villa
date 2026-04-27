<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RealEstateController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::middleware('auth.token')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
    });

    Route::get('/dashboard/stats', [RealEstateController::class, 'dashboardStats']);

    Route::get('/properties', [RealEstateController::class, 'properties']);
    Route::get('/properties/{property}', [RealEstateController::class, 'propertyShow']);

    Route::get('/clients', [RealEstateController::class, 'clients']);
    Route::get('/clients/{client}', [RealEstateController::class, 'clientShow']);

    Route::get('/users', [RealEstateController::class, 'users']);
    Route::get('/users/{user}', [RealEstateController::class, 'userShow']);

    Route::get('/reservations', [RealEstateController::class, 'reservations']);
    Route::get('/reservations/{reservation}', [RealEstateController::class, 'reservationShow']);

    Route::get('/complaints', [RealEstateController::class, 'complaints']);
    Route::get('/complaints/{complaint}', [RealEstateController::class, 'complaintShow']);

    Route::get('/options', [RealEstateController::class, 'options']);
});
