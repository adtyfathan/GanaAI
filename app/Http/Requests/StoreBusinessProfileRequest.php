<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBusinessProfileRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'business_name' => 'required|string|max:150',
            'business_type' => 'required|string|in:fashion,food_beverage,electronics,beauty,home_decor,handmade,education,services,others',
            'description' => 'required|string|max:1000',
            'vision_mission' => 'nullable|string|max:500',
            'uniqueness' => 'nullable|string|max:500',
            'target_audience' => 'required|string|max:255',
            'content_tone' => 'required|string|in:professional,friendly,inspirational,humorous,educational,luxurious,minimalist',
            'location' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'business_name.required' => 'Nama bisnis wajib diisi.',
            'business_name.max' => 'Nama bisnis maksimal 150 karakter.',
            'business_type.required' => 'Jenis bisnis wajib dipilih.',
            'description.required' => 'Deskripsi bisnis wajib diisi.',
            'description.max' => 'Deskripsi bisnis maksimal 1000 karakter.',
            'target_audience.required' => 'Target audiens wajib diisi.',
            'content_tone.required' => 'Nuansa konten wajib dipilih.',
            'location.required' => 'Lokasi bisnis wajib dipilih.',
            'logo.image' => 'Logo harus berupa gambar.',
            'logo.mimes' => 'Logo harus berformat JPEG, PNG, atau GIF.',
            'logo.max' => 'Ukuran logo maksimal 2MB.',
        ];
    }
}
