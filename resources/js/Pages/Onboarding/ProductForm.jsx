import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Image02Icon, ArrowLeft01Icon, ArrowRight01Icon,
    Delete02Icon, PlusSignIcon, ProductLoadingIcon,
    BrochureIcon, MoneyBag02Icon, PencilEdit02Icon,
} from '@hugeicons/core-free-icons';
import {
    InputGroup, InputGroupInput, InputGroupAddon,
} from '@/Components/ui/input-group';

// ─── Shared styles ─────────────────────────────────────────────────────────
const inputCls =
    'py-3 px-4 text-[14px] bg-neutral-50 border-neutral-200 focus:ring-orange-400/30 focus:border-orange-400 focus-visible:ring-orange-400/30 focus-visible:border-orange-400';
const selectCls =
    'py-3 px-4 h-auto text-[14px] bg-neutral-50 border-neutral-200 focus:ring-orange-400/30 focus:border-orange-400 data-[placeholder]:[&>span]:text-neutral-400';

function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="flex items-center gap-1.5 mt-1 text-xs text-red-500">
            <span aria-hidden="true">⚠</span>{message}
        </p>
    );
}

function toOptions(obj) {
    return Object.entries(obj ?? {}).map(([value, label]) => ({ value, label }));
}

// ─── Edit Product Dialog ───────────────────────────────────────────────────
function EditProductDialog({ product, productTypes, open, onClose, onUpdated }) {
    const [form, setForm] = useState({
        name: '', product_type: '', description: '', price: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Unified image list — setiap item bisa existing atau baru
    // { type: 'existing', id, image_path } | { type: 'new', file, preview }
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name ?? '',
                product_type: product.product_type ?? '',
                description: product.description ?? '',
                price: product.price ?? '',
            });
            setImages(
                (product.images ?? []).map(img => ({
                    type: 'existing',
                    id: img.id,
                    image_path: img.image_path,
                }))
            );
            setErrors({});
        }
    }, [product]);

    const handleAddImages = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            alert('Maksimal 5 gambar total.');
            e.target.value = '';
            return;
        }
        const newItems = files.map(file => ({
            type: 'new',
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages(prev => [...prev, ...newItems]);
        e.target.value = '';
    };

    const removeImage = (index) => {
        setImages(prev => {
            const item = prev[index];
            // Revoke object URL untuk gambar baru agar tidak memory leak
            if (item.type === 'new') URL.revokeObjectURL(item.preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async () => {
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', form.name);
        formData.append('product_type', form.product_type);
        formData.append('description', form.description);
        formData.append('price', form.price);

        // Kirim ID gambar existing yang masih ada (yang tidak dihapus)
        images
            .filter(img => img.type === 'existing')
            .forEach(img => formData.append('kept_image_ids[]', img.id));

        // Kirim file gambar baru
        images
            .filter(img => img.type === 'new')
            .forEach(img => formData.append('new_images[]', img.file));

        try {
            const res = await axios.post(
                route('onboarding.product.update', product.id),
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            onUpdated(res.data.product);
            onClose();
            toast.success('Produk berhasil diperbarui!');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="!max-w-2xl w-[calc(100%-2rem)] bg-white rounded-2xl p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-neutral-100">
                    <DialogTitle className="font-jakarta font-bold text-[17px] text-neutral-900">
                        Edit Produk
                    </DialogTitle>
                    <p className="text-[13px] text-neutral-500 mt-0.5">
                        Perbarui data dan gambar produk Anda.
                    </p>
                </DialogHeader>

                <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* Nama */}
                        <Field className="space-y-1.5 sm:col-span-1">
                            <FieldLabel className="text-[13px] font-semibold text-neutral-800">Nama Produk</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Kaos Premium"
                                    className={inputCls}
                                />
                                <InputGroupAddon align="inline-start">
                                    <HugeiconsIcon icon={ProductLoadingIcon} size={16} className="text-neutral-400 mr-2" />
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldError message={errors.name?.[0]} />
                        </Field>

                        {/* Jenis */}
                        <Field className="space-y-1.5 sm:col-span-1">
                            <FieldLabel className="text-[13px] font-semibold text-neutral-800">Jenis Produk</FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <HugeiconsIcon icon={BrochureIcon} size={16} className="text-neutral-400 mr-2" />
                                </InputGroupAddon>
                                <Select
                                    value={form.product_type}
                                    onValueChange={v => setForm(f => ({ ...f, product_type: v }))}
                                >
                                    <SelectTrigger className={`${selectCls} w-full`}>
                                        <SelectValue placeholder="Pilih jenis..." />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="bg-white border border-neutral-100 shadow-lg">
                                        <SelectGroup>
                                            <SelectLabel>Jenis Produk</SelectLabel>
                                            {toOptions(productTypes).map(({ value, label }) => (
                                                <SelectItem key={value} value={value}>{label}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </InputGroup>
                            <FieldError message={errors.product_type?.[0]} />
                        </Field>

                        {/* Harga */}
                        <Field className="space-y-1.5 sm:col-span-1">
                            <FieldLabel className="text-[13px] font-semibold text-neutral-800">Harga (Rp)</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    type="number"
                                    value={form.price}
                                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                    placeholder="100000"
                                    className={inputCls}
                                />
                                <InputGroupAddon align="inline-start">
                                    <HugeiconsIcon icon={MoneyBag02Icon} size={16} className="text-neutral-400 mr-2" />
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldError message={errors.price?.[0]} />
                        </Field>

                        {/* Deskripsi */}
                        <Field className="space-y-1.5 sm:col-span-2">
                            <FieldLabel className="text-[13px] font-semibold text-neutral-800">Deskripsi Produk</FieldLabel>
                            <Textarea
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Fitur, manfaat, dan detail produk..."
                                rows={2}
                                className={`${inputCls} resize-y`}
                            />
                            <FieldError message={errors.description?.[0]} />
                        </Field>

                        {/* Gambar — unified list */}
                        <div className="sm:col-span-2 space-y-3">
                            <FieldLabel className="text-[13px] font-semibold text-neutral-800">
                                Gambar Produk
                                <span className="font-normal text-neutral-400 ml-1">({images.length}/5)</span>
                            </FieldLabel>

                            {/* Grid gambar */}
                            {images.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {images.map((img, i) => (
                                        <div
                                            key={i}
                                            className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 group"
                                        >
                                            <img
                                                src={img.type === 'existing'
                                                    ? `/storage/${img.image_path}`
                                                    : img.preview
                                                }
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Badge new */}
                                            {img.type === 'new' && (
                                                <span className="absolute bottom-0.5 left-0.5 text-[8px] font-bold bg-orange-500 text-white px-1 rounded">
                                                    Baru
                                                </span>
                                            )}
                                            {/* Tombol hapus */}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-red-500 flex items-center justify-center transition-all"
                                            >
                                                <HugeiconsIcon icon={Delete02Icon} size={10} className="text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload tombol — hanya tampil jika < 5 */}
                            {images.length < 5 && (
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleAddImages}
                                    className="cursor-pointer text-[13px] file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 bg-neutral-50 border-neutral-200"
                                />
                            )}
                            <FieldError message={errors['new_images']?.[0]} />
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-[13px] font-semibold text-neutral-500 hover:text-neutral-800 transition-colors px-4 py-2"
                    >
                        Batal
                    </button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={processing}
                        className="h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[13px] px-5 py-2.5 rounded-lg shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeleteConfirmDialog({ open, onClose, onConfirm, productName }) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white rounded-2xl border-neutral-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-jakarta font-bold text-[17px] text-neutral-900">
                        Hapus Produk?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[13px] text-neutral-500">
                        Produk <span className="font-semibold text-neutral-700">"{productName}"</span> akan dihapus permanen dan tidak bisa dikembalikan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="text-[13px] font-semibold border-neutral-200 hover:bg-neutral-50">
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white text-[13px] font-semibold font-jakarta"
                    >
                        Hapus Produk
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ─── Product Card — tambah onClick + edit icon ─────────────────────────────
function ProductCard({ product, onDelete, onEdit }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.25 }}
            onClick={() => onEdit(product)}
            className="border border-neutral-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
        >
            <div className="h-36 bg-neutral-50 overflow-hidden relative">
                {product.images?.length > 0 ? (
                    <img
                        src={`/storage/${product.images[0].image_path}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <HugeiconsIcon icon={Image02Icon} size={32} className="text-neutral-300" />
                    </div>
                )}

                {/* Delete button (top-right) — stop propagation agar tidak trigger edit */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(product.id, product.name); }}
                    className="absolute cursor-pointer top-2 right-2 w-7 h-7 rounded-full bg-black/80 hover:bg-red-500 flex items-center justify-center transition-opacity shadow-sm z-10"
                >
                    <HugeiconsIcon icon={Delete02Icon} size={14} className="text-white" />
                </button>
            </div>
            <div className="p-3.5">
                <h3 className="font-semibold text-neutral-900 text-[13px] mb-0.5 truncate">{product.name}</h3>
                <p className="text-[12px] text-neutral-500 mb-2.5 line-clamp-1">{product.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-neutral-800">
                        Rp {parseInt(product.price).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                        {product.product_type}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// ─── ProductForm (main export) ─────────────────────────────────────────────
export default function ProductForm({
    productTypes, products: initialProducts = [], productCount = 0,
    businessSaved, onBack, onComplete, variants, direction,
}) {
    const {
        data: prodData, setData: setProdData, post: postProd,
        processing: prodProcessing, errors: prodErrors, reset: resetProd,
    } = useForm({ name: '', product_type: '', description: '', price: '', images: [] });

    const [products, setProducts] = useState(initialProducts);
    const [previewImages, setPreviewImages] = useState([]);
    const [showProductForm, setShowProductForm] = useState(productCount === 0);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, productId: null, productName: '' });

    // Edit dialog state
    const [editingProduct, setEditingProduct] = useState(null);

    const handleImagesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const combined = [...(prodData.images || []), ...newFiles];
        if (combined.length > 5) { alert('Maksimal 5 gambar.'); return; }
        setProdData('images', combined);
        Promise.all(newFiles.map(f => new Promise(res => {
            const r = new FileReader();
            r.onloadend = () => res(r.result);
            r.readAsDataURL(f);
        }))).then(previews => setPreviewImages(prev => [...prev, ...previews]));
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        postProd(route('onboarding.product.store'), {
            forceFormData: true,
            onSuccess: (page) => {
                setProducts(page.props.products ?? products);
                resetProd();
                setPreviewImages([]);
                setShowProductForm(false);
                toast.success('Produk berhasil ditambahkan!');
            },
        });
    };

    const handleDeleteProduct = (productId, productName) => {
        setDeleteConfirm({ open: true, productId, productName });
    };

    const confirmDelete = () => {
        const productId = deleteConfirm.productId;
        setDeleteConfirm({ open: false, productId: null, productName: '' });

        axios.delete(route('onboarding.product.delete', productId))
            .then(() => {
                setProducts(prev => prev.filter(p => p.id !== productId));
                toast.success('Produk berhasil dihapus!');
            })
            .catch(() => toast.error('Gagal menghapus produk.'));
    };

    // Setelah update berhasil, ganti data produk di state lokal
    const handleProductUpdated = (updatedProduct) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const handleComplete = () => {
        if (products.length === 0) { alert('Tambahkan minimal 1 produk untuk melanjutkan.'); return; }
        onComplete?.();
    };

    return (
        <>
            <motion.div
                key="step-2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-1">
                    <div>
                        <h1 className="font-jakarta font-extrabold text-[26px] leading-tight tracking-tight text-neutral-900">
                            Tambahkan Data Produk
                        </h1>
                        <p className="text-[14px] text-neutral-500 mt-1 mb-6">
                            Upload minimal 1 produk sebagai referensi visual untuk AI.
                        </p>
                    </div>
                </div>

                {/* Product grid */}
                {products.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[14px] font-semibold text-neutral-700">
                                Produk Anda
                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold">
                                    {products.length}
                                </span>
                            </h2>
                            <p className="text-[11px] text-neutral-400">Klik kartu untuk edit</p>
                        </div>
                        <AnimatePresence>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {products.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onDelete={handleDeleteProduct}
                                        onEdit={setEditingProduct}
                                    />
                                ))}
                            </div>
                        </AnimatePresence>
                    </div>
                )}

                {/* Toggle add product form */}
                {!showProductForm && (
                    <button
                        type="button"
                        onClick={() => setShowProductForm(true)}
                        className="w-full mb-6 flex items-center justify-center gap-2 border-2 border-dashed border-neutral-200 hover:border-orange-300 rounded-xl py-4 text-[13px] font-semibold text-neutral-500 hover:text-orange-600 transition-all duration-200 hover:bg-orange-50/40 group"
                    >
                        <HugeiconsIcon icon={PlusSignIcon} size={16} className="transition-transform duration-200 group-hover:rotate-90" />
                        Tambah Produk {products.length > 0 ? 'Lagi' : 'Pertama'}
                    </button>
                )}

                {/* Add product form */}
                <AnimatePresence>
                    {showProductForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -8 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -8 }}
                            transition={{ duration: 0.28, ease: 'easeInOut' }}
                            className="overflow-hidden mb-6"
                        >
                            <div className="border border-neutral-200 rounded-xl bg-white p-6">
                                <h3 className="text-[15px] font-jakarta font-bold text-neutral-900 mb-5">Produk Baru</h3>
                                <form onSubmit={handleProductSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field className="space-y-1.5 sm:col-span-1">
                                            <FieldLabel htmlFor="prod_name" className="text-[13px] font-semibold text-neutral-800">Nama Produk</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput id="prod_name" value={prodData.name} onChange={e => setProdData('name', e.target.value)} placeholder="Kaos Premium" className={inputCls} />
                                                <InputGroupAddon align="inline-start"><HugeiconsIcon icon={ProductLoadingIcon} size={16} className="text-neutral-400 mr-2" /></InputGroupAddon>
                                            </InputGroup>
                                            <FieldError message={prodErrors.name} />
                                        </Field>
                                        <Field className="space-y-1.5 sm:col-span-1">
                                            <FieldLabel className="text-[13px] font-semibold text-neutral-800">Jenis Produk</FieldLabel>
                                            <InputGroup>
                                                <InputGroupAddon align="inline-start"><HugeiconsIcon icon={BrochureIcon} size={16} className="text-neutral-400 mr-2" /></InputGroupAddon>
                                                <Select value={prodData.product_type} onValueChange={v => setProdData('product_type', v)}>
                                                    <SelectTrigger className={`${selectCls} w-full`}><SelectValue placeholder="Pilih jenis..." /></SelectTrigger>
                                                    <SelectContent position="popper" className="bg-white border border-neutral-100 shadow-lg">
                                                        <SelectGroup>
                                                            <SelectLabel>Jenis Produk</SelectLabel>
                                                            {toOptions(productTypes).map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </InputGroup>
                                            <FieldError message={prodErrors.product_type} />
                                        </Field>
                                        <Field className="space-y-1.5 sm:col-span-1">
                                            <FieldLabel htmlFor="prod_price" className="text-[13px] font-semibold text-neutral-800">Harga (Rp)</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput id="prod_price" type="number" value={prodData.price} onChange={e => setProdData('price', e.target.value)} placeholder="100000" className={inputCls} />
                                                <InputGroupAddon align="inline-start"><HugeiconsIcon icon={MoneyBag02Icon} size={16} className="text-neutral-400 mr-2" /></InputGroupAddon>
                                            </InputGroup>
                                            <FieldError message={prodErrors.price} />
                                        </Field>
                                        <Field className="space-y-1.5 sm:col-span-2">
                                            <FieldLabel htmlFor="prod_desc" className="text-[13px] font-semibold text-neutral-800">Deskripsi Produk</FieldLabel>
                                            <Textarea id="prod_desc" value={prodData.description} onChange={e => setProdData('description', e.target.value)} placeholder="Fitur, manfaat, dan detail produk..." rows={2} className={`${inputCls} resize-y`} />
                                            <FieldError message={prodErrors.description} />
                                        </Field>
                                        <div className="sm:col-span-2">
                                            <Field className="space-y-1.5">
                                                <FieldLabel htmlFor="prod_images" className="text-[13px] font-semibold text-neutral-800">
                                                    Gambar Produk <span className="font-normal text-neutral-400 ml-1">(1–5 gambar)</span>
                                                </FieldLabel>
                                                <Input id="prod_images" type="file" multiple accept="image/*" onChange={handleImagesChange} className="cursor-pointer text-[13px] file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 bg-neutral-50 border-neutral-200" />
                                                <FieldError message={prodErrors.images} />
                                            </Field>
                                            {previewImages.length > 0 && (
                                                <div className="mt-3 flex gap-2 flex-wrap">
                                                    {previewImages.map((src, i) => (
                                                        <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-neutral-200">
                                                            <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                                            <span className="absolute bottom-0.5 right-0.5 bg-black/50 text-white text-[9px] rounded px-1">{i + 1}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                                        <button type="button" onClick={() => { setShowProductForm(false); resetProd(); setPreviewImages([]); }} className="text-[13px] font-semibold text-neutral-500 hover:text-neutral-800 transition-colors px-4 py-2">Batal</button>
                                        <Button type="submit" disabled={prodProcessing} className="h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[13px] px-5 py-2.5 rounded-lg shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                                            {prodProcessing ? 'Menyimpan...' : 'Simpan Produk'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom navigation */}
                {!showProductForm && (
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <button type="button" onClick={onBack} className="group inline-flex items-center gap-2 h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[15px] px-7 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.28)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                            Kembali ke Profil Bisnis
                        </button>
                        {products.length > 0 ? (
                            <Button type="button" onClick={handleComplete} className="group inline-flex items-center gap-2 h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[15px] px-7 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.28)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                                Lanjut ke Media Sosial
                                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                            </Button>
                        ) : (
                            <p className="text-[13px] text-neutral-400">Tambahkan minimal 1 produk untuk melanjutkan.</p>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Edit Dialog — di luar motion.div agar tidak terpengaruh animasi */}
            <EditProductDialog
                product={editingProduct}
                productTypes={productTypes}
                open={!!editingProduct}
                onClose={() => setEditingProduct(null)}
                onUpdated={handleProductUpdated}
            />

            <DeleteConfirmDialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, productId: null, productName: '' })}
                onConfirm={confirmDelete}
                productName={deleteConfirm.productName}
            />
        </>
    );
}