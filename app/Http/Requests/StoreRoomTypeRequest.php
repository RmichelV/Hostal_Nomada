<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomTypeRequest extends FormRequest
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
            'name' => 'required|string|max:25|unique:room_types,name',
            'quantity' => 'nullable|integer|min:0',
            'price' => 'required|numeric|min:0.01|max:9999999.99',
            'description' => 'required|string|max:100',
            // 'room_image' => 'nullable|string|max:500|url',
        ];
    }
    public function messages()
    {
        return [
            'name.required' => 'El nombre es requerido',
            'name.unique' => 'El nombre ya está en uso.',
        ];
    }
}
