import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css"
import Header from "@/components/layout/header";
import { ThemeProvider } from "next-themes";
import ParticlesBackground from "@/components/particles-background";

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

export default function RootLayout({
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
                    <Header />
                    {children}
                </ThemeProvider>
                <div className="text-center py-10">
                    <hr className="border-gray-500 w-1/2 mx-auto" />
                    <p className="text-sm text-gray-500 mt-5">© {new Date().getFullYear()} Zaid Radaideh. All rights reserved.</p>
                </div>
            </body>
        </html>
    );
}
