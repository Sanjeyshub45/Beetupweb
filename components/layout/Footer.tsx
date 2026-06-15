"use client";

import Link from "next/link";
import { Download, Smartphone } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-slate-200 pt-20 pb-8 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand */}
                    <div className="flex flex-col items-start lg:col-span-1">
                        <Link href="/" className="flex items-center mb-6">
                            <img
                                src="/beetuplogo.png"
                                alt="Beetup by Fnext"
                                className="h-20 w-auto object-contain"
                                draggable={false}
                            />
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[250px]">
                            The platform for modern event creators. Host events that matter.
                        </p>
                    </div>

                    {/* Nav */}
                    <div className="flex flex-col">
                        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-6">Navigations</h4>
                        <div className="flex flex-col gap-3">
                            <Link href="/" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Home</Link>
                            <Link href="/your-events" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Your Events</Link>
                            <Link href="/settings" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Settings</Link>
                        </div>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col">
                        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-6">Legals</h4>
                        <div className="flex flex-col gap-3">
                            <Link href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Terms & Conditions</Link>
                            <Link href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-slate-500 text-sm hover:text-slate-900 transition-colors">Refund Policy</Link>
                        </div>
                    </div>

                    {/* App */}
                    <div className="flex flex-col">
                        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-6">Get the App</h4>
                        <p className="text-slate-500 text-sm mb-4">Discover events on the go.</p>
                        <div className="flex flex-col gap-3">
                            <button className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/5 border border-slate-200 rounded-full text-slate-900 text-sm hover:bg-slate-900/10 transition-colors w-fit">
                                <Smartphone className="w-4 h-4" />
                                Apple Store
                            </button>
                            <button className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/5 border border-slate-200 rounded-full text-slate-900 text-sm hover:bg-slate-900/10 transition-colors w-fit">
                                <Download className="w-4 h-4" />
                                Google Play
                            </button>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200 text-slate-500 text-sm gap-4">
                    <p>&copy; {new Date().getFullYear()} Beetup by Fnext. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-slate-900 transition-colors font-semibold">Tw</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors font-semibold">In</Link>
                        <Link href="#" className="hover:text-slate-900 transition-colors font-semibold">Ig</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
