"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHome, FaProjectDiagram, FaUser, FaSun, FaMoon } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { useTheme } from 'next-themes';
export default function Header() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    // Initialize theme based on localStorage or default to dark
    useEffect(() => {
        if (theme === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            // Default to dark
            document.documentElement.classList.add("dark");
        }
    }, [theme]);

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

    const tabs = {
        home: {
            name: "Home",
            icon: <FaHome />,
            path: "/"
        },
        projects: {
            name: "Projects",
            icon: <FaProjectDiagram />,
            path: "/projects"
        },
        about: {
            name: "About",
            icon: <FaUser />,
            path: "/about"
        },
        contact: {
            name: "Contact",
            icon: <MdEmail />,
            path: "/contact"
        },
    };

    return (
        <header className="site-header">
            <div className="logo">
                <Link href="/">
                    <span className="logo-mark"><img src="icon.png" alt="Logo" /></span>
                    <span className="logo-text"><h3>Zaid Alradaideh</h3></span>
                </Link>
            </div>
            <nav>
                <ul className="nav-links">
                    {Object.entries(tabs).map(([key, value]) => {
                        const isActive = pathname === value.path;
                        return (
                            <li key={key}>
                                <Link
                                    href={value.path}
                                    className={isActive ? "active" : ""}
                                >
                                    {value.icon}
                                    {value.name}
                                </Link>
                            </li>
                        );
                    })}
                    <li>
                        <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                            {theme === 'dark' ? <FaSun /> : <FaMoon />}
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
