import { type NextRequest, NextResponse } from "next/server"
import { getFarcasterData, getFarcasterDataByFid } from "@/lib/farcaster-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get("username")
  const fid = searchParams.get("fid")

  if (!username && !fid) {
    return NextResponse.json({ error: "Username or FID is required" }, { status: 400 })
  }

  const apiKey = process.env.NEYNAR_API_KEY
  console.log("[v0] NEYNAR_API_KEY exists:", !!apiKey)

  if (!apiKey) {
    return NextResponse.json(
      { error: "NEYNAR_API_KEY environment variable is not configured. Please add it in Vars." },
      { status: 500 },
    )
  }

  const data = fid ? await getFarcasterDataByFid(Number.parseInt(fid, 10)) : await getFarcasterData(username!)

  console.log("[v0] Farcaster data response:", {
    hasUser: !!data.user,
    username: data.user?.username,
    pfp_url: data.user?.pfp_url,
    display_name: data.user?.display_name,
  })

  if (data.error && !data.user) {
    return NextResponse.json({ error: data.error }, { status: 404 })
  }

  return NextResponse.json(data)
}
