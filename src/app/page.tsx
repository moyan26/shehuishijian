import { getAllProjects } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";

const zhenxiangSteps = [
  ["观察街巷", "记录店铺、动线、用餐场景和街区环境"],
  ["采集记忆", "整理同学、店主和周边居民的日常印象"],
  ["发布成果", "汇总报告、推文、视频和项目详情页"],
];

export default async function HomePage() {
  const projects = await getAllProjects();
  const zhenxiangProject = projects.find((project) => project.id === "zhenxiang-xunzong");
  const totalViews = projects.reduce((sum, p) => sum + p.stats.views, 0);
  const categories = new Set(
    projects.map((project) => project.category || project.tags[0]).filter(Boolean)
  );
  const recommendedProjects = (
    projects.some((project) => project.recommended)
      ? projects.filter((project) => project.recommended)
      : projects
  )
    .sort((a, b) => b.stats.views - a.stats.views)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <section className="hero-surface border-b border-teal-950/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="animate-rise">
            <p className="eyebrow mb-4">社会实践 · 成果共创</p>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              社会实践项目展示
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              面向校园社会实践团队的成果展示平台，汇集项目故事、成果链接、团队信息与实践记录，让有价值的探索被看见、被连接、被延续。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary">
                浏览项目
              </Link>
              <Link href="/apply" className="btn-secondary">
                申请入驻
              </Link>
            </div>
          </div>

          <div className="section-card animate-rise overflow-hidden p-4 sm:p-5">
            <div className="rounded-[1.25rem] bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">平台概览</p>
                  <p className="mt-2 text-xl font-black text-slate-950">从浏览到收录，一站完成</p>
                </div>
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  持续更新
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  [`${projects.length}`, "收录项目"],
                  [`${categories.size}`, "实践类别"],
                  [`${totalViews}`, "累计浏览"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-2xl font-black text-slate-950">{value}</p>
                    <p className="mt-1 text-xs text-slate-500">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
                <p className="text-sm font-bold text-slate-950">示范项目：蓁巷拾遗</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  以校园周边街巷为观察入口，展示一个社会实践项目如何被整理、呈现和连接。
                </p>
                <Link
                  href={zhenxiangProject ? `/project/${zhenxiangProject.id}` : "#zhenxiang"}
                  className="mt-4 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-900"
                >
                  查看示范项目 →
                </Link>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-teal-200 bg-teal-50/60 p-4">
              <p className="text-sm font-semibold text-slate-900">从项目广场开始探索</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                按类别、学院和成果形式筛选，快速找到调研、公益、社区治理、乡村振兴等实践成果。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">推荐项目</p>
            <h2 className="text-2xl font-black text-slate-950 sm:text-3xl">先从这些实践故事看起</h2>
          </div>
          <Link href="/projects" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
            查看全部项目 →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section id="zhenxiang" className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
        <div className="section-card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-amber-50 p-6 sm:p-8">
              <div className="relative">
                <div className="flex items-center gap-4">
                  <Image src="/zhenxiang-mark.svg" alt="蓁巷拾遗项目标志" width={64} height={64} />
                  <div>
                    <p className="eyebrow">示范区域</p>
                    <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">蓁巷拾遗</h2>
                    <p className="mt-1 text-xs font-bold text-amber-700">SOUTHEAST UNIVERSITY</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  蓁巷位于东南大学四牌楼校区附近，是许多同学熟悉的日常生活空间。这里可以作为一个完整示范，展示社会实践如何从身边街巷出发，整理观察、访谈、影像和成果链接。
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["东南大学四牌楼", "民间食堂", "街区观察", "社区记忆"].map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <p className="eyebrow mb-3">从身边街巷出发</p>
              <h3 className="text-2xl font-black text-slate-950">让一个具体项目展示出完整实践链路</h3>
              <div className="mt-6 space-y-3">
                {zhenxiangSteps.map(([title, description], index) => (
                  <div key={title} className="flex gap-4 rounded-2xl bg-slate-50 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={zhenxiangProject ? `/project/${zhenxiangProject.id}` : "/projects"} className="btn-primary">
                  查看蓁巷拾遗
                </Link>
                <Link href="/apply" className="btn-secondary">
                  提交项目线索
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
