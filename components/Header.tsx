"use client"

import React from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

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
        </nav>
      </div>
    </header>
  );
}