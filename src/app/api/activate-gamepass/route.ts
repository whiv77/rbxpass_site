import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bodySchema = z.object({
  code: z.string().min(1),
  gamepassUrl: z.string().url(),
  nickname: z.string().min(1),
});

const CODE_REGEX = {
  OLD: /^RBX100-[A-Z0-9]{4}-[A-Z0-9]{4}$/i,
  NEW: /^[A-Z0-9]{2,6}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{1}$/i,
} as const;

function verifyChecksum(code: string): boolean {
  if (CODE_REGEX.OLD.test(code)) return true;
  const parts = code.split("-");
  if (parts.length !== 4) return false;
  const [prefix, part1, part2, checksum] = parts;
  const base = `${prefix}-${part1}-${part2}`;
  const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let sum = 0;
  for (let i = 0; i < base.length; i++) sum += base.charCodeAt(i);
  const expected = CHARSET[sum % CHARSET.length];
  return checksum === expected;
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ 
        ok: false, 
        error: "Неверные данные"
      }, { status: 400 });
    }
    
    const { code, gamepassUrl, nickname } = parsed.data;

    // Проверяем формат кода (оба формата)
    const normalizedCode = code.toUpperCase().trim();
    const isValidFormat = CODE_REGEX.OLD.test(normalizedCode) || CODE_REGEX.NEW.test(normalizedCode);
    if (!isValidFormat) {
      return NextResponse.json({ 
        ok: false, 
        error: "Неверный формат кода. Пример: RBX-ABCD-EFGH-5" 
      }, { status: 400 });
    }

    // Для нового формата проверяем контрольную сумму
    if (CODE_REGEX.NEW.test(normalizedCode) && !verifyChecksum(normalizedCode)) {
      return NextResponse.json({ 
        ok: false, 
        error: "Неверная контрольная сумма кода" 
      }, { status: 400 });
    }

    // Проверяем, что код существует и активен
    const codeRow = await prisma.code.findUnique({ 
      where: { code: normalizedCode } 
    });
    
    if (!codeRow) {
      return NextResponse.json({ 
        ok: false, 
        error: "Код не найден" 
      }, { status: 404 });
    }
    
    if (codeRow.status !== "active") {
      return NextResponse.json({ 
        ok: false, 
        error: "Код уже использован" 
      }, { status: 409 });
    }

    // Извлекаем ID GamePass из URL
    const gamepassMatch = gamepassUrl.match(/\/game-pass\/(\d+)/);
    if (!gamepassMatch) {
      return NextResponse.json({ 
        ok: false, 
        error: "Неверная ссылка на GamePass" 
      }, { status: 400 });
    }
    
    const gamepassId = gamepassMatch[1];

    // Генерируем короткий код для отслеживания
    const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        short_code: shortCode,
        code: normalizedCode,
        nickname,
        user_id: "gamepass_user", // Для GamePass активации используем специальный ID
        gamepass_id: gamepassId,
        gamepass_url: gamepassUrl,
        status: "queued",
      }
    });

    await prisma.code.update({
      where: { id: codeRow.id },
      data: { 
        status: "used",
        used_at: new Date(),
      }
    });

    return NextResponse.json({ 
      ok: true, 
      order: {
        id: order.id,
        short_code: order.short_code,
        status: order.status,
        created_at: order.created_at,
      },
      message: `Код успешно активирован! Код заказа: ${order.short_code}`
    });
  } catch (error) {
    console.error("Activate GamePass error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Ошибка сервера" 
    }, { status: 500 });
  }
}
