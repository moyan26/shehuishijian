"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目广场" },
  { href: "/apply", label: "申请入驻" },
  { href: "/admin", label: "管理" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-col items-start justify-center gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <Link href="/" className="flex items-center gap-3 text-slate-900" aria-label="社会实践项目展示首页">
          <Image src="/platform-mark.svg" alt="" width={40} height={40} priority />
          <span className="leading-tight">
            <span className="block text-sm font-black sm:text-base">社会实践项目展示</span>
            <span className="mt-0.5 block text-[10px] font-bold uppercase text-teal-700">SEU · Social Practice</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-1 text-sm">
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
