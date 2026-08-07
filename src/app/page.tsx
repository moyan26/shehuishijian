import { getAllProjects } from "@/lib/data";
import ProjectCard from "@/components/ProjectCard";

export default async function HomePage() {
  const projects = await getAllProjects();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🌍 社会实践项目展示
        </h1>
        <p className="text-gray-500">
          展示社会实践成果，记录团队成长足迹
        </p>
      </div>

      {/* 统计栏 */}
      <div className="flex justify-center gap-8 mb-8 text-sm text-gray-500">
        <span>📁 共 {projects.length} 个项目</span>
        <span>
          👁 总计{" "}
          {projects.reduce((sum, p) => sum + p.stats.views, 0)} 次浏览
        </span>
      </div>

      {/* 项目网格 */}
      {projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p>暂无项目，前往管理页面添加</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
