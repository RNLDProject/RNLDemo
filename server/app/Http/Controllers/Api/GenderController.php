<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use Illuminate\Http\Request;

class GenderController extends Controller
{
    public function loadGenders()
    {
        
        $genders = Gender::where('is_deleted', 0)->get();

        return response()->json([
            'genders' => $genders
        ], 200);
    }

    public function storeGender(Request $request)
    {
        $validated = $request->validate([
            'gender' => ['required', 'min:3', 'max:30'],
        ]);

        Gender::create([
            'gender' => $validated['gender'],
            'is_deleted' => 0 
        ]);

        return response()->json([
            'message' => 'Gender Successfully Saved.',
        ], 200);
    }

    public function getGender($genderId)
    {
        
        $gender = Gender::find($genderId);

        if (!$gender) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return response()->json([
            'gender' => $gender
        ], 200);
    }

    public function updateGender(Request $request, $genderId) 
    {
        $gender = Gender::find($genderId);

        if (!$gender) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $validated = $request->validate([
            'gender' => ['required', 'min:3', 'max:30']
        ]);

        $gender->update([
            'gender' => $validated['gender']
        ]);

        return response()->json([
            'gender' => $gender,
            'message' => 'Gender Successfully Updated.'
        ], 200);
    }

    public function destroyGender($genderId) 
    {
        $gender = Gender::find($genderId);

        if (!$gender) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $gender->update([
            'is_deleted' => 1 
        ]);

        return response()->json([
            'message' => 'Gender Successfully Deleted.'
        ], 200);
    }
}