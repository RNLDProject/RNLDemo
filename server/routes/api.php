<?php

use App\Http\Controllers\Api\GenderController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
    Route::put('/updateUser/{userId}', 'updateUser');
    Route::put('/destroyUser/{userId}', 'destroyUser');

});

// Explicit routes to avoid any route-group binding/cache mismatch.
Route::put('/user/updateUser/{userId}', [UserController::class, 'updateUser']);
Route::put('/user/destroyUser/{userId}', [UserController::class, 'destroyUser']);

// Route::get('/user', function (Request $request) {
//    return $request->user();
// })->middleware('auth:sanctum');
