"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Menu, X, ChevronDown, Lock, FileText, Bell } from "lucide-react";

interface NavbarProps {
  professorName?: string;
  institution?: string;
}

export default function Navbar({
  professorName = "Dr. Abhishek Rajput",
  institution = "IIT Indore",
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Research", href: "/research" },
    { name: "Publications", href: "/publications" },
    { name: "Projects", href: "/projects" },
    { name: "Teaching", href: "/teaching" },
    { name: "Students", href: "/students" },
    { name: "News & Alerts", href: "/news", isAlert: true },
  ];

  const moreLinks = [
    { name: "Awards & Honors", href: "/awards" },
    { name: "Curriculum Vitae", href: "/cv" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Top Academic Sub-bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wider text-slate-200 uppercase">
              {institution}
            </span>
            <span className="text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">Department of Civil Engineering</span>
          </div>
          <div className="flex items-center gap-4">
            <NextLink
              href="/cv"
              className="flex items-center gap-1 hover:text-white transition-colors text-slate-300"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CV</span>
            </NextLink>
            <NextLink
              href="/admin"
              className="flex items-center gap-1 hover:text-emerald-400 text-slate-400 transition-colors"
              title="Faculty CMS Login"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden sm:inline">Faculty Login</span>
            </NextLink>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand Name */}
        <NextLink href="/" className="flex flex-col group">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
            {professorName}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Structural & Impact Mechanics Lab
          </span>
        </NextLink>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-0.5 text-sm font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <NextLink
                key={link.href}
                href={link.href}
                className={`px-2.5 py-2 rounded-md transition-colors flex items-center gap-1.5 ${
                  active
                    ? "text-emerald-800 bg-emerald-50/80 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {link.isAlert && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
                <span>{link.name}</span>
              </NextLink>
            );
          })}

          {/* More Dropdown with click outside & hover */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setMoreDropdownOpen(true)}
            onMouseLeave={() => setMoreDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMoreDropdownOpen((prev) => !prev)}
              aria-expanded={moreDropdownOpen}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-md transition-colors ${
                moreLinks.some((l) => isActive(l.href))
                  ? "text-emerald-800 bg-emerald-50/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              <span>More</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  moreDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {moreLinks.map((sublink) => (
                  <NextLink
                    key={sublink.href}
                    href={sublink.href}
                    onClick={() => setMoreDropdownOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive(sublink.href)
                        ? "text-emerald-800 bg-emerald-50 font-semibold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {sublink.name}
                  </NextLink>
                ))}
              </div>
            )}
          </div>

          <NextLink
            href="/contact"
            className="ml-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-sm transition-all hover:shadow"
          >
            Contact & Office
          </NextLink>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <NextLink
            href="/contact"
            className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-md"
          >
            Contact
          </NextLink>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-md"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <NextLink
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.href)
                  ? "text-emerald-800 bg-emerald-50 font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.name}
            </NextLink>
          ))}
          <div className="pt-2 border-t border-slate-200">
            <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Additional Pages
            </span>
            {moreLinks.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "text-emerald-800 bg-emerald-50 font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </NextLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
