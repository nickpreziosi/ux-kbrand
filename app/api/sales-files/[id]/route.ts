import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  PRIVATE_SEED_FILES,
  SEED_BRAND_ASSETS,
} from "@/contexts/brand-assets/infrastructure/mock/seed-assets";
import { PRESENCE_COOKIE_NAME } from "@/lib/auth/presence-cookie";
import { PLATFORM_PRESENCE_COOKIE } from "@/lib/platform-auth/constants";
import { isPlatformDeployment } from "@/lib/platform-auth/deployment-profile";

/**
 * Employee-only downloads. Files live OUTSIDE /public (private-assets/) so
 * the only way to the bytes is through this session check — protected files
 * cannot be fetched anonymously.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const hasSession = isPlatformDeployment()
    ? request.cookies.get(PLATFORM_PRESENCE_COOKIE)?.value === "1"
    : request.cookies.get(PRESENCE_COOKIE_NAME)?.value === "1";

  if (!hasSession) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;
  const fileName = PRIVATE_SEED_FILES[id];
  const asset = SEED_BRAND_ASSETS.find((a) => a.id === id);

  if (!fileName || !asset) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const bytes = await readFile(join(process.cwd(), "private-assets", fileName));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": asset.file.contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File unavailable" }, { status: 404 });
  }
}
