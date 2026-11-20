import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { LeadAttachment, LeadRecord } from "@/lib/cms";

import { addLead, uploadsDir as UPLOADS_DIR } from "@/lib/lead-storage";
import { randomUUID } from "node:crypto";
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 МБ
const ALLOWED_EXT = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".xls",
  ".xlsx",
  ".csv",
  ".doc",
  ".docx",
  ".dwg",
  ".dxf",
  ".txt",
  ".zip",
]);

function safeExt(fileName: string): string {
  const ext = path.extname(fileName || "").toLowerCase();
  return ALLOWED_EXT.has(ext) ? ext : "";
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let name = "";
    let phone = "";
    let email = "";
    let company = "";
    let bin = "";
    let city = "Казахстан";
    let type = "Запрос КП";
    let source = "Сайт N7 CONSTRUCTION";
    let message = "";
    let contextSummary = "";
    let items: LeadRecord["items"] = [];
    let totalKzt = 0;
    let uploadedFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      name = String(form.get("name") || "").trim();
      phone = String(form.get("phone") || "").trim();
      email = String(form.get("email") || "").trim();
      company = String(form.get("company") || "").trim();
      bin = String(form.get("bin") || "").trim();
      city = String(form.get("city") || "Казахстан").trim();
      type = String(form.get("type") || "Запрос КП").trim();
      source = String(form.get("source") || "Сайт N7 CONSTRUCTION").trim();
      message = String(form.get("message") || "").trim();
      contextSummary = String(form.get("contextSummary") || "").trim();
      totalKzt = Number(form.get("totalKzt")) || 0;
      const rawItems = form.get("items");
      if (typeof rawItems === "string" && rawItems) {
        try {
          const parsed = JSON.parse(rawItems);
          if (Array.isArray(parsed)) items = parsed;
        } catch {
          items = [];
        }
      }
      const f = form.get("file");
      if (f && typeof f === "object" && "arrayBuffer" in f && f.size > 0) {
        uploadedFile = f as File;
      }
    } else {
      const body = await request.json();
      name = String(body.name || "").trim();
      phone = String(body.phone || "").trim();
      email = String(body.email || "").trim();
      company = String(body.company || "").trim();
      bin = String(body.bin || "").trim();
      city = String(body.city || "Казахстан").trim();
      type = String(body.type || "Запрос КП");
      source = String(body.source || "Сайт N7 CONSTRUCTION");
      message = String(body.message || "").trim();
      contextSummary = String(body.contextSummary || "");
      items = Array.isArray(body.items) ? body.items : [];
      totalKzt = Number(body.totalKzt) || 0;
    }

    if (!name || name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Пожалуйста, укажите ваше имя" },
        { status: 400 }
      );
    }

    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Укажите корректный номер телефона или WhatsApp" },
        { status: 400 }
      );
    }

    const now = new Date();
    const randomCode = randomUUID();
    const ticketId = `N7-${now.getFullYear()}-${randomCode}`;
    const iso = now.toISOString();

    let attachment: LeadAttachment | undefined;
    if (uploadedFile) {
      if (uploadedFile.size > MAX_FILE_BYTES) {
        return NextResponse.json(
          { ok: false, error: "Размер файла не должен превышать 8 МБ" },
          { status: 400 }
        );
      }
      const ext = safeExt(uploadedFile.name);
      if (!ext) {
        return NextResponse.json(
          {
            ok: false,
            error: "Допустимые форматы: PDF, JPG, PNG, XLSX, DOCX, CSV, DWG, ZIP",
          },
          { status: 400 }
        );
      }
      try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        const storedName = `${ticketId}-${Date.now()}${ext}`;
        const buf = Buffer.from(await uploadedFile.arrayBuffer());
        await fs.writeFile(path.join(UPLOADS_DIR, storedName), buf);
        attachment = {
          fileName: uploadedFile.name.slice(0, 140),
          storedName,
          size: uploadedFile.size,
          mimeType: uploadedFile.type || "application/octet-stream",
        };
      } catch {
        throw new Error("Attachment storage failed");
      }
    }

    const entry: LeadRecord = {
      ticketId,
      status: "new",
      managerNote: "",
      createdAt: iso,
      updatedAt: iso,
      name,
      phone,
      email,
      company,
      bin,
      city,
      type,
      source,
      message,
      contextSummary,
      ...(attachment ? { attachment } : {}),
      items,
      totalKzt,
    };

    try {
      addLead(entry);
    } catch (error) {
      if (attachment) await fs.unlink(path.join(UPLOADS_DIR, attachment.storedName)).catch(() => {});
      throw error;
    }

    return NextResponse.json({
      ok: true,
      ticketId,
      createdAt: iso,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ошибка обработки заявки. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "N7 CONSTRUCTION CRM Lead API",
    status: "operational",
  });
}
