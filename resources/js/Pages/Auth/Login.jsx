import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Heading */}
            <div className="mb-7">
                <h1 className="font-jakarta text-2xl font-bold text-gray-900 leading-tight">
                    Selamat Datang
                </h1>
                <p className="mt-1 text-sm text-gray-500 font-dm">
                    Masuk ke akun GanaAI Anda
                </p>
                <div className="mt-4 h-px w-12 bg-gradient-to-r from-orange-500 to-orange-300" />
            </div>

            {status && (
                <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">

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
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5 text-xs" />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="font-jakarta text-[11px] font-semibold uppercase tracking-widest text-gray-500"
                        />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-medium text-orange-500 hover:text-orange-600 transition"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>
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
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1.5 text-xs" />
                </div>

                {/* Remember me */}
                <div>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                        />
                        <span className="text-sm text-gray-500 font-dm">
                            Ingat saya
                        </span>
                    </label>
                </div>

                {/* Submit */}
                <div className="pt-1">
                    <PrimaryButton
                        className="w-full justify-center rounded-xl bg-gray-900 py-3 font-jakarta text-sm font-semibold tracking-wide transition hover:bg-orange-500 focus:ring-orange-400"
                        disabled={processing}
                    >
                        Masuk
                    </PrimaryButton>
                </div>

                {/* Register link */}
                <p className="text-center text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <Link
                        href={route('register')}
                        className="font-medium text-orange-500 hover:text-orange-600 transition"
                    >
                        Daftar sekarang
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}