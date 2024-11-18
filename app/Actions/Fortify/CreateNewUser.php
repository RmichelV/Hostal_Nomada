<?php

namespace App\Actions\Fortify;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Jetstream\Jetstream;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        // Usa el Request para validar
        $validated = app(StoreUserRequest::class)->validated();

        // Crea el usuario
        return User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'country_id' => $validated['country_id'],
            'rol_id' => $validated['rol_id'],
            'identification_number' => $validated['identification_number'],
            'birthday' => $validated['birthday'],
            'phone' => $validated['phone'],
        ]);
    }
}
