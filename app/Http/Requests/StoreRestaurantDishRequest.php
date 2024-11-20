<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRestaurantDishRequest extends FormRequest
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
            'dishname' => 'required|string|max:25',
            'description' => 'required|string|max:55',
            'price' => 'required|numeric|min:1|max:999999.99',
            // 'dish_image' => 'nullable|string|max:300',
        ];
    }
}
