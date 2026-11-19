import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms";

export const dynamic = "force-dynamic";

import { readLeads, uploadsDir as UPLOADS_DIR } from "@/lib/lead-storage";

export async function GET(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Требуется авторизация" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawName = searchParams.get("name") || "";
  const safeName = path.basename(rawName);
  if (!safeName || safeName !== rawName) {
    return NextResponse.json({ error: "Некорректное имя файла" }, { status: 400 });
  }

  try {
    const leads = await readLeads();
    const match = leads.find((l) => l.attachment?.storedName === safeName);
    if (!match) return new NextResponse(null, { status: 404 });
    const fullPath = path.join(UPLOADS_DIR, safeName);
    const buf = await fs.readFile(fullPath);
    const downloadName = match?.attachment?.fileName || safeName;
    const mime = match?.attachment?.mimeType || "application/octet-stream";

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
          downloadName
        )}`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  }
}
