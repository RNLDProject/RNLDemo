<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
{
    // 1. Tanggalin muna natin ang 'min' validation para siguradong papasok
    $validated = $request->validate([
        'username' => ['required', 'string'],
        'password' => ['required', 'string'],
    ]);

    // 2. HANAPIN ANG USER LANG (Wala munang .with('gender') para iwas 500 error)
    $user = User::where('username', $validated['username'])
            ->where('is_deleted', 0) // tinyInteger use 0
            ->first();

    // 3. I-check kung may nahanap at kung tama ang password
    if (!$user || !Hash::check($validated['password'], $user->password)) {
        return response()->json([
            'message' => 'The provided credentials are incorrect',
        ], 401);
    }

    // 4. Generate Token
    $user->tokens()->delete();
    $token = $user->createToken('auth_token')->plainTextToken;

    // 5. I-load ang gender pagkatapos para sure na hindi mag-crash ang login
    return response()->json([
        'user' => $user->load('gender'), 
        'token' => $token,
    ], 200);
}

    public function logout(Request $request)
    {
        $token = $request->user()?->currentAccessToken();

        if ($token) {
            $token->delete();
        }

        return response()->json([
            'message' => 'Logged Out Successfully',
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()->load('gender'),
        ], 200);
    }
}