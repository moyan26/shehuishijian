import type { Metadata } from "next";
import ProjectSquare from "@/components/ProjectSquare";
import { getAllProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "项目广场｜社会实践展示",
  description: "发现来自不同学院与团队的社会实践成果。",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="min-h-screen bg-[#f4f7f5]">
      <section className="border-b border-teal-950/10 bg-[radial-gradient(circle_at_top_left,_#d9f5ec,_transparent_45%),linear-gradient(135deg,#f7fbf9,#fffaf0)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-teal-700">社会实践 · 成果共创</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">从一次实践，走向更多可能</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">汇集非遗传承、社区治理、乡村振兴、科技公益等实践成果，让有价值的探索被看见、被连接、被延续。</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <ProjectSquare projects={projects} />
      </div>
    </main>
  );
}
