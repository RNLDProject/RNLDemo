<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Gender; 
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // Para sa password hashing

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        Gender::factory()->createMany([
            ['gender' => 'Male'],
            ['gender' => 'Female'],
            ['gender' => 'Prefer not to say'],
        ]);

       
        $birthDate = fake()->date();
        $age = date_diff(date_create($birthDate), date_create('now'))->y;

        
        User::factory()->create([
            'first_name' => 'John',
            'middle_name' => 'Santos',
            'last_name' => 'Doe',
            'suffix_name' => null, 
            'gender_id' => Gender::inRandomOrder()->first()->gender_id,
            'birth_date' => $birthDate,
            'age' => $age,
            'username' => 'johndoe',
            'password' => Hash::make('johndoe'),
        ]);

            User::factory(100)->create();
    }
}