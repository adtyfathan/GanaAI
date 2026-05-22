import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingLayout from '@/Layouts/OnboardingLayout';

import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Store01Icon,
    Package01Icon,
    Tick02Icon,
    InstagramIcon,
    CheckmarkBadge01Icon,
} from '@hugeicons/core-free-icons';

import BusinessProfileForm from './BusinessProfileForm';
import ProductForm from './ProductForm';
import SocialAccountForm from './SocialAccountForm';
import Preview from './Preview';
import { router } from '@inertiajs/react';

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ currentStep }) {
    const steps = [
        { id: 1, label: 'Profil Bisnis', icon: Store01Icon },
        { id: 2, label: 'Produk', icon: Package01Icon },
        { id: 3, label: 'Social Media', icon: InstagramIcon },
        { id: 4, label: 'Preview', icon: CheckmarkBadge01Icon },
    ];

    return (
        <div className="flex items-center gap-3 mb-8">
            {steps.map((step, idx) => {
                const isActive = currentStep === step.id;
                const isDone = currentStep > step.id;
                return (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{
                                    backgroundColor: isDone
                                        ? '#22c55e'
                                        : isActive
                                            ? '#f97316'
                                            : '#e5e7eb',
                                    scale: isActive ? 1.08 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            >
                                {isDone ? (
                                    <HugeiconsIcon icon={Tick02Icon} size={16} className="text-white" />
                                ) : (
                                    <HugeiconsIcon
                                        icon={step.icon}
                                        size={15}
                                        className={isActive ? 'text-white' : 'text-neutral-400'}
                                    />
                                )}
                            </motion.div>
                            <span
                                className={`text-[13px] font-semibold hidden sm:block transition-colors duration-300 ${isActive
                                        ? 'text-orange-600'
                                        : isDone
                                            ? 'text-green-600'
                                            : 'text-neutral-400'
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className="flex-1 h-[2px] rounded-full overflow-hidden bg-neutral-200">
                                <motion.div
                                    className="h-full bg-orange-400 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{
                                        width: currentStep > step.id ? '100%' : '0%',
                                    }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

// ─── Mascot Aside ─────────────────────────────────────────────────────────────
function MascotAside({ step }) {
    const mascots = {
        1: '/images/business-mascot.webp',
        2: '/images/product-mascot.webp',
        3: '/images/social-mascot.webp',
        4: '/images/preview-mascot.webp',
    };

    return (
        <aside className="hidden lg:flex flex-col items-center justify-center sticky top-16 h-[calc(100vh-64px)] overflow-hidden px-6">
            <div className="relative flex flex-col items-center justify-center gap-8">
                {[86, 72, 56].map((size, i) => (
                    <motion.span
                        key={size}
                        className="absolute rounded-full"
                        style={{
                            width: `${size * 4}px`,
                            height: `${size * 4}px`,
                            backgroundColor: `rgba(249,115,22,${0.1 + i * 0.08})`,
                        }}
                        animate={{
                            scale: [0.9 + i * 0.03, 1.1 - i * 0.03, 0.9 + i * 0.03],
                            opacity: [0.3 - i * 0.05, 0.08, 0.3 - i * 0.05],
                        }}
                        transition={{
                            duration: 3,
                            ease: 'easeInOut',
                            repeat: Infinity,
                            delay: i * 0.6,
                        }}
                    />
                ))}

                <motion.img
                    key={step}
                    src={mascots[step] ?? mascots[1]}
                    alt="Maskot AI"
                    className="relative z-10 w-72 h-auto object-contain drop-shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: [0, -10, 0] }}
                    transition={{
                        opacity: { duration: 0.4 },
                        y: { duration: 4.5, ease: 'easeInOut', repeat: Infinity, delay: 0.4 },
                    }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
            </div>
        </aside>
    );
}

// ─── Animation variants ───────────────────────────────────────────────────────
const stepVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Onboarding({
    businessTypes,
    contentTones,
    locations,
    productTypes,
    products: initialProducts = [],
    productCount = 0,
    businessProfile = null,
    connectedAccounts = [],
    socialSetId = null,
    flash = {},
}) {
    // Determine initial step based on data already saved
    const getInitialStep = () => {
        if (!businessProfile) return 1;
        if (initialProducts.length === 0) return 2;
        if (connectedAccounts.length === 0) return 3;
        return 4;
    };

    const [currentStep, setCurrentStep] = useState(getInitialStep());
    const [direction, setDirection] = useState(1);

    const goTo = (step) => {
        setDirection(step > currentStep ? 1 : -1);
        setCurrentStep(step);
    };

    const completeOnboarding = () =>
        router.post(route('onboarding.complete'));

    return (
        <OnboardingLayout step={currentStep} totalSteps={4}>
            <div className="min-h-screen bg-[#FAFAF8] font-dm">
                <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_360px] min-h-[calc(100vh-64px)]">

                    {/* ══ LEFT — form column ══ */}
                    <div className="border-r border-neutral-100 pt-10 pb-24 px-6 sm:px-10 lg:px-14 overflow-hidden">

                        <Badge className="mb-5 inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-3 py-1 text-[10px] font-semibold tracking-[0.09em] uppercase hover:bg-orange-50 cursor-default">
                            Langkah {currentStep} dari 4
                        </Badge>

                        <StepIndicator currentStep={currentStep} />

                        <AnimatePresence mode="wait" custom={direction}>
                            {currentStep === 1 && (
                                <BusinessProfileForm
                                    key="step-1"
                                    businessTypes={businessTypes}
                                    contentTones={contentTones}
                                    locations={locations}
                                    businessProfile={businessProfile}
                                    onSuccess={() =>goTo(2)}
                                    variants={stepVariants}
                                    direction={direction}
                                />
                            )}

                             {currentStep === 2 && (
                                <ProductForm
                                    key="step-2"
                                    productTypes={productTypes}
                                    products={initialProducts}
                                    productCount={productCount}
                                    onBack={() => goTo(1)}
                                    onComplete={() => goTo(3)}
                                    variants={stepVariants}
                                    direction={direction}
                                />
                            )}

                            {currentStep === 3 && (
                                <SocialAccountForm
                                    key="step-3"
                                    connectedAccounts={connectedAccounts}
                                    socialSetId={socialSetId}
                                    flash={flash}
                                    onBack={() => goTo(2)}
                                    onComplete={() => goTo(4)}
                                    variants={stepVariants}
                                    direction={direction}
                                />
                            )}

                            {currentStep === 4 && (
                                <Preview
                                    key="step-4"
                                    businessProfile={businessProfile}
                                    products={initialProducts}
                                    productCount={productCount}
                                    onBack={() => goTo(3)}
                                    onComplete={completeOnboarding}
                                    connectedAccounts={connectedAccounts}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ══ RIGHT — sticky mascot aside ══ */}
                    <MascotAside step={currentStep} />
                </div>
            </div>
        </OnboardingLayout>
    );
}