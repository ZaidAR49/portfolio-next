import type { Metadata } from "next";
import "@/app/globals.css"
import Header from "@/components/layout/header";
import { cookies } from "next/headers";
import { checkAuth } from "@/lib/auth";
import { Suspense } from "react";


export const metadata: Metadata = {
    title: "Zaid Alradaideh dashboard",
    description: "Zaid Alradaideh - dashboard Portfolio ",
};

async function AuthHeader() {
    let openDashboard = false;
    const cookieStore = await cookies();
    try {
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
        <>
            <Suspense fallback={<Header isAuthenticated={false} />}>
                <AuthHeader />
            </Suspense>
            <main className="flex-grow">
                {children}
            </main>
            <div className="text-center py-10">
                <hr className="border-gray-500 w-1/2 mx-auto" />
                <p className="text-sm text-gray-500 mt-5">© Zaid Radaideh. All rights reserved.</p>
            </div>
        </>
    );
}

