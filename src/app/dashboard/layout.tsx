import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css"
import Header from "@/components/layout/header";
import { ThemeProvider } from "next-themes";
import ParticlesBackground from "@/components/particles-background";
import { cookies } from "next/headers";
import { checkAuth } from "@/lib/auth";
import { Suspense } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Zaid Alradaideh dashboard",
    description: "Zaid Alradaideh - dashboard Portfolio ",
};

async function AuthHeader() {
    let openDashboard = false;
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_code')?.value;
        if (token) {
            const auth = await checkAuth(token);
            if (auth) {
                openDashboard = true;
            }
        }
    } catch (error) {
        console.error("Auth header check error:", error);
    }
    return <Header isAuthenticated={openDashboard} />;
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col">
                <ThemeProvider attribute="class">
                    <ParticlesBackground />
                    <Suspense fallback={<Header isAuthenticated={false} />}>
                        <AuthHeader />
                    </Suspense>
                    {children}
                </ThemeProvider>
                <div className="text-center py-10">
                    <hr className="border-gray-500 w-1/2 mx-auto" />
                    <p className="text-sm text-gray-500 mt-5">© Zaid Radaideh. All rights reserved.</p>
                </div>
            </body>
        </html>
    );
}
