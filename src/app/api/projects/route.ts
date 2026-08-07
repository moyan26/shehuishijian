import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, createProject } from "@/lib/data";

/** GET /api/projects — 获取所有项目 */
export async function GET() {
  try {
    const projects = getAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: "获取项目列表失败" },
      { status: 500 }
    );
  }
}

/** POST /api/projects — 新增项目（需认证） */
export async function POST(request: NextRequest) {
  // 认证检查
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json(
      { error: "服务器未配置 ADMIN_TOKEN 环境变量" },
      { status: 500 }
    );
  }
  if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 必填字段校验
    if (!body.title || !body.summary || !body.description) {
      return NextResponse.json(
        { error: "title、summary、description 为必填字段" },
        { status: 400 }
      );
    }

    const project = createProject({
      title: body.title,
      summary: body.summary,
      description: body.description,
      coverImage: body.coverImage || "",
      tags: body.tags || [],
      members: body.members || [],
      links: body.links || [],
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "创建项目失败" },
      { status: 500 }
    );
  }
}
