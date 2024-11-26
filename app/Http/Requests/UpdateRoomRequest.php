<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize()
    {
        return true; 
    }

    public function rules()
    {
        $roomId = $this->route('room'); 

        return [
            'room_type_id' => ['required', 'integer', 'exists:room_types,id'],
            'name' => ['required', 'string', 'max:15', 'regex:/^[a-zA-Z0-9]+$/','unique:rooms,name,' . $roomId],
            'status' => 'required|in:Ocupada,Libre,No acceso',
        ];
    }
}
