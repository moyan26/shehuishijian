"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/lib/types";

type SortMode = "recommended" | "popular" | "newest";

interface ProjectSquareProps {
  projects: Project[];
}

const ALL = "全部";

function unique(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export default function ProjectSquare({ projects }: ProjectSquareProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [outcome, setOutcome] = useState(ALL);
  const [college, setCollege] = useState(ALL);
  const [sort, setSort] = useState<SortMode>("recommended");

  const categories = useMemo(
    () => unique(projects.map((project) => project.category || project.tags[0] || "其他实践")),
    [projects],
  );
  const outcomes = useMemo(
    () => unique(projects.flatMap((project) => project.outcomeTypes || [])),
    [projects],
  );
  const colleges = useMemo(() => unique(projects.map((project) => project.college)), [projects]);

  const categoryCounts = useMemo(
    () => categories.map((name) => ({
      name,
      count: projects.filter((project) => (project.category || project.tags[0] || "其他实践") === name).length,
    })),
    [categories, projects],
  );

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
    return projects
      .filter((project) => {
        const projectCategory = project.category || project.tags[0] || "其他实践";
        const searchable = [
          project.title,
          project.summary,
          project.description,
          project.college || "",
          ...project.tags,
          ...(project.outcomeTypes || []),
        ].join(" ").toLocaleLowerCase("zh-CN");
        return (
          (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          (category === ALL || projectCategory === category) &&
          (outcome === ALL || project.outcomeTypes?.includes(outcome)) &&
          (college === ALL || project.college === college)
        );
      })
      .sort((a, b) => {
        if (sort === "popular") return b.stats.views - a.stats.views;
        if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return Number(Boolean(b.recommended)) - Number(Boolean(a.recommended)) || b.stats.views - a.stats.views;
      });
  }, [category, college, outcome, projects, query, sort]);

  const hasFilters = Boolean(query) || category !== ALL || outcome !== ALL || college !== ALL;
  const resetFilters = () => {
    setQuery("");
    setCategory(ALL);
    setOutcome(ALL);
    setCollege(ALL);
  };

  if (projects.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
        <div className="mb-5 text-6xl" aria-hidden="true">📭</div>
        <h2 className="mb-2 text-xl font-bold text-slate-900">项目广场正在准备中</h2>
        <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-slate-500">首批社会实践成果正在整理，稍后回来就能看到更多精彩项目。</p>
        <Link href="/" className="inline-flex rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">返回首页</Link>
      </section>
    );
  }

  return (
    <>
      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="项目类别统计">
        <button onClick={() => setCategory(ALL)} className={`rounded-2xl border p-4 text-left transition ${category === ALL ? "border-teal-600 bg-teal-700 text-white" : "border-slate-200 bg-white hover:border-teal-300"}`}>
          <span className="block text-2xl font-bold">{projects.length}</span>
          <span className={`text-xs ${category === ALL ? "text-teal-100" : "text-slate-500"}`}>全部项目</span>
        </button>
        {categoryCounts.slice(0, 3).map((item) => (
          <button key={item.name} onClick={() => setCategory(item.name)} className={`rounded-2xl border p-4 text-left transition ${category === item.name ? "border-teal-600 bg-teal-700 text-white" : "border-slate-200 bg-white hover:border-teal-300"}`}>
            <span className="block text-2xl font-bold">{item.count}</span>
            <span className={`line-clamp-1 text-xs ${category === item.name ? "text-teal-100" : "text-slate-500"}`}>{item.name}</span>
          </button>
        ))}
      </section>

      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-label="筛选项目">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">搜索项目</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目名称、关键词或学院" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100" />
          </label>
          <select aria-label="成果形式" value={outcome} onChange={(event) => setOutcome(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500">
            <option value={ALL}>全部成果形式</option>
            {outcomes.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select aria-label="所属学院" value={college} onChange={(event) => setCollege(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500">
            <option value={ALL}>全部学院</option>
            {colleges.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select aria-label="排序方式" value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500">
            <option value="recommended">推荐优先</option>
            <option value="popular">最多浏览</option>
            <option value="newest">最新收录</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {[ALL, ...categories].map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-xs font-medium transition ${category === item ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700"}`}>{item}</button>
          ))}
        </div>
      </section>

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Project Gallery</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">发现实践成果</h2>
        </div>
        <p className="text-sm text-slate-500">找到 <strong className="text-slate-900">{visibleProjects.length}</strong> 个项目</p>
      </div>

      {visibleProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mb-4 text-5xl" aria-hidden="true">🔎</div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">没有找到匹配项目</h2>
          <p className="mb-6 text-sm text-slate-500">换一个关键词或减少筛选条件试试。</p>
          {hasFilters && <button onClick={resetFilters} className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800">清除全部筛选</button>}
        </section>
      )}
    </>
  );
}
