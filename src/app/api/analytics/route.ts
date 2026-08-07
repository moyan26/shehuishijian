import { NextRequest, NextResponse } from "next/server";
import { incrementViews, incrementLinkClick } from "@/lib/data";

/** POST /api/analytics — 记录浏览/点击事件 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, type, linkLabel } = body;

    if (!projectId || !type) {
      return NextResponse.json(
        { error: "projectId 和 type 为必填字段" },
        { status: 400 }
      );
    }

    if (type === "view") {
      incrementViews(projectId);
    } else if (type === "click") {
      if (!linkLabel) {
        return NextResponse.json(
          { error: "click 事件需要 linkLabel" },
          { status: 400 }
        );
      }
      incrementLinkClick(projectId, linkLabel);
    } else {
      return NextResponse.json(
        { error: "type 必须是 view 或 click" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "记录失败" },
      { status: 500 }
    );
  }
}
