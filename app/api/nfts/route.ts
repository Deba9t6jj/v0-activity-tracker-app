import { type NextRequest, NextResponse } from "next/server"
import { getNFTsByWallet } from "@/lib/opensea-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")
  const chain = searchParams.get("chain") || "base"
  const limit = Number(searchParams.get("limit")) || 10

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  try {
    const nftData = await getNFTsByWallet(address, chain, limit)
    return NextResponse.json(nftData)
  } catch (error) {
    console.error("[v0] NFT API route error:", error)
    return NextResponse.json({ error: "Failed to fetch NFTs" }, { status: 500 })
  }
}
