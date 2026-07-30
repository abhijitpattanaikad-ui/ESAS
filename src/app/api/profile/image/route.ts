import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { errorResponse, rejectCrossOriginMutation } from "@/lib/http/route";
import { readResponseBody } from "@/lib/http/response";
import { upstreamFetch } from "@/lib/http/upstream";

export async function POST(request: Request) {
  const originError = rejectCrossOriginMutation(request);
  if (originError) return originError;
  const token = await getSessionToken();
  if (!token) return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const platform = url.searchParams.get("platform") ?? "XESPORTS";
  if (!(["profile", "cover"] as const).includes(type as "profile" | "cover") || !(["XESPORTS", "SIMR"] as const).includes(platform as "XESPORTS" | "SIMR")) {
    return NextResponse.json({ message: "Invalid image target." }, { status: 400 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0 || file.size > 8 * 1024 * 1024 || !file.type.startsWith("image/")) {
      return NextResponse.json({ message: "Upload a valid image smaller than 8 MiB." }, { status: 400 });
    }
    const safeForm = new FormData();
    safeForm.set("file", file, file.name);
    const response = await upstreamFetch(`/v1/user/update/image?platform=${platform}&type=${type}`, {
      method: "POST",
      token,
      body: safeForm,
      allowErrorResponse: true,
    });
    return NextResponse.json(await readResponseBody(response), { status: response.status });
  } catch (error) {
    return errorResponse(error, "Image upload failed.");
  }
}
