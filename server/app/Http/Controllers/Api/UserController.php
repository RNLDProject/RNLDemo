<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; 

class UserController extends Controller
{
    
    public function loadUsers(Request $request)
    {
        $search = $request->input('search');

        $users = User::with(['gender'])
            ->leftJoin('tbl_genders', 'tbl_users.gender_id', '=', 'tbl_genders.gender_id')
            ->where('tbl_users.is_deleted', false)
            ->orderBy('tbl_users.last_name', 'asc')
            ->orderBy('tbl_users.first_name', 'asc')
            ->orderBy('tbl_users.middle_name', 'asc')
            ->orderBy('tbl_users.suffix_name', 'asc');

        if ($search) {
            $users->where(function ($query) use ($search) {
                $query->where('tbl_users.first_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.middle_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.last_name', 'like', "%{$search}%")
                    ->orWhere('tbl_users.suffix_name', 'like', "%{$search}%")
                    ->orWhere('tbl_genders.gender', 'like', "%{$search}%");
            });
        }

        $users = $users->select('tbl_users.*')->paginate(15);

        $users->getCollection()->transform(function ($user) {
            $user->profile_picture = $user->profile_picture 
                ? url('storage/public/img/user/profile_picture/' . $user->profile_picture) 
                : null;
            return $user;
        });

        return response()->json([
            'users' => $users
        ], 200);
    }

    
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'add_user_profile_picture' => ['nullable','image','mimes:png,jpg,jpeg'],
            'first_name'   => ['required', 'string', 'max:55'],
            'middle_name'  => ['nullable', 'string', 'max:55'],
            'last_name'    => ['required', 'string', 'max:55'],
            'suffix_name'  => ['nullable', 'string', 'max:55'],
            'gender_id'    => ['required', 'integer', 'exists:tbl_genders,gender_id'],
            'birth_date'   => ['required', 'date'],
            'username'     => ['required', 'string', 'max:55', Rule::unique('tbl_users', 'username')],
            'password'     => ['required', 'string', 'min:6', 'max:255', 'confirmed'],
        ]);

        $filenameToStore = null;

        if ($request->hasFile('add_user_profile_picture')) {
            $file = $request->file('add_user_profile_picture');
            $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $filenameToStore = sha1($filename . time()) . '.' . $extension;
            $file->storeAs('public/img/user/profile_picture', $filenameToStore);
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $user = User::create([
            'profile_picture' => $filenameToStore,
            'first_name'      => $validated['first_name'],
            'middle_name'     => $validated['middle_name'] ?? null,
            'last_name'       => $validated['last_name'],
            'suffix_name'     => $validated['suffix_name'] ?? null,
            'gender_id'       => $validated['gender_id'],
            'birth_date'      => $validated['birth_date'],
            'age'             => $age,
            'username'        => $validated['username'],
            'password'        => bcrypt($validated['password']),
            'is_deleted'      => false,
        ]);

        return response()->json([
            'user'    => $user->load('gender'),
            'message' => 'User Successfully Saved.',
        ], 201);
    }

    
    public function updateUser(Request $request, User $user)
    {
        
        Log::info('Updating User ID: ' . $user->user_id, $request->all());

        $validated = $request->validate([
            'edit_user_profile_picture' => ['nullable', 'image', 'mimes:png,jpg,jpeg'],
            'first_name'   => ['required', 'string', 'max:55'],
            'middle_name'  => ['nullable', 'string', 'max:55'],
            'last_name'    => ['required', 'string', 'max:55'],
            'suffix_name'  => ['nullable', 'string', 'max:55'],
            'gender_id'    => ['required', 'integer', 'exists:tbl_genders,gender_id'],
            'birth_date'   => ['required', 'date'],
            'username'     => ['required', 'min:5', 'max:12', Rule::unique('tbl_users', 'username')->ignore($user->user_id, 'user_id')],
        ]);

        
        $currentPicture = $user->getRawOriginal('profile_picture');
        $finalProfilePicture = $currentPicture; 

        
        if ($request->remove_profile_picture == '1') {
            if ($currentPicture && Storage::exists('public/img/user/profile_picture/' . $currentPicture)) {
                Storage::delete('public/img/user/profile_picture/' . $currentPicture);
            }
            $finalProfilePicture = null;
        } 
        
        else if ($request->hasFile('edit_user_profile_picture')) {
            if ($currentPicture && Storage::exists('public/img/user/profile_picture/' . $currentPicture)) {
                Storage::delete('public/img/user/profile_picture/' . $currentPicture);
            }

            $file = $request->file('edit_user_profile_picture');
            $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $filenameToStore = sha1($filename . time()) . '.' . $extension;

            $file->storeAs('public/img/user/profile_picture', $filenameToStore);
            $finalProfilePicture = $filenameToStore;
        }

        $age = date_diff(date_create($validated['birth_date']), date_create('now'))->y;

        $user->update([
            'profile_picture' => $finalProfilePicture,
            'first_name'      => $validated['first_name'],
            'middle_name'     => $validated['middle_name'],
            'last_name'       => $validated['last_name'],
            'suffix_name'     => $validated['suffix_name'],
            'gender_id'       => $validated['gender_id'],
            'birth_date'      => $validated['birth_date'],
            'age'             => $age,
            'username'        => $validated['username'],
        ]);

        
        $user->profile_picture = $user->profile_picture 
                ? url('storage/public/img/user/profile_picture/' . $user->profile_picture) 
                : null;

        return response()->json([
            'message' => 'User Successfully Updated.',
            'user'    => $user->load('gender'),
        ], 200);
    }

    
    public function destroyUser(User $user)
    {
        $user->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'User Successfully Deleted.'
        ], 200);
    }
}