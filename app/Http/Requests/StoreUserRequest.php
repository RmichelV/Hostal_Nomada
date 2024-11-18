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
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'identification_number' => 'required|integer|unique:users,identification_number',
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
