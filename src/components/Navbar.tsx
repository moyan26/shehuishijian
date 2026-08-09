"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目广场" },
  { href: "/admin", label: "管理" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-white">巷</span>
          <span>蓁巷拾遗</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={`rounded-full px-3 py-2 transition sm:px-4 ${active ? "bg-teal-50 font-semibold text-teal-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
