import { Link } from '@inertiajs/react';

export default function OnboardingLayout({ children, title, step = 1, totalSteps = 2 }) {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
                            <span className="text-lg font-bold" style={{ color: '#2E2F35' }}>
                                Gana<span style={{ color: '#FF6D2C' }}>AI</span>
                            </span>
                        </Link>
                        <div className="text-sm text-gray-600">
                            Step {step} dari {totalSteps}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-gray-600">
                        © 2026 GanaAI. Automasi konten sosial media untuk UMKM Indonesia.
                    </p>
                </div>
            </footer>
        </div>
    );
}
