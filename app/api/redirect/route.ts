import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

const ALLOWED_DESTINATIONS: Record<string, string> = {
    testflight: "https://testflight.apple.com/join/ku8iGLOm",
    googleplay: "https://play.google.com/store/apps/details?id=com.arytmed.smartcardio",
    rustore: "https://www.rustore.ru/catalog/app/com.arytmed.smartcardio",
    appgallery: "https://appgallery.huawei.com/app/C111299787",
    vk: "https://vk.com/smart_cardio",
    tg: "https://t.me/smart_cardio",
    dzen: "https://dzen.ru/smartcardio",
}

export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get("to")

  if (!to) {
    return NextResponse.json({ error: "Unknown destination" }, { status: 400 })
  }

  // External redirects
  if (!ALLOWED_DESTINATIONS[to]) {
    return NextResponse.json({ error: "Unknown destination" }, { status: 400 })
  }

  return NextResponse.redirect(ALLOWED_DESTINATIONS[to])
}
