<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return true; // Cambiar si necesitas lógica de autorización
    }

    public function rules()
    {
        $fortyYearsAgo = Carbon::now()->subYears(40)->toDateString();

        return [
            'user_id' => 'required|exists:users,id',
            'shift_id' => 'required|exists:shifts,id',
            'hire_date' => "required|date|after_or_equal:$fortyYearsAgo|before_or_equal:today",
            'salary' => 'required|numeric|min:2500|max:999999',
            'isDeleted' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'user_id.required' => 'El ID del usuario es obligatorio.',
            'user_id.exists' => 'El usuario no existe en la base de datos.',
            'shift_id.required' => 'El turno es obligatorio.',
            'shift_id.exists' => 'El turno no existe en la base de datos.',
            'hire_date.required' => 'La fecha de contratación es obligatoria.',
            'hire_date.after_or_equal' => 'La fecha de contratación no puede ser anterior a hace 40 años.',
            'hire_date.before_or_equal' => 'La fecha de contratación no puede ser posterior a hoy.',
            'salary.required' => 'El salario es obligatorio.',
            'salary.min' => 'El salario debe ser al menos 2500.',
            'salary.max' => 'El salario no puede exceder 999999.',
        ];
    }
}