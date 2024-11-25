<?php

namespace App\Actions\Fortify;

use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
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
        // $input = app(StoreUserRequest::class)->in$input();
        $validator = Validator::make($input, [
            'country_id' => 'required|exists:countries,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'identification_number' => 'required|integer|unique:users,identification_number|max:9999999999',
            'birthday' => 'required|date|before:today|after_or_equal:' . now()->subYears(90)->toDateString() . '|before_or_equal:' . now()->subYears(18)->toDateString(),
            'phone' => [
                'nullable',
                'string',
                'max:15',
                'regex:/^\+?[0-9]+$/', 
            ],                
            'password' => [
                'required',
                'string',
                'min:8',
                'max:50',
                'regex:/[A-Z]/', 
                'regex:/[a-z]/', 
                'regex:/[0-9]/', 
                'regex:/[\W_]/', 
                'confirmed',
            ],
            'profile_photo_path' => 'nullable|string|max:2048',
            'current_team_id' => 'nullable|exists:teams,id',
            'isDeleted' => 'nullable|boolean',
            'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['accepted', 'required'] : '',
        ]);
    
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        // Crea el usuario
        return User::create([
            'name' => ucwords(strtolower($input['name'])),
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'country_id' => $input['country_id'],
            'rol_id' => 3,
            'identification_number' => $input['identification_number'],
            'birthday' => $input['birthday'],
            'phone' => $input['phone'],
        ]);
    }
}
