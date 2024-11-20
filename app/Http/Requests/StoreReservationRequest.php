<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
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
            'user_id' => 'required|exists:users,id',
            // 'room_id' => 'required|exists:rooms,id',
            'number_of_rooms' => 'required|integer|min:1',
            'number_of_people' => 'required|integer|min:1',
            'res_date' => 'nullable|date',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'total_price' => 'required|numeric|min:0|max:9999999.99',
            'status' => 'nullable|boolean',
            'type' => 'nullable|boolean',
        ];
    }
}
