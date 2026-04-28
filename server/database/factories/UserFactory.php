<?php

namespace Database\Factories;

use App\Models\Gender;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $birthDate = fake()->date();
        $age = date_diff(date_create($birthDate), date_create('now'))->y;

        return [
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional()->lastName(),
            'last_name' => fake()->lastName(),
            'suffix_name' => fake()->optional()->suffix(),
            'gender_id' => Gender::query()->inRandomOrder()->value('gender_id') ?? Gender::factory(),
            'birth_date' => $birthDate,
            'age' => $age,
            'username' => fake()->unique()->userName(),
            'password' => Hash::make('password'),
            'is_deleted' => 0,
        ];
    }
}
