import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            {/* Heading */}
            <div className="mb-7">
                <h1 className="font-jakarta text-2xl font-bold text-gray-900 leading-tight">
                    Lupa Password?
                </h1>
                <p className="mt-1 text-sm text-gray-500 font-dm">
                    Masukkan email Anda dan kami akan kirimkan tautan reset
                </p>
                <div className="mt-4 h-px w-12 bg-linear-to-r from-orange-500 to-orange-300" />
            </div>

            {status && (
                <div className="mb-5 flex gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5">
                    <span className="mt-0.5 shrink-0 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    </span>
                    <p className="text-sm font-medium text-green-700 font-dm">{status}</p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block font-jakarta text-[11px] font-semibold uppercase tracking-widest text-gray-500"
                    >
                        Email
                    </label>
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
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5 text-xs" />
                </div>

                {/* Submit */}
                <div className="pt-1">
                    <PrimaryButton
                        className="w-full justify-center rounded-xl bg-gray-900 py-3 font-jakarta text-sm font-semibold tracking-wide transition hover:bg-orange-500 focus:ring-orange-400"
                        disabled={processing}
                    >
                        Kirim Tautan Reset
                    </PrimaryButton>
                </div>

                {/* Back to login */}
                <p className="text-center text-sm text-gray-500">
                    Ingat password Anda?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-orange-500 hover:text-orange-600 transition"
                    >
                        Kembali masuk
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}