import { NextRequest, NextResponse } from "next/server";
import {
  getProjectById,
  updateProject,
  deleteProject,
} from "@/lib/data";

/** GET /api/projects/[id] — 获取单个项目详情 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  }
  return NextResponse.json(project);
}

/** PUT /api/projects/[id] — 更新项目（需认证） */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    const body = await request.json();
    const updated = updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: "项目不存在" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "更新项目失败" }, { status: 500 });
  }
}

/** DELETE /api/projects/[id] — 删除项目（需认证） */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  const deleted = deleteProject(id);
  if (!deleted) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
