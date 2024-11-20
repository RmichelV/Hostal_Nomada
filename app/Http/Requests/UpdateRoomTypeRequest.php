<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomTypeRequest extends FormRequest
{
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        $roomTypeId = $this->route('room_type'); 

        return [
            'name' => 'required|string|max:25|unique:room_types,name,' . $roomTypeId,
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
