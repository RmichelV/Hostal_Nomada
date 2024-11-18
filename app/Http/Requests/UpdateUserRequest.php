<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->route('user');

        return [
            'country_id' => 'required|exists:countries,id',
            'rol_id' => 'required|exists:roles,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $userId,
            'identification_number' => 'required|integer|unique:users,identification_number,' . $userId,
            'birthday' => 'required|date|before:today|after_or_equal:' . now()->subYears(90)->toDateString() . '|before_or_equal:' . now()->subYears(18)->toDateString(),
            'phone' => [
                'nullable',
                'string',
                'max:15',
                'regex:/^\+?[0-9]+$/', // Solo números y el símbolo "+"
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
                'max:50',
                'regex:/[A-Z]/', // Al menos una mayúscula
                'regex:/[a-z]/', // Al menos una minúscula
                'regex:/[0-9]/', // Al menos un número
                'regex:/[\W_]/', // Al menos un carácter especial
                'confirmed',
            ],
            'profile_photo_path' => 'nullable|string|max:2048',
            'current_team_id' => 'nullable|exists:teams,id',
            'isDeleted' => 'nullable|boolean',
        ];
    }
}
