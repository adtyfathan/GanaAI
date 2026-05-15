<?php

namespace App\Http\Controllers;

use App\Models\BusinessProfile;
use App\Models\Product;
use App\Models\ProductImage;
use App\Http\Requests\StoreBusinessProfileRequest;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    /**
     * Show the business profile setup form.
     */
    public function showBusinessForm(Request $request)
    {
        $user = $request->user();

        // Check if user already has business profile
        if ($user->businessProfile()->exists()) {
            return redirect()->route('onboarding.product.form');
        }

        return Inertia::render('Onboarding/BusinessSetup', [
            'businessTypes' => $this->getBusinessTypes(),
            'contentTones' => $this->getContentTones(),
            'brandColors' => $this->getBrandColors(),
            'locations' => $this->getLocations(), // Indonesian cities/regions
        ]);
    }

    /**
     * Store business profile data.
     */
    public function storeBusinessProfile(StoreBusinessProfileRequest $request)
    {
        $user = $request->user();

        // Check if business profile already exists
        if ($user->businessProfile()->exists()) {
            return redirect()->route('onboarding.product.form');
        }

        $validated = $request->validated();

        // Store logo if uploaded
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Determine timezone from location (simple mapping, can be enhanced)
        $timezone = $this->getTimezoneFromLocation($validated['location']);

        // Create business profile with dummy Zernio ID (will be set during OAuth)
        BusinessProfile::create([
            'user_id' => $user->id,
            'zernio_social_set_id' => null,
            'logo_path' => $logoPath,
            'business_name' => $validated['business_name'],
            'business_type' => $validated['business_type'],
            'description' => $validated['description'],
            'vision_mission' => $validated['vision_mission'] ?? null,
            'uniqueness' => $validated['uniqueness'] ?? null,
            'target_audience' => $validated['target_audience'],
            'content_tone' => $validated['content_tone'],
            'location' => $validated['location'],
            'timezone' => $timezone,
        ]);

        return redirect()->route('onboarding.product.form')->with('success', 'Profil bisnis berhasil disimpan!');
    }

    /**
     * Show the product setup form.
     */
    public function showProductForm(Request $request)
    {
        $user = $request->user();

        // Check if user has business profile
        if (!$user->businessProfile()->exists()) {
            return redirect()->route('onboarding.business.form');
        }

        $products = $user->products()->with('images')->get();

        return Inertia::render('Onboarding/ProductSetup', [
            'productTypes' => $this->getProductTypes(),
            'products' => $products,
            'productCount' => $products->count(),
        ]);
    }

    /**
     * Store product data.
     */
    public function storeProduct(StoreProductRequest $request)
    {
        $user = $request->user();

        // Check if user has business profile
        if (!$user->businessProfile()->exists()) {
            return redirect()->route('onboarding.business.form');
        }

        $validated = $request->validated();

        // Create product
        $product = Product::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'product_type' => $validated['product_type'],
            'description' => $validated['description'],
            'price' => $validated['price'],
        ]);

        // Store product images
        if ($request->hasFile('images')) {
            $sortOrder = 1;
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                    'sort_order' => $sortOrder++,
                ]);
            }
        }

        return redirect()->route('dashboard')->with('success', 'Produk berhasil ditambahkan!');
    }

    /**
     * Update product data.
     */
    public function updateProduct(StoreProductRequest $request, Product $product)
    {
        $user = $request->user();

        // Check authorization
        if ($product->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validated();

        // Update product
        $product->update([
            'name' => $validated['name'],
            'product_type' => $validated['product_type'],
            'description' => $validated['description'],
            'price' => $validated['price'],
        ]);

        // Handle image updates if provided
        if ($request->hasFile('images')) {
            // Delete old images
            $product->images()->delete();

            // Store new images
            $sortOrder = 1;
            foreach ($request->file('images') as $image) {
                $imagePath = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $imagePath,
                    'sort_order' => $sortOrder++,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diperbarui!',
            'product' => $product->load('images'),
        ]);
    }

    /**
     * Delete a product.
     */
    public function deleteProduct(Request $request, Product $product)
    {
        $user = $request->user();

        // Check authorization
        if ($product->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete product images
        $product->images()->delete();

        // Soft delete product
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus!',
        ]);
    }

    /**
     * Complete onboarding and redirect to dashboard.
     */
    public function completeOnboarding(Request $request)
    {
        $user = $request->user();

        // Verify user has completed both steps
        if (!$user->hasCompletedOnboarding()) {
            return response()->json([
                'error' => 'Anda harus menyelesaikan setup bisnis dan menambahkan minimal 1 produk.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Onboarding selesai! Silakan lanjut ke dashboard.',
            'redirect' => route('dashboard'),
        ]);
    }

    /**
     * Get business types dropdown.
     */
    private function getBusinessTypes()
    {
        return [
            'fashion' => 'Fashion & Pakaian',
            'food_beverage' => 'Makanan & Minuman',
            'electronics' => 'Elektronik',
            'beauty' => 'Kecantikan & Perawatan',
            'home_decor' => 'Dekorasi Rumah',
            'handmade' => 'Kerajinan Tangan',
            'education' => 'Pendidikan & Kursus',
            'services' => 'Jasa & Konsultasi',
            'others' => 'Lainnya',
        ];
    }

    /**
     * Get product types dropdown.
     */
    private function getProductTypes()
    {
        return [
            'physical' => 'Produk Fisik',
            'digital' => 'Produk Digital',
            'service' => 'Layanan',
            'subscription' => 'Langganan',
        ];
    }

    /**
     * Get content tone options.
     */
    private function getContentTones()
    {
        return [
            'professional' => 'Profesional & Serius',
            'friendly' => 'Ramah & Santai',
            'inspirational' => 'Inspiratif & Motivasi',
            'humorous' => 'Lucu & Menghibur',
            'educational' => 'Edukatif & Informatif',
            'luxurious' => 'Mewah & Premium',
            'minimalist' => 'Minimalis & Elegan',
        ];
    }

    /**
     * Get brand color options.
     */
    private function getBrandColors()
    {
        return [
            'green' => 'Hijau Tua (Kepercayaan & Pertumbuhan)',
            'gold' => 'Kuning Emas (Semangat & Energi)',
            'blue' => 'Biru (Profesional & Terpercaya)',
            'pink' => 'Pink (Kreatif & Menarik)',
            'orange' => 'Oranye (Dinamis & Optimis)',
            'purple' => 'Ungu (Misterius & Eksklusif)',
        ];
    }

    /**
     * Get Indonesian locations/cities.
     */
    private function getLocations()
    {
        return [
            'Jakarta' => 'Jakarta',
            'Bandung' => 'Bandung',
            'Surabaya' => 'Surabaya',
            'Medan' => 'Medan',
            'Semarang' => 'Semarang',
            'Makassar' => 'Makassar',
            'Palembang' => 'Palembang',
            'Tanggerang' => 'Tangerang',
            'Depok' => 'Depok',
            'Bekasi' => 'Bekasi',
            'Jogjakarta' => 'Yogyakarta',
            'Bogor' => 'Bogor',
            'Batam' => 'Batam',
            'Pekanbaru' => 'Pekanbaru',
            'Manado' => 'Manado',
        ];
    }

    /**
     * Map location to IANA timezone.
     */
    private function getTimezoneFromLocation($location)
    {
        $timezones = [
            'Jakarta' => 'Asia/Jakarta',
            'Bandung' => 'Asia/Jakarta',
            'Surabaya' => 'Asia/Jakarta',
            'Medan' => 'Asia/Jakarta',
            'Semarang' => 'Asia/Jakarta',
            'Makassar' => 'Asia/Makassar',
            'Palembang' => 'Asia/Jakarta',
            'Tanggerang' => 'Asia/Jakarta',
            'Depok' => 'Asia/Jakarta',
            'Bekasi' => 'Asia/Jakarta',
            'Jogjakarta' => 'Asia/Jakarta',
            'Bogor' => 'Asia/Jakarta',
            'Batam' => 'Asia/Jakarta',
            'Pekanbaru' => 'Asia/Jakarta',
            'Manado' => 'Asia/Makassar',
        ];

        return $timezones[$location] ?? 'Asia/Jakarta';
    }
}
