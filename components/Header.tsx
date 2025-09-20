"use client"

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  // new: track viewport width client-side to show hamburger for <= 1380px
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const update = () => setIsNarrow(window.innerWidth <= 1380);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

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
    <header className="border-b border-border gradient-bg-card backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="w-full px-4 py-4">
        <nav className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-primary bg-white flex items-center justify-center">
              <img
                src="/images/jummah-masjid-hero.png"
                alt="Balangoda Grand Mosque Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-extrabold text-primary tracking-tight">
              Balangoda Grand Mosque
            </span>
          </div>

          {/* show desktop nav only when viewport > 1380 */}
          {!isNarrow && (
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
                  <span className="flex items-center gap-2">
                    <span>Donations</span>
                    {/* show up caret when open, down caret when closed */}
                    {donationOpen ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    )}
                  </span>
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
          )}

          {/* hamburger shown for <= 1380 (including mobile) */}
          {isNarrow && (
            <button
              className="flex items-center px-2 py-1 rounded text-primary focus:outline-none"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open navigation"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </nav>

        {/* Mobile / tablet menu (render only when isNarrow) */}
        {mobileOpen && isNarrow && (
          <div className="mt-2 gradient-bg-card rounded shadow-lg p-4 flex flex-col gap-2 fixed top-16 left-4 right-4 z-50">
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
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded font-medium transition-colors
                    ${pathname === item.href ? "bg-primary text-white shadow" : "text-foreground hover:bg-primary hover:text-white"}
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Donations collapsible in hamburger view */}
              <div className="mt-2 w-full">
                <button
                  type="button"
                  onClick={() => setDonationOpen(prev => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2 font-semibold text-primary rounded hover:bg-gray-100"
                  aria-expanded={donationOpen}
                  aria-controls="mobile-donations-list"
                >
                  <span>Donations</span>
                  <span className="ml-2 text-sm" aria-hidden>
                    {donationOpen ? "▲" : "▼"}
                  </span>
                </button>

                {donationOpen && (
                  <div id="mobile-donations-list" className="flex flex-col ml-4 mt-1">
                    {donationItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-2 rounded font-medium transition-colors
                          ${pathname === item.href ? "bg-primary text-white shadow" : "text-foreground hover:bg-primary hover:text-white"}
                        `}
                        onClick={() => {
                          setMobileOpen(false)
                          setDonationOpen(false)
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}