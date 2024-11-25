<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_type_id' => 'required|exists:room_types,id',
            'name' => ['required', 'string', 'max:15', 'regex:/^[a-zA-Z][a-zA-Z0-9]*$/','unique:rooms,name'],
            'status' => 'required|in:Ocupada,Libre,No acceso',
        ];
    }
}
