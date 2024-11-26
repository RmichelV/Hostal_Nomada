<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplyRequest extends FormRequest
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
    public function rules()
    {
        return [
            'name' => 'required|string|max:25',
            'description' => 'nullable|string|max:55',
            'supply_image' => 'nullable|string|max:500',
            'icon' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:1|max:9999999.99',
        ];
    }
}