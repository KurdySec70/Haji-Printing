<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'type' => 'required|in:pcs,kg,width*height',
            'width' => 'required_if:type,width*height|nullable|numeric|min:0',
            'height' => 'required_if:type,width*height|nullable|numeric|min:0'
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.string' => 'Product name must be a string.',
            'name.max' => 'Product name may not be greater than 255 characters.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a number.',
            'price.min' => 'Price must be at least 0.',
            'type.required' => 'Product type is required.',
            'type.in' => 'Product type must be one of: pcs, kg, width*height.',
            'width.required_if' => 'Width is required when type is width*height.',
            'width.numeric' => 'Width must be a number.',
            'width.min' => 'Width must be at least 0.',
            'height.required_if' => 'Height is required when type is width*height.',
            'height.numeric' => 'Height must be a number.',
            'height.min' => 'Height must be at least 0.'
        ];
    }
}
