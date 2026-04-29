<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Gender; 
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        
        $genders = ['Male', 'Female', 'Prefer not to say'];
        foreach ($genders as $g) {
            Gender::firstOrCreate(['gender' => $g]);
        }

        
        User::factory()->create([
            'first_name' => 'System',
            'middle_name' => null,
            'last_name' => 'Admin',
            'suffix_name' => null, 
            'gender_id' => 1, 
            'birth_date' => '1995-01-01',
            'age' => 31,
            'username' => 'admin',
            'password' => Hash::make('admin123'), 
        ]);

        User::factory(10)->create();
    }
}