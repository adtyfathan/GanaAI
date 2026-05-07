import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            {/* Heading */}
            <div className="mb-7">
                <h1 className="font-jakarta text-2xl font-bold text-gray-900 leading-tight">
                    Buat Akun Baru
                </h1>
                <p className="mt-1 text-sm text-gray-500 font-dm">
                    Mulai perjalanan Anda bersama GanaAI
                </p>
                <div className="mt-4 h-px w-12 bg-gradient-to-r from-orange-500 to-orange-300" />
            </div>

            <form onSubmit={submit} className="space-y-5">

                {/* Name */}
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nama Lengkap"
                        className="font-jakarta text-[11px] font-semibold uppercase tracking-widest text-gray-500"
                    />
                    <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                        </span>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-9 text-sm text-gray-900 placeholder-gray-400 shadow-none transition focus:border-orange-400 focus:bg-white focus:ring-orange-400/20"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1.5 text-xs" />
                </div>

                {/* Email */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="font-jakarta text-[11px] font-semibold uppercase tracking-widest text-gray-500"
                    />
                    <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" /></svg>
                        </span>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-9 text-sm text-gray-900 placeholder-gray-400 shadow-none transition focus:border-orange-400 focus:bg-white focus:ring-orange-400/20"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5 text-xs" />
                </div>

                {/* Password */}
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="font-jakarta text-[11px] font-semibold uppercase tracking-widest text-gray-500"
                    />
                    <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        </span>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-9 text-sm text-gray-900 placeholder-gray-400 shadow-none transition focus:border-orange-400 focus:bg-white focus:ring-orange-400/20"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1.5 text-xs" />
                </div>

                {/* Confirm Password */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                        className="font-jakarta text-[11px] font-semibold uppercase tracking-widest text-gray-500"
                    />
                    <div className="relative mt-1.5">
                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        </span>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full rounded-xl border-gray-200 bg-gray-50 pl-9 text-sm text-gray-900 placeholder-gray-400 shadow-none transition focus:border-orange-400 focus:bg-white focus:ring-orange-400/20"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1.5 text-xs" />
                </div>

                {/* Submit */}
                <div className="pt-1">
                    <PrimaryButton
                        className="w-full justify-center rounded-xl bg-gray-900 py-3 font-jakarta text-sm font-semibold tracking-wide transition hover:bg-orange-500 focus:ring-orange-400"
                        disabled={processing}
                    >
                        Daftar Sekarang
                    </PrimaryButton>
                </div>

                {/* Login link */}
                <p className="text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-orange-500 hover:text-orange-600"
                    >
                        Masuk di sini
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}