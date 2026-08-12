import { NextRequest, NextResponse } from "next/server";
import { createProjectApplication } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.projectName ||
      !body.college ||
      !body.category ||
      !body.contactName ||
      !body.contactInfo ||
      !body.summary
    ) {
      return NextResponse.json(
        { error: "请填写项目名称、所属学院、项目类别、联系人、联系方式和项目简介" },
        { status: 400 }
      );
    }

    const application = await createProjectApplication({
      projectName: String(body.projectName),
      college: String(body.college),
      category: String(body.category),
      outcomeTypes: Array.isArray(body.outcomeTypes) ? body.outcomeTypes : [],
      contactName: String(body.contactName),
      contactInfo: String(body.contactInfo),
      summary: String(body.summary),
      links: Array.isArray(body.links) ? body.links : [],
      note: body.note ? String(body.note) : "",
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "提交申请失败" }, { status: 500 });
  }
}
