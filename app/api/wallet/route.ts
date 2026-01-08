import { type NextRequest, NextResponse } from "next/server"
import { getWalletData, getBalanceHistory } from "@/lib/base-api"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")
  const includeHistory = searchParams.get("history") === "true"

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 })
  }

  const data = await getWalletData(address)

  if (data.error) {
    return NextResponse.json({ error: data.error }, { status: 400 })
  }

  // Optionally include balance history for charts
  if (includeHistory) {
    const history = await getBalanceHistory(address)
    return NextResponse.json({ ...data, balanceHistory: history })
  }

  return NextResponse.json(data)
}
