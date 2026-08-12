import Link from "next/link";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

const outcomeIcon: Record<string, string> = {
  网站: "🌐",
  公众号: "💬",
  视频: "▶",
  报告: "📄",
  调研报告: "📄",
  文创: "🎨",
  桌游: "🎲",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const category = project.category || project.tags[0] || "其他实践";
  const outcomes = project.outcomeTypes?.length
    ? project.outcomeTypes
    : project.links.map((link) => link.label).slice(0, 2);

  return (
    <Link
      href={`/project/${project.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
      aria-label={`查看项目：${project.title}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-amber-50">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center" aria-hidden="true">
            <span className="text-4xl opacity-75">🧭</span>
            <span className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-teal-700/70">
              Social Practice
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {category}
          </span>
          {project.recommended && (
            <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-amber-950">
              推荐
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span className="truncate">{project.college || "社会实践团队"}</span>
          <span className="shrink-0">{project.stats.views} 次浏览</span>
        </div>
        <h2 className="mb-2 line-clamp-1 text-lg font-black text-slate-900 transition group-hover:text-teal-700">
          {project.title}
        </h2>
        <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-600">
          {project.summary}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {outcomes.length > 0 ? (
            outcomes.slice(0, 3).map((type) => (
              <span key={type} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                {outcomeIcon[type] || "✦"} {type}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">成果整理中</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <div className="flex gap-1.5">
            {project.tags.slice(0, 2).map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
          <span className="font-semibold text-teal-700">查看详情 →</span>
        </div>
      </div>
    </Link>
  );
}
