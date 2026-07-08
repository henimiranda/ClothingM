<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', [ApiController::class, 'health']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/debug', [AuthController::class, 'debug']);
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);
Route::post('/auth/setup-pin', [AuthController::class, 'setupPin']);
Route::post('/auth/verify-pin', [AuthController::class, 'verifyPin']);

Route::get('/products', [ApiController::class, 'products']);
Route::post('/products', [ApiController::class, 'storeProduct']);

Route::get('/scm/logs', [ApiController::class, 'inventoryLogs']);
Route::post('/scm/logs', [ApiController::class, 'storeInventoryLog']);

Route::get('/production', [ApiController::class, 'production']);
Route::post('/production', [ApiController::class, 'storeProduction']);
Route::put('/production/{id}', [ApiController::class, 'updateProduction']);

Route::get('/orders', [ApiController::class, 'orders']);
Route::post('/orders', [ApiController::class, 'storeOrder']);
Route::get('/orders/user/{id}', [ApiController::class, 'userOrders']);

Route::get('/stats/overview', [ApiController::class, 'overview']);

Route::get('/auth/users', [AuthController::class, 'users']);
Route::put('/auth/users/{id}/role', [AuthController::class, 'updateRole']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
