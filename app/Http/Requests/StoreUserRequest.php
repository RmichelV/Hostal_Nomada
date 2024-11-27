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

    /**
 * Mensajes de error personalizados para las reglas de validación.
 */
public function messages(): array
{
    return [
        'country_id.required' => 'El país es obligatorio.',
        'country_id.exists' => 'El país seleccionado no es válido.',
        'rol_id.required' => 'El rol es obligatorio.',
        'rol_id.exists' => 'El rol seleccionado no es válido.',
        'name.required' => 'El nombre es obligatorio.',
        'name.string' => 'El nombre debe ser una cadena de texto.',
        'name.regex' => 'El nombre debe comenzar con una letra mayúscula y solo puede contener letras y espacios.',
        'name.max' => 'El nombre no puede tener más de 255 caracteres.',
        'email.required' => 'El correo electrónico es obligatorio.',
        'email.email' => 'El correo electrónico no tiene un formato válido.',
        'email.regex' => 'El correo electrónico debe ser de un dominio válido (.com, .net, .edu).',
        'email.unique' => 'El correo electrónico ya está registrado.',
        'identification_number.required' => 'El número de identificación es obligatorio.',
        'identification_number.regex' => 'El número de identificación debe ser un valor numérico válido.',
        'identification_number.unique' => 'El número de identificación ya está registrado.',
        'identification_number.max' => 'El número de identificación no puede tener más de 10 dígitos.',
        'birthday.required' => 'La fecha de nacimiento es obligatoria.',
        'birthday.date' => 'La fecha de nacimiento debe ser una fecha válida.',
        'birthday.before' => 'La fecha de nacimiento debe ser anterior a hoy.',
        'birthday.after_or_equal' => 'La fecha de nacimiento debe ser como máximo hace 90 años.',
        'birthday.before_or_equal' => 'La fecha de nacimiento debe indicar que el usuario tiene al menos 18 años.',
        'phone.regex' => 'El teléfono debe contener solo números y puede incluir un "+" al inicio.',
        'password.required' => 'La contraseña es obligatoria.',
        'password.string' => 'La contraseña debe ser una cadena de texto.',
        'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
        'password.max' => 'La contraseña no puede tener más de 50 caracteres.',
        'password.regex' => 'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.',
        'password.confirmed' => 'La confirmación de la contraseña no coincide.',
        'profile_photo_path.string' => 'La ruta de la foto de perfil debe ser una cadena de texto.',
        'profile_photo_path.max' => 'La ruta de la foto de perfil no puede superar los 2048 caracteres.',
        'current_team_id.exists' => 'El equipo seleccionado no es válido.',
        'isDeleted.boolean' => 'El campo de eliminación debe ser verdadero o falso.',
        'terms.required' => 'Debes aceptar los términos y condiciones.',
        'terms.accepted' => 'Debes aceptar los términos y condiciones.',
    ];
}
}
