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
            'name'=>[
                'string', 
                'max:255', 
                'regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/'],
            'email' => [
                'required', 
                'string', 
                'lowercase', 
                'email', 
                'max:255', 
                'unique:'.User::class,
                'regex:/^[\w\.-]+@[\w\.-]+\.(com|net|edu)$/'],
            'identification_number' => [
                'required',
                'regex:/^(?:[1-9]\d{3,9})$/',
                'unique:users,identification_number'
            ],
            'birthday' => 'required|date|before:today|after_or_equal:' . now()->subYears(90)->toDateString() . '|before_or_equal:' . now()->subYears(18)->toDateString(),
            'phone' => [
                'nullable',
                'string',
                'max:15',
                'regex:/^\+?[5-9][0-9]{4,8}$/', 
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
        ],[
            'name.regex'=>'El/Los nombre(s) deben empezar por mayúscula y no contener numeros',
            'email.email' => 'El correo electrónico debe ser una dirección válida.',
            'email.max' => 'El correo electrónico no debe superar los 255 caracteres.',
            'email.unique' => 'El correo electrónico ya está en uso.',
            'email.regex' => 'El email debe terminar en .com, .net o .edu',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min'=>'La contraseña debe ser como minimo 8 caracteres',
            'password.regex' => 'La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.',
            'identification_number.regex'=>'El número debe estar entre 1000 a 999999',
            'phone'=>'El número debe estar entre 55555 a 999999999'
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
