import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image src="/platform-mark.svg" alt="" width={40} height={40} />
          <div>
            <p className="font-bold text-slate-900">社会实践项目展示</p>
            <p className="mt-1">SEU · 记录实践成果，连接项目与团队。</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="hover:text-teal-700">
            首页
          </Link>
          <Link href="/projects" className="hover:text-teal-700">
            项目广场
          </Link>
          <Link href="/apply" className="hover:text-teal-700">
            申请入驻
          </Link>
          <Link href="/admin" className="hover:text-teal-700">
            管理
          </Link>
        </div>
      </div>
    </footer>
  );
}
