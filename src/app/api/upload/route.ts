import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
};

const MAX_SIZE = 25 * 1024 * 1024;

export async function POST(request: Request) {
  const formData = await request.formData();
  const photo = formData.get("photo");

  if (!(photo instanceof File)) {
    return NextResponse.json({ error: "Файл не получен" }, { status: 400 });
  }
  if (!photo.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Можно отправлять только фото" },
      { status: 415 }
    );
  }
  if (photo.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Фото слишком большое" },
      { status: 413 }
    );
  }

  const extension = EXTENSION_BY_TYPE[photo.type] ?? "img";
  const dir = path.join(process.cwd(), "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomUUID()}.${extension}`;
  await writeFile(path.join(dir, name), Buffer.from(await photo.arrayBuffer()));

  return NextResponse.json({ ok: true, name });
}
