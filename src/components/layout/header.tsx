"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHome, FaProjectDiagram, FaUser, FaSun, FaMoon, FaBars, FaTimes, FaTachometerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';

export default function Header({ isAuthenticated, activePortfolio }: { isAuthenticated: boolean, activePortfolio?: string }) {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Track scroll for sticky blur effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Initialize theme based on localStorage or default to dark
    useEffect(() => {
        if (theme === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            // Default to dark
            document.documentElement.classList.add("dark");
        }
    }, [theme]);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light");
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            setTheme("dark");
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
    };

    type TabType = {
        name: string;
        icon: React.ReactNode;
        path: string;
        subItems?: { name: string; path: string }[];
    };

    const tabs: Record<string, TabType> = {
        home: {
            name: "Home",
            icon: <FaHome />,
            path: "/#hero"
        },
        projects: {
            name: "Projects",
            icon: <FaProjectDiagram />,
            path: "/#projects"
        },
        about: {
            name: "About",
            icon: <FaUser />,
            path: `${pathname === "/about" ? "/about#aboutfirst" : "/about"}`,
            subItems: [
                { name: "Overview", path: "/about#aboutfirst" },
                { name: "Skills", path: "/about#skills" },
                { name: "Experience", path: "/about#experience" },
                { name: "Education", path: "/about#education" },
                { name: "Courses", path: "/about#courses" }
            ]
        },
        contact: {
            name: "Contact",
            icon: <MdEmail />,
            path: "/#contact"
        },
        dashboard: {
            name: "Dashboard",
            icon: <FaTachometerAlt />,
            path: "/dashboard"
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-surface/80 backdrop-blur-lg border-b border-border shadow-sm py-4' : 'bg-transparent py-6 md:py-8'
                    }`}
            >
                <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12 flex justify-between items-center w-full">
                    {/* Logo */}
                    <div className="z-50 relative flex items-center gap-4">
                        <a href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="text-primary font-bold text-xl md:text-2xl tracking-widest uppercase transition-transform group-hover:scale-105">
                                Zaid Alradaideh
                            </span>
                        </a>
                        {isAuthenticated && activePortfolio && pathname?.startsWith('/dashboard') && (
                            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-full shadow-sm whitespace-nowrap">
                                <FaProjectDiagram size={10} />
                                Managing: {activePortfolio}
                            </span>
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <Suspense fallback={null}>
                        <nav className="hidden md:flex items-center gap-8">
                            <ul className="flex items-center gap-8 m-0 p-0 list-none">
                                {Object.entries(tabs).map(([key, value]) => {
                                    const isActive = pathname === value.path || (value.path.startsWith("/about") && pathname.startsWith("/about"));
                                    if (!isAuthenticated && key === "dashboard") {
                                        return null;
                                    }
                                    return (
                                        <li key={key} className="relative group">
                                            <a
                                                href={value.path}
                                                className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 py-2 ${isActive
                                                    ? "text-primary"
                                                    : "text-muted hover:text-foreground"
                                                    }`}
                                            >
                                                <span className="text-lg">{value.icon}</span>
                                                {value.name}
                                            </a>
                                            {value.subItems && (
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                    <div className="bg-surface/95 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-lg min-w-[160px] flex flex-col gap-1">
                                                        {value.subItems.map((subItem, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={subItem.path}
                                                                className="px-4 py-2 text-sm font-medium text-muted hover:text-primary hover:bg-elevated rounded-xl transition-colors whitespace-nowrap"
                                                            >
                                                                {subItem.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="h-6 w-px bg-border mx-2" /> {/* Divider */}
                            <button
                                onClick={toggleTheme}
                                className="text-muted hover:text-primary bg-elevated hover:border p-2.5 rounded-full transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {mounted && (theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />)}
                            </button>
                        </nav>
                    </Suspense>

                    {/* Mobile Hamburger Button */}
                    <div className="flex md:hidden items-center gap-3 z-50 relative">
                        <button
                            onClick={toggleTheme}
                            className="text-muted hover:text-foreground bg-elevated/80 hover:bg-border/80 p-2.5 rounded-full backdrop-blur-sm transition-colors border border-border"
                            aria-label="Toggle Theme"
                        >
                            {mounted && (theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />)}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-muted hover:text-foreground bg-elevated/80 hover:bg-border/80 p-2.5 rounded-full backdrop-blur-sm transition-colors border border-border focus:outline-none"
                            aria-label="Toggle Mobile Menu"
                        >
                            {isMobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Floating Dropdown Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-24 right-4 z-40 w-64 bg-surface/95 backdrop-blur-xl border border-border rounded-3xl p-3 shadow-lg md:hidden"
                    >
                        <Suspense fallback={null}>
                            <nav className="w-full">
                                <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                                    {Object.entries(tabs).map(([key, value]) => {
                                        const isActive = pathname === value.path || (value.path.startsWith("/about") && pathname.startsWith("/about"));
                                        if (!isAuthenticated && key === "dashboard") {
                                            return null;
                                        }
                                        return (
                                            <li key={key} className="flex flex-col gap-1">
                                                <Link
                                                    href={value.path}
                                                    onClick={() => !value.subItems && setIsMobileMenuOpen(false)}
                                                    className={`flex items-center gap-4 text-[15px] font-bold px-5 py-4 rounded-2xl transition-all duration-200 ${isActive
                                                        ? "text-primary border border-border bg-elevated"
                                                        : "text-muted hover:text-foreground hover:bg-elevated border border-transparent"
                                                        }`}
                                                >
                                                    <span className={isActive ? "text-primary" : "text-muted"}>{value.icon}</span>
                                                    {value.name}
                                                </Link>
                                                {value.subItems && (
                                                    <div className="flex flex-col ml-12 gap-1 border-l-2 border-border/50 pl-4 py-2">
                                                        {value.subItems.map((subItem, idx) => (
                                                            <Link
                                                                key={idx}
                                                                href={subItem.path}
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                                className="text-sm font-medium text-muted hover:text-primary py-2 transition-colors"
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </Suspense>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
}
