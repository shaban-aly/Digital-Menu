import { NextResponse } from "next/server";
import { translateArabicToEnglish } from "@/features/admin/services/translation-service";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { text?: unknown };
    if (!body || typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json(
        { success: false, error: "Text string is required for translation" },
        { status: 400 }
      );
    }

    const original = body.text.trim();
    const translation = await translateArabicToEnglish(original);

    return NextResponse.json({
      success: true,
      translation,
      original,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Translation error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
