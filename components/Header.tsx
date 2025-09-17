"use client"

import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/prayer-times", label: "Prayer Times" },
    { href: "/notices", label: "Notice Board" },
    { href: "/sanda-collection", label: "SANDA Collection" },
    { href: "/import", label: "Import Families" },
    { href: "/reports", label: "Reports" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="border-b border-border gradient-bg-card backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/images/jummah-masjid-hero.png"
              alt="Balangoda Grand Mosque"
              className="w-8 h-8 rounded-full object-cover"
            />
            <h1 className="text-xl font-bold text-foreground">Balangoda Grand Mosque</h1>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded font-medium transition-colors
                  ${pathname === item.href
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-primary hover:text-white"}
                `}
              >
                {item.label}
              </a>
            ))}
          </div>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center px-2 py-1 rounded text-primary focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open navigation"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
        {/* Mobile Nav Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-card rounded shadow-lg p-4 flex flex-col gap-2">
            {navItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded font-medium transition-colors
                  ${pathname === item.href
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-primary hover:text-white"}
                `}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}