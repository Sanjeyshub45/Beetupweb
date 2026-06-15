"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Home, Calendar, ShieldCheck, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/hooks/useUserProfile";
import { logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAdmin } = useAuthStore();
    const { data: profile } = useUserProfile(user?.uid);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await logoutUser();
        router.push("/");
    };

    const navLinks = [
        { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    ];

    if (isAdmin) {
        navLinks.push({ href: "/admin", label: "Admin", icon: <ShieldCheck className="w-4 h-4" /> });
    } else {
        navLinks.push({ href: "/your-events", label: "Your Events", icon: <Calendar className="w-4 h-4" /> });
    }

    return (
        <header className={`fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-[100] transition-all duration-300 rounded-full ${scrolled ? "bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/50 py-3 px-6" : "bg-transparent py-4 px-6"}`}>
            <div className="w-full flex justify-end items-center">

                <div className="absolute left-6">
                    <Link href="/" className="flex items-center">
                        <img
                            src="/beetuplogo.png"
                            alt="Beetup by Fnext"
                            className="h-15 w-auto object-contain scale-[2.5] origin-left"
                            draggable={false}
                        />
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? "text-slate-900" : "text-slate-500 hover:text-primary"}`}
                            >
                                <span className={isActive ? "text-primary" : ""}>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}

                    <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
                        {user ? (
                            <Link href="/settings" className="block relative group">
                                <img
                                    src={profile?.profileLink || `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=random`}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-primary transition-transform group-hover:scale-110"
                                />
                            </Link>
                        ) : (
                            <Link href="/auth" className="text-sm font-medium text-slate-900 bg-primary hover:bg-primary-hover px-5 py-2 rounded-full transition-all">
                                Sign In
                            </Link>
                        )}
                    </div>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-900"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col p-6 gap-4"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 p-3 rounded-lg ${pathname === link.href ? "bg-slate-900/5 text-slate-900" : "text-slate-500"}`}
                            >
                                <span className={pathname === link.href ? "text-primary" : "opacity-70"}>{link.icon}</span>
                                {link.label}
                            </Link>
                        ))}

                        <div className="h-px bg-white/10 my-2" />

                        {user ? (
                            <>
                                <Link href="/settings" className="flex items-center gap-3 p-3 text-slate-500 hover:text-slate-900">
                                    <img
                                        src={profile?.profileLink || `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=random`}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border border-primary"
                                    />
                                    Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-lg text-left"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/auth" className="text-center text-sm font-medium text-slate-900 bg-primary hover:bg-primary-hover p-3 rounded-lg w-full">
                                Sign In
                            </Link>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
