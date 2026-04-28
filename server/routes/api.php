<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->prefix('/auth')->group(function(){
    Route::post('/login', 'login');
    
});

Route::middleware('auth:sanctum')
    ->prefix('auth')
    ->controller(AuthController::class)
    ->group(function () {
        Route::post('/logout', 'logout');
        Route::get('/me', 'me');
});


Route::controller(GenderController::class)->prefix('/gender')->group(function () {
    Route::get('/loadGenders', 'loadGenders'); 
    Route::get('/getGender/{genderId}', 'getGender');
    Route::post('/storeGender', 'storeGender'); 
    Route::put('/updateGender/{gender}', 'updateGender');
    Route::put('/destroyGender/{gender}', 'destroyGender');
});

Route::controller(UserController::class)->prefix('/user')->group(function () {
    Route::get('/loadUsers', 'loadUsers'); 
    Route::post('/storeUser', 'storeUser'); 
    Route::put('/updateUser/{user_id}', 'updateUser');
    Route::put('/destroyUser/{user_id}', 'destroyUser');
});


