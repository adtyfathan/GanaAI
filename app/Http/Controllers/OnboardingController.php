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
     * Show the unified onboarding page (business + product + social connect).
     */
    public function showOnboarding(Request $request)
    {
        $user = $request->user();

        $products = $user->products()->with('images')->get();

        // Akun sosmed yang sudah diconnect via Zernio
        $connectedAccounts = $user->socialAccounts()
            ->where('is_active', true)
            ->get(['id', 'platform', 'account_username', 'connected_at']);

        return Inertia::render('Onboarding/Onboarding', [
            'businessTypes' => $this->getBusinessTypes(),
            'contentTones' => $this->getContentTones(),
            'locations' => $this->getLocations(),
            'productTypes' => $this->getProductTypes(),
            'products' => $products,
            'productCount' => $products->count(),
            'businessProfile' => $user->businessProfile,
            'connectedAccounts' => $connectedAccounts,
            'socialSetId' => $user->businessProfile?->zernio_social_set_id,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Store (or update) the business profile.
     */
    public function storeBusinessProfile(StoreBusinessProfileRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        $logoPath = $user->businessProfile?->logo_path;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        $timezone = $this->getTimezoneFromLocation($validated['location']);

        $payload = [
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
        ];

        BusinessProfile::updateOrCreate(
            ['user_id' => $user->id],
            $payload
        );

        return redirect()->route('onboarding.form')
            ->with('success', 'Profil bisnis berhasil disimpan!');
    }

    /**
     * Store a new product.
     */
    public function storeProduct(StoreProductRequest $request)
    {
        $user = $request->user();

        if (!$user->businessProfile()->exists()) {
            return redirect()->route('onboarding.form');
        }

        $validated = $request->validated();

        $product = Product::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'product_type' => $validated['product_type'],
            'description' => $validated['description'],
            'price' => $validated['price'],
        ]);

        if ($request->hasFile('images')) {
            $sortOrder = 1;
            foreach ($request->file('images') as $image) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $image->store('products', 'public'),
                    'sort_order' => $sortOrder++,
                ]);
            }
        }

        return redirect()->route('onboarding.form')
            ->with('success', 'Produk berhasil ditambahkan!');
    }

    /**
     * Update an existing product.
     */
    public function updateProduct(Request $request, Product $product)
    {
        $user = $request->user();

        if ($product->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'product_type' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'kept_image_ids' => 'nullable|array',
            'kept_image_ids.*' => 'string|exists:product_images,id',
            'new_images' => 'nullable|array',
            'new_images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $product->update([
            'name' => $request->name,
            'product_type' => $request->product_type,
            'description' => $request->description,
            'price' => $request->price,
        ]);

        $keptIds = $request->input('kept_image_ids', []);
        $product->images()
            ->when(!empty($keptIds), fn($q) => $q->whereNotIn('id', $keptIds))
            ->when(empty($keptIds), fn($q) => $q)
            ->delete();

        if ($request->hasFile('new_images')) {
            $sortOrder = ($product->images()->max('sort_order') ?? 0) + 1;
            foreach ($request->file('new_images') as $image) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $image->store('products', 'public'),
                    'sort_order' => $sortOrder++,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'product' => $product->load('images'),
        ]);
    }

    /**
     * Soft-delete a product.
     */
    public function deleteProduct(Request $request, Product $product)
    {
        $user = $request->user();

        if ($product->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $product->images()->delete();
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus!',
        ]);
    }

    /**
     * Complete onboarding — minimal 1 produk + 1 akun sosmed terconnect.
     */
    public function completeOnboarding(Request $request)
    {
        $user = $request->user();

        if (!$user->hasCompletedOnboardingForm()) {
            return response()->json([
                'error' => 'Selesaikan setup bisnis, tambahkan minimal 1 produk, dan hubungkan minimal 1 akun sosial media.',
            ], 422);
        }

        $user->update(['completed_onboarding' => true]);

        return redirect()->route('dashboard');
    }

    // ─── Lookup helpers ────────────────────────────────────────────────────────

    private function getBusinessTypes(): array
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
        ];
    }

    private function getProductTypes(): array
    {
        return [
            'physical' => 'Produk Fisik',
            'digital' => 'Produk Digital',
            'service' => 'Layanan',
            'subscription' => 'Langganan',
        ];
    }

    private function getContentTones(): array
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

    private function getLocations(): array
    {
        return [
            'Jakarta' => 'Jakarta',
            'Bandung' => 'Bandung',
            'Surabaya' => 'Surabaya',
            'Medan' => 'Medan',
            'Semarang' => 'Semarang',
            'Makassar' => 'Makassar',
            'Palembang' => 'Palembang',
            'Tangerang' => 'Tangerang',
            'Depok' => 'Depok',
            'Bekasi' => 'Bekasi',
            'Yogyakarta' => 'Yogyakarta',
            'Bogor' => 'Bogor',
            'Batam' => 'Batam',
            'Pekanbaru' => 'Pekanbaru',
            'Manado' => 'Manado',
        ];
    }

    private function getTimezoneFromLocation(string $location): string
    {
        return match ($location) {
            'Makassar', 'Manado' => 'Asia/Makassar',
            default => 'Asia/Jakarta',
        };
    }
}