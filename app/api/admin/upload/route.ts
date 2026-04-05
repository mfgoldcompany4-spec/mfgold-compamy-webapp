import { auth } from "@/auth";
import { uploadToR2, type R2UploadSuccess } from "@/lib/r2";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type UploadJsonOk = {
  ok: true;
  data: R2UploadSuccess;
};

type UploadJsonErr = {
  ok: false;
  error: string;
};

export type AdminUploadResponse = UploadJsonOk | UploadJsonErr;

export async function POST(request: Request): Promise<NextResponse<AdminUploadResponse>> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided. Use field name \"file\"." }, { status: 400 });
  }

  const prefixRaw = formData.get("prefix");
  const prefix =
    typeof prefixRaw === "string" && prefixRaw.trim()
      ? prefixRaw.replace(/[^a-zA-Z0-9/_-]/g, "") || "uploads"
      : "uploads";

  const result = await uploadToR2(file, prefix);

  if ("error" in result) {
    const status = result.error.toLowerCase().includes("not configured") ? 503 : 400;
    return NextResponse.json({ ok: false, error: result.error }, { status });
  }

  return NextResponse.json({ ok: true, data: result }, { status: 201 });
}
