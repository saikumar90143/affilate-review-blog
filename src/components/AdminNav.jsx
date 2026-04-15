"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, ShoppingBag, Settings, FolderTree, Menu, X } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

const navLinks = [
  { href: "/admin",            label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts",      label: "Posts",      icon: FileText         },
  { href: "/admin/products",   label: "Products",   icon: ShoppingBag      },
  { href: "/admin/categories", label: "Categories", icon: FolderTree       },
  { href: "/admin/settings",   label: "Settings",   icon: Settings         },
];

export default function AdminNav({ email }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Admin Panel
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">EliteReviews CMS</p>
        </div>
        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 rounded-lg text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${active ? "text-blue-400" : "text-gray-500"}`} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
            {email?.[0]?.toUpperCase()}
          </div>
          <p className="text-sm text-gray-300 truncate flex-1">{email}</p>
        </div>
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gray-950 shrink-0">
        <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Admin Panel
        </span>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-gray-950 border-r border-white/5 flex flex-col h-full z-10">
            <NavContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-950 border-r border-white/5 flex-col shrink-0">
        <NavContent />
      </aside>
    </>
  );
}
