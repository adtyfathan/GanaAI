import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import OnboardingLayout from '@/Layouts/OnboardingLayout';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */

/** Render a validation error */
function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="flex items-center gap-1.5 mt-1 text-xs text-red-500">
            <span aria-hidden="true">⚠</span>
            {message}
        </p>
    );
}

/** Convert plain { key: label } object coming from Laravel controller */
function toOptions(obj) {
    return Object.entries(obj ?? {}).map(([value, label]) => ({ value, label }));
}

/** Reusable section card with icon + title + separator */
function SectionCard({ icon, title, children }) {
    return (
        <Card className="mb-5 border border-neutral-100 shadow-none rounded-2xl overflow-hidden">
            <CardHeader className="px-7 pt-5 pb-0">
                <CardTitle className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-[15px] shrink-0">
                        {icon}
                    </span>
                    <span className="font-jakarta font-bold text-[11px] tracking-[0.07em] uppercase text-neutral-600">
                        {title}
                    </span>
                </CardTitle>
            </CardHeader>
            <Separator className="mx-7 my-4 w-auto" />
            <CardContent className="px-7 pb-6">
                {children}
            </CardContent>
        </Card>
    );
}

/* ─────────────────────────────────────────
   Page component
───────────────────────────────────────── */
export default function BusinessSetup({ businessTypes, contentTones, locations }) {
    const { data, setData, post, processing, errors } = useForm({
        business_name: '',
        business_type: '',
        description: '',
        vision_mission: '',
        uniqueness: '',
        target_audience: '',
        content_tone: '',
        location: '',
        logo: null,
    });

    const [previewLogo, setPreviewLogo] = useState(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('logo', file);
        const reader = new FileReader();
        reader.onloadend = () => setPreviewLogo(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('onboarding.business.store'));
    };

    return (
        <OnboardingLayout step={1} totalSteps={2}>

            {/* ── float animation (single @keyframes – no other inline styles) ── */}
            <style>{`@keyframes mascot-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

            <div className="min-h-screen bg-[#FAFAF8] font-dm">
                <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-[calc(100vh-64px)]">

                    {/* ══════════════════════════════
                        LEFT — form column
                    ══════════════════════════════ */}
                    <div className="border-r border-neutral-100 px-6 pt-12 pb-24 sm:px-10 lg:px-14">

                        {/* step badge */}
                        <Badge className="mb-5 inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.09em] uppercase hover:bg-orange-50 cursor-default">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            Langkah 1 dari 2
                        </Badge>

                        <h1 className="font-jakarta font-extrabold text-[28px] leading-tight tracking-tight text-neutral-900 mb-2">
                            Atur Profil Bisnis Anda
                        </h1>
                        <p className="text-[15px] text-neutral-500 leading-relaxed mb-9 max-w-lg">
                            Lengkapi data bisnis untuk personalisasi konten AI Anda secara otomatis dan tepat sasaran
                        </p>

                        {/* progress bar */}
                        <div className="flex items-center gap-3 mb-10">
                            <Progress
                                value={50}
                                className="flex-1 h-[3px] bg-neutral-200 [&>div]:bg-orange-500 [&>div]:rounded-full"
                            />
                            <span className="text-xs font-semibold text-neutral-400 tracking-wide shrink-0">50%</span>
                        </div>

                        <form onSubmit={handleSubmit}>

                            {/* ── Section: Logo ── */}
                            <SectionCard icon="🏪" title="Logo Bisnis">
                                <div className="flex items-center gap-5">
                                    {/* preview */}
                                    <div className="w-[72px] h-[72px] rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center shrink-0 overflow-hidden text-2xl">
                                        {previewLogo
                                            ? <img src={previewLogo} alt="Preview logo" className="w-full h-full object-cover" />
                                            : '🏪'
                                        }
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="cursor-pointer text-[13px] file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 bg-neutral-50 border-neutral-200"
                                        />
                                        <p className="text-xs text-neutral-400">PNG, JPG, atau SVG · Maks. 2MB</p>
                                    </div>
                                </div>
                                <FieldError message={errors.logo} />
                            </SectionCard>

                            {/* ── Section: Identitas Bisnis ── */}
                            <SectionCard icon="🏢" title="Identitas Bisnis">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    {/* Business name – full width */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <Label htmlFor="business_name" className="text-[13px] font-semibold text-neutral-800">
                                            Nama Bisnis
                                        </Label>
                                        <Input
                                            id="business_name"
                                            value={data.business_name}
                                            onChange={(e) => setData('business_name', e.target.value)}
                                            placeholder="Contoh: Toko Fashion Amanda"
                                            className="bg-neutral-50 border-neutral-200 text-[14px] focus-visible:ring-orange-400/30 focus-visible:border-orange-400"
                                        />
                                        <FieldError message={errors.business_name} />
                                    </div>

                                    {/* Business type */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[13px] font-semibold text-neutral-800">Jenis Bisnis</Label>
                                        <Select value={data.business_type} onValueChange={(v) => setData('business_type', v)}>
                                            <SelectTrigger className="bg-neutral-50 border-neutral-200 text-[14px] focus:ring-orange-400/30 focus:border-orange-400 data-[placeholder]:text-neutral-400">
                                                <SelectValue placeholder="Pilih jenis bisnis..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {toOptions(businessTypes).map(({ value, label }) => (
                                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.business_type} />
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[13px] font-semibold text-neutral-800">Lokasi Bisnis</Label>
                                        <Select value={data.location} onValueChange={(v) => setData('location', v)}>
                                            <SelectTrigger className="bg-neutral-50 border-neutral-200 text-[14px] focus:ring-orange-400/30 focus:border-orange-400 data-[placeholder]:text-neutral-400">
                                                <SelectValue placeholder="Pilih kota..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {toOptions(locations).map(({ value, label }) => (
                                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.location} />
                                    </div>

                                    {/* Description – full width */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <Label htmlFor="description" className="text-[13px] font-semibold text-neutral-800">
                                            Deskripsi Bisnis
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Jelaskan tentang bisnis Anda, produk, dan nilai yang ditawarkan..."
                                            rows={4}
                                            className="bg-neutral-50 border-neutral-200 text-[14px] resize-y focus-visible:ring-orange-400/30 focus-visible:border-orange-400"
                                        />
                                        <FieldError message={errors.description} />
                                    </div>

                                </div>
                            </SectionCard>

                            {/* ── Section: Audiens & Konten ── */}
                            <SectionCard icon="🎯" title="Audiens & Konten">
                                <div className="space-y-4">

                                    <div className="space-y-1.5">
                                        <Label htmlFor="target_audience" className="text-[13px] font-semibold text-neutral-800">
                                            Target Audiens
                                        </Label>
                                        <Input
                                            id="target_audience"
                                            value={data.target_audience}
                                            onChange={(e) => setData('target_audience', e.target.value)}
                                            placeholder="Contoh: Wanita 18–35 tahun, milenial urban"
                                            className="bg-neutral-50 border-neutral-200 text-[14px] focus-visible:ring-orange-400/30 focus-visible:border-orange-400"
                                        />
                                        <FieldError message={errors.target_audience} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[13px] font-semibold text-neutral-800">Nuansa Konten</Label>
                                        <Select value={data.content_tone} onValueChange={(v) => setData('content_tone', v)}>
                                            <SelectTrigger className="bg-neutral-50 border-neutral-200 text-[14px] focus:ring-orange-400/30 focus:border-orange-400 data-[placeholder]:text-neutral-400">
                                                <SelectValue placeholder="Pilih nuansa konten..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {toOptions(contentTones).map(({ value, label }) => (
                                                    <SelectItem key={value} value={value}>{label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError message={errors.content_tone} />
                                    </div>

                                </div>
                            </SectionCard>

                            {/* ── Section: Visi & Keunikan ── */}
                            <SectionCard icon="✨" title="Visi & Keunikan">
                                <div className="space-y-4">

                                    <div className="space-y-1.5">
                                        <Label htmlFor="vision_mission" className="flex items-center gap-2 text-[13px] font-semibold text-neutral-800">
                                            Visi &amp; Misi
                                            <span className="text-[10px] font-normal text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                                                Opsional
                                            </span>
                                        </Label>
                                        <Textarea
                                            id="vision_mission"
                                            value={data.vision_mission}
                                            onChange={(e) => setData('vision_mission', e.target.value)}
                                            placeholder="Apa visi dan misi bisnis Anda?"
                                            rows={3}
                                            className="bg-neutral-50 border-neutral-200 text-[14px] resize-y focus-visible:ring-orange-400/30 focus-visible:border-orange-400"
                                        />
                                        <FieldError message={errors.vision_mission} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="uniqueness" className="flex items-center gap-2 text-[13px] font-semibold text-neutral-800">
                                            Keunikan Bisnis
                                            <span className="text-[10px] font-normal text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                                                Opsional
                                            </span>
                                        </Label>
                                        <Textarea
                                            id="uniqueness"
                                            value={data.uniqueness}
                                            onChange={(e) => setData('uniqueness', e.target.value)}
                                            placeholder="Apa yang membuat bisnis Anda unik dan berbeda dari kompetitor?"
                                            rows={3}
                                            className="bg-neutral-50 border-neutral-200 text-[14px] resize-y focus-visible:ring-orange-400/30 focus-visible:border-orange-400"
                                        />
                                        <FieldError message={errors.uniqueness} />
                                    </div>

                                </div>
                            </SectionCard>

                            {/* ── Submit ── */}
                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="group inline-flex items-center gap-2 h-auto bg-orange-500 hover:bg-orange-600 text-white font-jakarta font-bold text-[15px] px-7 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.28)] hover:shadow-[0_8px_22px_rgba(249,115,22,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Menyimpan...' : 'Lanjut ke Data Produk'}
                                    {!processing && (
                                        <svg
                                            className="transition-transform duration-200 group-hover:translate-x-1"
                                            width="17" height="17" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor" strokeWidth="2.5"
                                            strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </div>

                    {/* ══════════════════════════════
                        RIGHT — sticky mascot aside
                    ══════════════════════════════ */}
                    <aside className="hidden lg:flex flex-col items-center justify-center sticky top-16 h-[calc(100vh-64px)] px-9 py-12 bg-gradient-to-b from-emerald-50 via-orange-50 to-white overflow-hidden">

                        {/* decorative blobs */}
                        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-orange-400/5 pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-emerald-400/5 pointer-events-none" />

                        {/* mascot image */}
                        <img
                            src="/images/business-mascot.webp"
                            alt="Maskot asisten AI"
                            className="relative z-10 w-56 h-auto object-contain drop-shadow-xl [animation:mascot-float_4.5s_ease-in-out_infinite]"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />

                        {/* caption */}
                        <div className="relative z-10 mt-7 text-center">
                            <h3 className="font-jakarta font-bold text-lg text-neutral-900 mb-2">
                                Halo, saya siap bantu! 👋
                            </h3>
                            <p className="text-sm text-neutral-500 leading-relaxed max-w-[230px]">
                                Isi profil bisnis Anda, dan saya akan otomatis buat konten sosial media yang pas.
                            </p>
                        </div>

                        {/* step dots */}
                        <div className="relative z-10 flex items-center gap-2 mt-7">
                            <div className="w-6 h-2 rounded-full bg-orange-500" />
                            <div className="w-2 h-2 rounded-full bg-neutral-200" />
                        </div>

                        {/* tip card */}
                        <Card className="relative z-10 mt-6 w-full max-w-[268px] rounded-r-xl rounded-l-none border-l-[3px] border-l-orange-500 border-t border-r border-b border-neutral-100 shadow-sm bg-white/80 backdrop-blur-sm">
                            <CardContent className="px-4 py-3.5">
                                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-orange-500 mb-1.5">
                                    💡 Tips
                                </p>
                                <p className="text-[13px] text-neutral-500 leading-relaxed">
                                    Semakin lengkap profil bisnis Anda, semakin akurat AI dalam menghasilkan konten yang relevan.
                                </p>
                            </CardContent>
                        </Card>

                    </aside>

                </div>
            </div>
        </OnboardingLayout>
    );
}