// app/api/user/avatar/[...path]/route.ts
import { NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export async function GET(
  req: NextRequest,
  props: {
    params: Promise<{ path: string[] }>;
  }
) {
  const params = await props.params;

  try {
    const filePath = path.join(
      process.cwd(),
      "storage",
      "uploads",
      ...params.path
    );
    if (!existsSync(filePath)) {
      return new Response("File not found", { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType =
      {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".pdf": "application/pdf",
      }[ext] || "application/octet-stream";

    return new Response(fileBuffer, {
      headers: { "Content-Type": mimeType },
    });
  } catch (err) {
    console.log(err);
    return new Response("Failed to fetch data", { status: 500 });
  }
}
