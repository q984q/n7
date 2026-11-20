import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  isAdminAuthenticated,
  LeadStatus,
  LeadRecord,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

import { readLeads, addLead, saveLead, deleteLead, uploadsDir as UPLOADS_DIR } from "@/lib/lead-storage";
import {randomUUID} from "node:crypto";

const VALID_STATUSES: LeadStatus[] = [
  "new",
  "in_progress",
  "kp_sent",
  "won",
  "archived",
];

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const leads = await readLeads();
  return NextResponse.json({ ok: true, leads });
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const ticketId = String(body.ticketId || "");
  const leads = await readLeads();
  const idx = leads.findIndex((l) => l.ticketId === ticketId);
  if (idx === -1) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }

  if (body.status && VALID_STATUSES.includes(body.status)) {
    leads[idx].status = body.status;
  }
  if (typeof body.managerNote === "string") {
    leads[idx].managerNote = body.managerNote;
  }
  if (typeof body.totalKzt === "number") {
    leads[idx].totalKzt = body.totalKzt;
  }
  leads[idx].updatedAt = new Date().toISOString();

  saveLead(leads[idx]);
  return NextResponse.json({ ok: true, lead: leads[idx] });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const now = new Date();
  const iso = now.toISOString();
  const ticketId = `N7-${now.getFullYear()}-${randomUUID()}`;

  const entry: LeadRecord = {
    ticketId,
    status: "new",
    managerNote: String(body.managerNote || ""),
    createdAt: iso,
    updatedAt: iso,
    name: String(body.name || "Клиент").trim(),
    phone: String(body.phone || "").trim(),
    email: String(body.email || "").trim(),
    company: String(body.company || "").trim(),
    bin: String(body.bin || "").trim(),
    city: String(body.city || "").trim(),
    type: String(body.type || "Запрос КП"),
    source: "Админ-панель",
    message: String(body.message || "").trim(),
    contextSummary: "",
    items: [],
    totalKzt: Number(body.totalKzt) || 0,
  };

  addLead(entry);
  return NextResponse.json({ ok: true, lead: entry });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get("ticketId");
  if (!ticketId) {
    return NextResponse.json({ error: "Missing ticketId" }, { status: 400 });
  }
  const leads = await readLeads();
  const target = leads.find((l) => l.ticketId === ticketId);
  if (target?.attachment?.storedName) {
    const safeName = path.basename(target.attachment.storedName);
    await fs.unlink(path.join(UPLOADS_DIR, safeName)).catch(() => {});
  }
  deleteLead(ticketId);
  return NextResponse.json({ ok: true });
}
