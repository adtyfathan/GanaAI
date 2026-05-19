<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->routeIs('onboarding.product.update');

        if ($isUpdate) {
            return [
                'name' => 'required|string|max:150',
                'product_type' => 'required|string|in:physical,digital,service,subscription',
                'description' => 'required|string|max:500',
                'price' => 'required|numeric|min:0|max:999999999.99',
                'kept_image_ids' => 'nullable|array',
                'kept_image_ids.*' => 'integer',
                'new_images' => 'nullable|array|max:5',
                'new_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
            ];
        }

        return [
            'name' => 'required|string|max:150',
            'product_type' => 'required|string|in:physical,digital,service,subscription',
            'description' => 'required|string|max:500',
            'price' => 'required|numeric|min:0|max:999999999.99',
            'images' => 'nullable|array|min:1|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'name.max' => 'Nama produk maksimal 150 karakter.',
            'product_type.required' => 'Jenis produk wajib dipilih.',
            'description.required' => 'Deskripsi produk wajib diisi.',
            'description.max' => 'Deskripsi produk maksimal 500 karakter.',
            'price.required' => 'Harga produk wajib diisi.',
            'price.numeric' => 'Harga produk harus berupa angka.',
            'price.min' => 'Harga produk tidak boleh negatif.',
            'images.array' => 'Gambar harus berupa array.',
            'images.min' => 'Minimal 1 gambar produk diperlukan.',
            'images.max' => 'Maksimal 5 gambar produk diizinkan.',
            'images.*.image' => 'Setiap file harus berupa gambar.',
            'images.*.mimes' => 'Gambar harus berformat JPEG, PNG, atau GIF.',
            'images.*.max' => 'Ukuran setiap gambar maksimal 5MB.',
            'new_images.max' => 'Maksimal 5 gambar produk diizinkan.',
            'new_images.*.image' => 'Setiap file harus berupa gambar.',
            'new_images.*.mimes' => 'Gambar harus berformat JPEG, PNG, atau GIF.',
            'new_images.*.max' => 'Ukuran setiap gambar maksimal 5MB.',
        ];
    }
}