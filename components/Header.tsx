'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: '/services', label: 'Services' },
        { href: '/clients', label: 'Clients' },
        { href: '/news', label: 'News' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
            <div className="bg-white/95 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <Image 
                            src="/images/logo-bizhive.png" 
                            alt="BIZHIVE Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                            priority
                        />
                        <span className="text-xl font-bold tracking-tight text-slate-900">BIZHIVE</span>
                    </Link>
                    
                    <div className="flex items-center gap-8">
                        <nav className={`hidden md:flex items-center gap-8`}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-600 hover:text-amber-500 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        
                        <div className="flex items-center gap-4">
                            <a
                                href="https://wa.me/6281250493122"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20"
                            >
                                Contact Us
                            </a>
                            
                            <button
                                className="md:hidden flex flex-col gap-1.5 p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <span className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4">
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-base font-medium text-slate-600 hover:text-amber-500 transition-colors py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
