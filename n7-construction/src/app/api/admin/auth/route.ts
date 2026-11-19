import { NextResponse } from "next/server";
import {
  readCms,
  verifyPassword,
  createSessionToken,
  isAdminAuthenticated,
  ADMIN_COOKIE,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();
    const db = await readCms();

    const inputLogin = String(login || "").trim().toLowerCase();


    if (
      !db.adminPassHash || db.sessionSecret.length < 32 ||
      inputLogin !== db.adminLogin.toLowerCase() ||
      !verifyPassword(String(password || ""), db.adminPassHash)
    ) {
      return NextResponse.json(
        { ok: false, error: "Неверный логин или пароль администратора" },
        { status: 401 }
      );
    }

    const token = createSessionToken(db);
    const res = NextResponse.json({ ok: true, login: db.adminLogin });
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ошибка авторизации" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
