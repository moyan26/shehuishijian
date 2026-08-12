import { getProjectById, getAllProjects } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import DetailClient from "./DetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

/** 构建时生成所有项目页面（从 KV 读取项目列表） */
export async function generateStaticParams() {
  try {
    const projects = await getAllProjects();
    return projects.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return { title: "项目不存在" };
  return {
    title: `${project.title} — 社会实践`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      {/* 返回 */}
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center text-sm font-semibold text-slate-500 transition-colors hover:text-teal-700"
      >
        ← 返回项目广场
      </Link>

      {/* 封面 */}
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-56 object-cover rounded-xl mb-6"
        />
      )}

      <section className="mb-8">
        {project.id === "zhenxiang-xunzong" ? (
          <div className="mb-4 flex items-center gap-4">
            <Image src="/zhenxiang-mark.svg" alt="蓁巷拾遗项目标志" width={72} height={72} priority />
            <div>
              <p className="eyebrow">示范项目</p>
              <p className="mt-1 text-xs font-bold text-amber-700">SOUTHEAST UNIVERSITY</p>
            </div>
          </div>
        ) : (
          <p className="eyebrow mb-3">项目详情</p>
        )}
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{project.summary}</p>
      </section>

      {/* 项目基础信息 */}
      {(project.category || project.outcomeTypes?.length || project.college) && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {project.category && (
            <div className="section-card p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">项目类别</p>
              <p className="text-sm font-bold text-slate-900">{project.category}</p>
            </div>
          )}

          {project.outcomeTypes?.length ? (
            <div className="section-card p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">成果形式</p>
              <div className="flex flex-wrap gap-2">
                {project.outcomeTypes.map((type) => (
                  <span
                    key={type}
                    className="tag-pill"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {project.college && (
            <div className="section-card p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">所属学院</p>
              <p className="text-sm font-bold text-slate-900">{project.college}</p>
            </div>
          )}
        </div>
      )}

      {/* 标签 + 统计 */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="tag-pill"
          >
            {tag}
          </span>
        ))}
        <span className="text-xs text-gray-400">
          👁 {project.stats.views} 次浏览
        </span>
        <span className="text-xs text-gray-400">
          📅 {new Date(project.createdAt).toLocaleDateString("zh-CN")}
        </span>
      </div>

      {/* 正文 */}
      <div className="section-card p-6 mb-8">
        <h2 className="text-lg font-black text-slate-900 mb-4">📖 项目详情</h2>
        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
          {project.description}
        </div>
      </div>

      {/* 团队成员 */}
      {project.members.length > 0 && (
        <div className="section-card p-6 mb-8">
          <h2 className="text-lg font-black text-slate-900 mb-4">
            👥 团队成员
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {project.members.map((member, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-xl mb-2">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {member.name}
                </span>
                <span className="text-xs text-gray-500">{member.role}</span>
                {member.link && (
                  <a
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  className="text-xs text-teal-600 hover:underline mt-1"
                  >
                    个人主页 →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 相关链接 */}
      {project.links.length > 0 && (
        <div className="section-card p-6 mb-8">
          <h2 className="text-lg font-black text-slate-900 mb-4">🔗 相关链接</h2>
          <div className="space-y-2">
            {project.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-teal-50 text-sm text-teal-700 hover:text-teal-900 transition-colors"
                data-link-label={link.label}
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 客户端组件：记录浏览量和点击量 */}
      <DetailClient
        projectId={project.id}
        linkLabels={project.links.map((l) => l.label)}
      />
      </div>
    </div>
  );
}
