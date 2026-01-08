import { type NextRequest, NextResponse } from "next/server"
import { getFarcasterData } from "@/lib/farcaster-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  const apiKey = process.env.NEYNAR_API_KEY
  console.log("[v0] NEYNAR_API_KEY exists:", !!apiKey)
  console.log("[v0] NEYNAR_API_KEY length:", apiKey?.length || 0)

  if (!apiKey) {
    return NextResponse.json(
      { error: "NEYNAR_API_KEY environment variable is not configured. Please add it in Vars." },
      { status: 500 },
    )
  }

  const data = await getFarcasterData(username)

  console.log("[v0] Farcaster data response:", {
    hasUser: !!data.user,
    pfp_url: data.user?.pfp_url,
    display_name: data.user?.display_name,
  })

  if (data.error && !data.user) {
    return NextResponse.json({ error: data.error }, { status: 404 })
  }

  return NextResponse.json(data)
}
