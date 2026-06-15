"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideLayout = pathname.startsWith("/admin") || pathname.startsWith("/auth");

    return (
        <>
            {!hideLayout && <Navbar />}
            <main className="flex-1">{children}</main>
            {!hideLayout && <Footer />}
        </>
    );
}
