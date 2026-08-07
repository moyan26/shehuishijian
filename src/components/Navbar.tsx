"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          🌍 社会实践展示
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className={`hover:text-blue-600 transition-colors ${
              pathname === "/" ? "text-blue-600 font-semibold" : "text-gray-600"
            }`}
          >
            项目列表
          </Link>
          <Link
            href="/admin"
            className={`hover:text-blue-600 transition-colors ${
              pathname === "/admin"
                ? "text-blue-600 font-semibold"
                : "text-gray-600"
            }`}
          >
            管理
          </Link>
        </div>
      </div>
    </nav>
  );
}
