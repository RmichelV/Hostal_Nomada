<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Laravel\Jetstream\Jetstream;

class StoreUserRequest extends FormRequest
{
    /**
     * Determina si el usuario está autorizado a realizar esta solicitud.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación que se aplicarán a la solicitud.
     */
    public function rules(): array
    {
        return [
                'country_id' => 'required|exists:countries,id',
                'rol_id' => 'required|exists:rols,id',
                'name' => 'required|string|max:255|regex:/^([A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)(\s[A-ZÁÉÍÓÚÑÇĆ][a-záéíóúñçć]+)*$/',
                'email' => [
                'required',
                'email',
                'regex:/^[\w\.-]+@[\w\.-]+\.(com|net|edu)$/',
                'unique:users,email'],
                'identification_number' => [
                    'required',
                    'regex:/^(?:[1-9]\d{3,9})$/',
                    'unique:users,identification_number',
                    'max:9999999999'],
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
        ];
    }
}
