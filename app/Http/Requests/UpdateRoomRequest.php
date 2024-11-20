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
            'room_type_id' => 'required|exists:room_types,id',
            'name' => 'required|string|max:25|unique:rooms,name,' . $roomId,
            'status' => 'required|in:Ocupada,Libre,No acceso',
        ];
    }
}
