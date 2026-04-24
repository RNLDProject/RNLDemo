<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gender;
use Illuminate\Http\Request;

class GenderController extends Controller
{
    public function loadGenders()
    {
        // Mas malinis kung 'is_deleted', 0 or false
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
            'is_deleted' => 0 // default na hindi deleted
        ]);

        return response()->json([
            'message' => 'Gender Successfully Saved.',
        ], 200);
    }

    public function getGender($genderId)
    {
        // Dahil 'gender_id' ang primary key mo, manual find natin
        $gender = Gender::find($genderId);

        if (!$gender) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        return response()->json([
            'gender' => $gender
        ], 200);
    }

    public function updateGender(Request $request, $genderId) // Pinalitan ko ng $genderId
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

    public function destroyGender($genderId) // Pinalitan ko ng $genderId
    {
        $gender = Gender::find($genderId);

        if (!$gender) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $gender->update([
            'is_deleted' => 1 // 1 means true/deleted
        ]);

        return response()->json([
            'message' => 'Gender Successfully Deleted.'
        ], 200);
    }
}