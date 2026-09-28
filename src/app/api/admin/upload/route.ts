import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 25MB maximum limit" },
        { status: 400 }
      );
    }

    const nameLower = file.name.toLowerCase();
    const isAllowed = ALLOWED_EXTENSIONS.some((ext) => nameLower.endsWith(ext));
    if (!isAllowed) {
      return NextResponse.json(
        { error: `File type not supported. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await storage.uploadFile(file, folder);
    return NextResponse.json({ success: true, file: result });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file. Please try again." },
      { status: 500 }
    );
  }
}
