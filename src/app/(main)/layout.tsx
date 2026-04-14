import type { Metadata } from "next";
import "@/app/globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { cookies } from "next/headers";
import { checkAuth } from "@/lib/auth";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Zaid Alradaideh",
  description: "Zaid Alradaideh - Portfolio",
};

async function AuthHeader() {
  let openDashboard = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (token) {
      const isAuthenticated = await checkAuth(token);
      if (isAuthenticated) {
        openDashboard = true;
      }
    }
  } catch (error) {
    console.error("Auth header check error:", error);
  }
  return <Header isAuthenticated={openDashboard} />;
}

export default function MainLayout({
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
      <Footer />
      <div className="text-center py-4">
        <hr className="border-gray-500 w-1/2 mx-auto" />
        <p className="text-sm text-gray-500 mt-5">© Zaid Radaideh. All rights reserved.</p>
      </div>
    </>
  );
}

