import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import OnboardingLayout from '@/Layouts/OnboardingLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import FileInput from '@/Components/FileInput';
import SelectInput from '@/Components/SelectInput';
import TextAreaInput from '@/Components/TextAreaInput';

export default function ProductSetup({ productTypes, products: initialProducts, productCount }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        product_type: '',
        description: '',
        price: '',
        images: [],
    });

    const [products, setProducts] = useState(initialProducts);
    const [previewImages, setPreviewImages] = useState([]);
    const [showForm, setShowForm] = useState(productCount === 0);
    const [editingId, setEditingId] = useState(null);

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);

        // Create previews
        const previews = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previews).then((results) => setPreviewImages(results));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('product_type', data.product_type);
        formData.append('description', data.description);
        formData.append('price', data.price);
        data.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        // Use post with onSuccess callback
        post(route('onboarding.product.store'), {
            data: formData,
            onSuccess: () => {
                // Refetch products
                fetchProducts();
                reset();
                setPreviewImages([]);
                setShowForm(false);
            },
        });
    };

    const fetchProducts = () => {
        // In a real scenario, you'd fetch from the API
        // For now, we'll update the local state
        // This is handled by Inertia's automatic reload
    };

    const handleDeleteProduct = (productId) => {
        if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            // Make delete request
            fetch(route('onboarding.product.delete', productId), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
            })
                .then(() => {
                    setProducts(products.filter((p) => p.id !== productId));
                })
                .catch((error) => console.error('Error:', error));
        }
    };

    const handleContinue = () => {
        if (products.length === 0) {
            alert('Anda harus menambahkan minimal 1 produk untuk melanjutkan.');
            return;
        }

        fetch(route('onboarding.complete'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    window.location.href = data.redirect;
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    return (
        <OnboardingLayout step={2} totalSteps={2}>
            <div className="min-h-screen bg-white pt-16 pb-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                            Tambahkan Data Produk
                        </h1>
                        <p className="text-lg text-gray-600">
                            Unggah minimal 1 produk sebagai referensi konten AI Anda
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-12 flex items-center justify-center gap-2">
                        <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: '#FF6D2C' }}></div>
                        <span className="text-sm font-medium text-gray-600">Step 2 dari 2</span>
                        <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: '#FF6D2C' }}></div>
                    </div>

                    {/* Products List */}
                    {products.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk Anda ({products.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {/* Product Image */}
                                        <div className="bg-gray-100 h-48 overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${product.images[0].image_path}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    Tidak ada gambar
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-gray-900">
                                                    Rp {parseInt(product.price).toLocaleString('id-ID')}
                                                </span>
                                                <span
                                                    className="text-xs font-medium px-2 py-1 rounded"
                                                    style={{
                                                        backgroundColor: '#FDF3EA',
                                                        color: '#2E2F35',
                                                    }}
                                                >
                                                    {product.product_type}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="w-full text-red-600 hover:text-red-700 font-medium text-sm py-2 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                            >
                                                Hapus Produk
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add Product Button */}
                    {!showForm && (
                        <div className="mb-12 text-center">
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-8 py-3 rounded-lg font-semibold text-white transition-colors"
                                style={{ backgroundColor: '#FF6D2C' }}
                            >
                                + Tambah Produk Lagi
                            </button>
                        </div>
                    )}

                    {/* Add Product Form */}
                    {showForm && (
                        <div className="mb-12 p-8 border border-gray-200 rounded-lg bg-gray-50">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                {editingId ? 'Edit Produk' : 'Produk Baru'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Product Name */}
                                    <div className="md:col-span-1">
                                        <InputLabel htmlFor="name" value="Nama Produk" className="mb-2" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: Kaos Premium Lengan Panjang"
                                            className="w-full"
                                        />
                                        {errors.name && <InputError message={errors.name} />}
                                    </div>

                                    {/* Product Type */}
                                    <div className="md:col-span-1">
                                        <InputLabel htmlFor="product_type" value="Jenis Produk" className="mb-2" />
                                        <SelectInput
                                            id="product_type"
                                            name="product_type"
                                            value={data.product_type}
                                            onChange={(e) => setData('product_type', e.target.value)}
                                            options={productTypes}
                                            className="w-full"
                                        />
                                        {errors.product_type && <InputError message={errors.product_type} />}
                                    </div>

                                    {/* Price */}
                                    <div className="md:col-span-1">
                                        <InputLabel htmlFor="price" value="Harga Produk (Rp)" className="mb-2" />
                                        <TextInput
                                            id="price"
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="100000"
                                            className="w-full"
                                        />
                                        {errors.price && <InputError message={errors.price} />}
                                    </div>

                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="description" value="Deskripsi Produk" className="mb-2" />
                                        <TextAreaInput
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Jelaskan fitur, manfaat, dan detail penting produk Anda..."
                                            rows="3"
                                            className="w-full"
                                        />
                                        {errors.description && <InputError message={errors.description} />}
                                    </div>

                                    {/* Images */}
                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="images" value="Gambar Produk (1-5 Gambar)" className="mb-2" />
                                        <FileInput
                                            id="images"
                                            name="images"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImagesChange}
                                            className="mb-4"
                                        />
                                        {errors.images && <InputError message={errors.images} />}

                                        {/* Image Previews */}
                                        {previewImages.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm font-medium text-gray-700 mb-3">
                                                    Preview ({previewImages.length} gambar)
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                                    {previewImages.map((preview, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-lg"
                                                            />
                                                            <span className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Buttons */}
                                <div className="flex gap-4 justify-end pt-4">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            reset();
                                            setPreviewImages([]);
                                            setEditingId(null);
                                        }}
                                    >
                                        Batal
                                    </SecondaryButton>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                        style={{ backgroundColor: '#FF6D2C' }}
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Produk'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Continue Button */}
                    {!showForm && products.length > 0 && (
                        <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
                            <PrimaryButton
                                onClick={handleContinue}
                                className="px-8 py-3"
                                style={{ backgroundColor: '#FF6D2C' }}
                            >
                                Lanjut ke Dashboard
                            </PrimaryButton>
                        </div>
                    )}
                </div>
            </div>
        </OnboardingLayout>
    );
}
