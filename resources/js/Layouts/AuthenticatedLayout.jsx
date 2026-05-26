import { Link, usePage, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Home07Icon, LogoutSquare02Icon,
    ProfileIcon, Menu01Icon, Search01Icon,
} from '@hugeicons/core-free-icons';
import {
    Avatar, AvatarImage, AvatarFallback,
} from '@/components/ui/avatar';
import {
    InputGroup, InputGroupAddon, InputGroupInput,
} from '@/components/ui/input-group';

// Daftar halaman yang bisa dicari
const pages = [
    { title: 'Dashboard', routeName: 'dashboard', icon: Home07Icon, description: 'Halaman utama' },
    { title: 'Profile', routeName: 'profile.edit', icon: ProfileIcon, description: 'Edit profil akun' },
];

// ─── Search Bar Component ─────────────────────────────────────────────────────
function PageSearch() {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const filtered = pages.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
    );

    // Tutup dropdown saat klik di luar
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleSelect(routeName) {
        router.visit(route(routeName));
        setOpen(false);
        setQuery('');
    }

    return (
        <div ref={wrapperRef} className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <InputGroup>
                <InputGroupAddon>
                    <HugeiconsIcon
                        icon={Search01Icon}
                        size={16}
                        className="text-muted-foreground"
                    />
                </InputGroupAddon>
                <InputGroupInput
                    placeholder="Cari halaman..."
                    value={query}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                />
            </InputGroup>

            {open && query.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-white shadow-lg overflow-hidden">
                    {filtered.length > 0 ? (
                        filtered.map((page) => (
                            <button
                                key={page.routeName}
                                onClick={() => handleSelect(page.routeName)}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-orange-50 hover:text-orange-500 transition-colors"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                <HugeiconsIcon icon={page.icon} size={16} className="shrink-0 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{page.title}</span>
                                    <span className="text-xs text-muted-foreground">{page.description}</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div
                            className="px-4 py-3 text-sm text-muted-foreground"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            Halaman tidak ditemukan.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── AppSidebar ───────────────────────────────────────────────────────────────
function AppSidebar({ user }) {
    return (
        <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
            <SidebarHeader className="h-16 border-b border-sidebar-border flex justify-center">
                <div className="flex justify-between">
                    <Link href="dashboard" className="flex items-center overflow-hidden">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="h-8 w-14 shrink-0 group-data-[collapsible=icon]:hidden"
                        />
                        <span
                            className="text-lg font-bold whitespace-nowrap group-data-[collapsible=icon]:hidden"
                            style={{ color: '#2E2F35' }}
                        >
                            Gana<span style={{ color: '#FF6D2C' }}>AI</span>
                        </span>
                    </Link>
                    <SidebarTrigger className="-ml-1 h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer hidden md:flex" />
                </div>
            </SidebarHeader>

            <SidebarContent className="px-2 py-3">
                <SidebarMenu>
                    {pages.map((item) => {
                        const isActive = typeof route === 'function' && route().current(item.routeName);
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    className={`
                                        relative gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                        text-sidebar-foreground/70
                                        hover:bg-orange-50 hover:text-orange-500
                                        data-[active=true]:bg-orange-50 data-[active=true]:text-orange-500
                                        ${isActive ? 'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-1 before:rounded-r-full before:bg-orange-500' : ''}
                                    `}
                                >
                                    <Link href={route(item.routeName)}>
                                        <HugeiconsIcon
                                            icon={item.icon}
                                            size={18}
                                            color={isActive ? '#f97316' : 'currentColor'}
                                        />
                                        <span style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild
                            className="gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex w-full items-center gap-3"
                            >
                                <HugeiconsIcon color="red" icon={LogoutSquare02Icon} size={18} className="cursor-pointer" />
                                <span
                                    className="group-data-[collapsible=icon]:hidden text-red-500 cursor-pointer"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    Log Out
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <TooltipProvider delayDuration={0}>
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-background">
                    <AppSidebar user={user} />

                    <div className="flex flex-1 flex-col min-h-screen">
                        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-white px-4 sm:px-6">

                            <SidebarTrigger className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer flex md:hidden">
                                <HugeiconsIcon icon={Menu01Icon} size={20} />
                            </SidebarTrigger>

                            <div className="h-5 w-px bg-border shrink-0 hidden md:block" />

                            {header && (
                                <div
                                    className="shrink-0 text-base font-semibold text-foreground hidden sm:block"
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                >
                                    {header}
                                </div>
                            )}

                            <div className="flex flex-1 justify-center px-2 sm:px-4">
                                <PageSearch />
                            </div>

                            <Link href={route('profile.edit')} className="shrink-0">
                                <Avatar className="h-8 w-8 border border-black/20">
                                    <AvatarImage
                                        src={user.avatar ?? undefined}
                                        alt={user.name}
                                    />
                                    <AvatarFallback
                                        className="text-white text-xs font-bold"
                                        style={{
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            backgroundColor: '#FF6D2C',
                                        }}
                                    >
                                        {user.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        </header>

                        <main
                            className="flex-1 p-4 sm:p-6"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </TooltipProvider>
    );
}