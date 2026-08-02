import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const denied = await requireAdmin(req);
    if (denied) return denied;

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Aucun fichier fourni." },
        { status: 400 }
      );
    }

    const result = await uploadFile(file);

    return NextResponse.json({
      ok: true,
      url: result.url,
      filename: result.filename,
    });
  } catch (err) {
    console.error("[api/upload POST] error", err);
    const message =
      err instanceof Error ? err.message : "Erreur lors de l'upload.";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 400 }
    );
  }
}
