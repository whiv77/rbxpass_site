import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeadersOrCookies, verifyAdminToken } from "@/lib/auth";

// DELETE - удалить код
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = getTokenFromHeadersOrCookies(request.headers);
  if (!verifyAdminToken(auth).ok) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const params = await context.params;
    const id = Number(params.id);
    
    if (!Number.isFinite(id)) {
      return NextResponse.json({ ok: false, error: "Invalid ID" }, { status: 400 });
    }

    // Проверяем, существует ли код
    const code = await prisma.code.findUnique({
      where: { id }
    });

    if (!code) {
      return NextResponse.json({ ok: false, error: "Код не найден" }, { status: 404 });
    }

    // Нельзя удалить использованный код
    if (code.status === "used") {
      return NextResponse.json({ 
        ok: false, 
        error: "Нельзя удалить использованный код" 
      }, { status: 400 });
    }

    await prisma.code.delete({
      where: { id }
    });

    return NextResponse.json({ ok: true, message: "Код удален" });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
