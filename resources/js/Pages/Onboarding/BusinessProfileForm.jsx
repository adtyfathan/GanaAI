import React from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Field, FieldLabel } from '@/components/ui/field';
import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
} from '@/Components/ui/input-group';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    BankIcon,
    Location01Icon,
    UserIcon,
    Target01Icon,
    NoteIcon,
    Image02Icon,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCls =
    'py-3 px-4 text-[14px] bg-neutral-50 border-neutral-200 focus:ring-orange-400/30 focus:border-orange-400 focus-visible:ring-orange-400/30 focus-visible:border-orange-400';

const selectCls =
    'py-3 px-4 h-auto text-[14px] bg-neutral-50 border-neutral-200 focus:ring-orange-400/30 focus:border-orange-400 data-[placeholder]:[&>span]:text-neutral-400';

// ─── Sub-components ───────────────────────────────────────────────────────────
function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="flex items-center gap-1.5 mt-1 text-xs text-red-500">
            <span aria-hidden="true">⚠</span>
            {message}
        </p>
    );
}

function toOptions(obj) {
    return Object.entries(obj ?? {}).map(([value, label]) => ({ value, label }));
}

// ─── BusinessProfileForm ──────────────────────────────────────────────────────
export default function BusinessProfileForm({
    businessTypes,
    contentTones,
    locations,
    businessProfile,
    onSuccess,
    variants,
    direction,
}) {
    const {
        data: bizData,
        setData: setBizData,
        post: postBiz,
        processing: bizProcessing,
        errors: bizErrors,
    } = useForm({
        business_name: businessProfile?.business_name || '',
        business_type: businessProfile?.business_type || '',
        description: businessProfile?.description || '',
        vision_mission: businessProfile?.vision_mission || '',
        uniqueness: businessProfile?.uniqueness || '',
        target_audience: businessProfile?.target_audience || '',
        content_tone: businessProfile?.content_tone || '',
        location: businessProfile?.location || '',
        logo: null,
    });

    const [previewLogo, setPreviewLogo] = React.useState(
        businessProfile?.logo_path ? `/storage/${businessProfile.logo_path}` : null
    );

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setBizData('logo', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewLogo(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        postBiz(route('onboarding.business.store'), {
            onSuccess: () => {
                toast.success('Profil bisnis berhasil disimpan!');
                onSuccess?.();
            },
        });
    };

    return (
        <motion.div
            key="step-1"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <h1 className="font-jakarta font-extrabold text-[26px] leading-tight tracking-tight text-neutral-900 mb-1">
                Atur Profil Bisnis Anda
            </h1>
            <p className="text-[14px] text-neutral-500 mb-8">
                Ceritakan tentang bisnis Anda agar AI bisa membuat konten yang tepat sasaran.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center shrink-0 overflow-hidden">
                        {previewLogo ? (
                            <img
                                src={previewLogo}
                                alt="Preview logo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <HugeiconsIcon icon={Image02Icon} size={22} className="text-neutral-300" />
                        )}
                    </div>
                    <Field className="flex-1 space-y-1.5">
                        <FieldLabel htmlFor="logo" className="text-[13px] font-semibold text-neutral-800">
                            Logo Bisnis
                        </FieldLabel>
                        <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="cursor-pointer text-[13px] file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 bg-neutral-50 border-neutral-200"
                        />
                        <p className="text-xs text-neutral-400">PNG, JPG · Maks. 2MB</p>
                        <FieldError message={bizErrors.logo} />
                    </Field>
                </div>

                {/* Nama Bisnis */}
                <Field className="space-y-1.5">
                    <FieldLabel htmlFor="business_name" className="text-[13px] font-semibold text-neutral-800">
                        Nama Bisnis
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupInput
                            id="business_name"
                            value={bizData.business_name}
                            onChange={(e) => setBizData('business_name', e.target.value)}
                            placeholder="Masukkan nama bisnis Anda"
                            className={inputCls}
                        />
                        <InputGroupAddon align="inline-start">
                            <HugeiconsIcon icon={BankIcon} size={16} className="text-neutral-400 mr-2" />
                        </InputGroupAddon>
                    </InputGroup>
                    <FieldError message={bizErrors.business_name} />
                </Field>

                {/* Jenis Bisnis + Lokasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field className="space-y-1.5">
                        <FieldLabel className="text-[13px] font-semibold text-neutral-800">
                            Jenis Bisnis
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon align="inline-start">
                                <HugeiconsIcon icon={UserIcon} size={16} className="text-neutral-400 mr-2" />
                            </InputGroupAddon>
                            <Select
                                value={bizData.business_type}
                                onValueChange={(v) => setBizData('business_type', v)}
                            >
                                <SelectTrigger className={`${selectCls} w-full`}>
                                    <SelectValue placeholder="Pilih jenis bisnis..." />
                                </SelectTrigger>
                                <SelectContent position="popper" className="bg-white border border-neutral-100 shadow-lg">
                                    <SelectGroup>
                                        <SelectLabel>Jenis Bisnis</SelectLabel>
                                        {toOptions(businessTypes).map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </InputGroup>
                        <FieldError message={bizErrors.business_type} />
                    </Field>

                    <Field className="space-y-1.5">
                        <FieldLabel className="text-[13px] font-semibold text-neutral-800">
                            Lokasi Bisnis
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon align="inline-start">
                                <HugeiconsIcon icon={Location01Icon} size={16} className="text-neutral-400 mr-2" />
                            </InputGroupAddon>
                            <Select
                                value={bizData.location}
                                onValueChange={(v) => setBizData('location', v)}
                            >
                                <SelectTrigger className={`${selectCls} w-full`}>
                                    <SelectValue placeholder="Pilih kota..." />
                                </SelectTrigger>
                                <SelectContent position="popper" className="bg-white border border-neutral-100 shadow-lg">
                                    <SelectGroup>
                                        <SelectLabel>Lokasi</SelectLabel>
                                        {toOptions(locations).map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </InputGroup>
                        <FieldError message={bizErrors.location} />
                    </Field>
                </div>

                {/* Deskripsi */}
                <Field className="space-y-1.5">
                    <FieldLabel htmlFor="description" className="text-[13px] font-semibold text-neutral-800">
                        Deskripsi Bisnis
                    </FieldLabel>
                    <Textarea
                        id="description"
                        value={bizData.description}
                        onChange={(e) => setBizData('description', e.target.value)}
                        placeholder="Jelaskan tentang bisnis Anda, produk, dan nilai yang ditawarkan..."
                        rows={3}
                        className={`${inputCls} resize-y`}
                    />
                    <FieldError message={bizErrors.description} />
                </Field>

                {/* Target Audiens + Nuansa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field className="space-y-1.5">
                        <FieldLabel htmlFor="target_audience" className="text-[13px] font-semibold text-neutral-800">
                            Target Audiens
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="target_audience"
                                value={bizData.target_audience}
                                onChange={(e) => setBizData('target_audience', e.target.value)}
                                placeholder="Contoh: Wanita 18–35 tahun"
                                className={inputCls}
                            />
                            <InputGroupAddon align="inline-start">
                                <HugeiconsIcon icon={Target01Icon} size={16} className="text-neutral-400 mr-2" />
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldError message={bizErrors.target_audience} />
                    </Field>

                    <Field className="space-y-1.5">
                        <FieldLabel className="text-[13px] font-semibold text-neutral-800">
                            Nuansa Konten
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupAddon align="inline-start">
                                <HugeiconsIcon icon={NoteIcon} size={16} className="text-neutral-400 mr-2" />
                            </InputGroupAddon>
                            <Select
                                value={bizData.content_tone}
                                onValueChange={(v) => setBizData('content_tone', v)}
                            >
                                <SelectTrigger className={`${selectCls} w-full`}>
                                    <SelectValue placeholder="Pilih nuansa konten..." />
                                </SelectTrigger>
                                <SelectContent position="popper" className="bg-white border border-neutral-100 shadow-lg">
                                    <SelectGroup>
                                        <SelectLabel>Nuansa Konten</SelectLabel>
                                        {toOptions(contentTones).map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>{label}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </InputGroup>
                        <FieldError message={bizErrors.content_tone} />
                    </Field>
                </div>

                {/* Visi & Misi */}
                <Field className="space-y-1.5">
                    <FieldLabel htmlFor="vision_mission" className="text-[13px] font-semibold text-neutral-800">
                        Visi &amp; Misi <span className="font-normal text-neutral-400">(opsional)</span>
                    </FieldLabel>
                    <Textarea
                        id="vision_mission"
                        value={bizData.vision_mission}
                        onChange={(e) => setBizData('vision_mission', e.target.value)}
                        placeholder="Apa visi dan misi bisnis Anda?"
                        rows={2}
                        className={`${inputCls} resize-y`}
                    />
                    <FieldError message={bizErrors.vision_mission} />
                </Field>

                {/* Keunikan */}
                <Field className="space-y-1.5">
                    <FieldLabel htmlFor="uniqueness" className="text-[13px] font-semibold text-neutral-800">
                        Keunikan Bisnis <span className="font-normal text-neutral-400">(opsional)</span>
                    </FieldLabel>
                    <Textarea
                        id="uniqueness"
                        value={bizData.uniqueness}
                        onChange={(e) => setBizData('uniqueness', e.target.value)}
                        placeholder="Apa yang membuat bisnis Anda berbeda dari kompetitor?"
                        rows={2}
                        className={`${inputCls} resize-y`}
                    />
                    <FieldError message={bizErrors.uniqueness} />
                </Field>

                {/* Submit */}
                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={bizProcessing}
                        className="group inline-flex items-center gap-2 h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[15px] px-7 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.28)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {bizProcessing ? 'Menyimpan...' : 'Lanjut ke Data Produk'}
                        {!bizProcessing && (
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                size={16}
                                className="transition-transform duration-200 group-hover:translate-x-1"
                            />
                        )}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}