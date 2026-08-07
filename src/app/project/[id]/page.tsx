import { getProjectById, getAllProjects } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 返回 */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
      >
        ← 返回项目列表
      </Link>

      {/* 封面 */}
      {project.coverImage && (
        <img
          src={project.coverImage}
          alt={project.title}
          className="w-full h-56 object-cover rounded-xl mb-6"
        />
      )}

      {/* 标题区 */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {project.title}
      </h1>
      <p className="text-gray-500 mb-4">{project.summary}</p>

      {/* 标签 + 统计 */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600"
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
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">📖 项目详情</h2>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {project.description}
        </div>
      </div>

      {/* 团队成员 */}
      {project.members.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            👥 团队成员
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {project.members.map((member, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-3 rounded-lg bg-gray-50"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl mb-2">
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
                    className="text-xs text-blue-500 hover:underline mt-1"
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
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🔗 相关链接</h2>
          <div className="space-y-2">
            {project.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-sm text-blue-600 hover:text-blue-700 transition-colors"
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
  );
}
