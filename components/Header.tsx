"use client"

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/prayer-times", label: "Prayer Times" },
    { href: "/notices", label: "Notice Board" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const donationItems = [
    { href: "/sanda-collection", label: "SANDA Collection" },
    { href: "/import", label: "Import Families" },
    { href: "/reports", label: "Reports" },
  ];

  return (
    <header className="border-b border-border gradient-bg-card backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary bg-white flex items-center justify-center">
              <img
                src="/images/jummah-masjid-hero.png"
                alt="Balangoda Grand Mosque Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-extrabold text-primary tracking-tight whitespace-nowrap">
              Balangoda Grand Mosque
            </span>
          </div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 relative">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`w-40 h-10 text-center px-2 py-2 rounded font-medium transition-colors
                  ${pathname === item.href
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-primary hover:text-white"}
                `}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* Donations Dropdown */}
            <div className="relative">
              <div
                className={`w-40 h-10 text-center px-2 py-2 rounded font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer
                  ${donationItems.some(di => pathname === di.href)
                    ? "bg-primary text-white shadow"
                    : "text-foreground hover:bg-primary hover:text-white"}
                `}
                onClick={() => setDonationOpen(!donationOpen)}
                tabIndex={0}
                role="button"
                aria-haspopup="true"
                aria-expanded={donationOpen}
              >
                Donations
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {donationOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-card rounded shadow-lg z-50">
                  {donationItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-2 rounded font-medium transition-colors
                        ${pathname === item.href
                          ? "bg-primary text-white shadow"
                          : "text-foreground hover:bg-primary hover:text-white"}
                      `}
                      onClick={() => setDonationOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
          <div className="md:hidden mt-2 gradient-bg-card rounded shadow-lg p-4 flex flex-col gap-2 fixed top-16 left-4 right-4 z-50">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-primary hover:text-red-500"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mt-8 flex flex-col gap-2">
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
              {/* Donations section in mobile */}
              <span className="px-3 py-2 font-semibold text-primary">Donations</span>
              {donationItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded font-medium transition-colors ml-4
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
          </div>
        )}
      </div>
    </header>
  );
}