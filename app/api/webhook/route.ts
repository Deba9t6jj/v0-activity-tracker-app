import { type NextRequest, NextResponse } from "next/server"

// Webhook endpoint for Farcaster notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle different webhook events
    const { event, data } = body

    switch (event) {
      case "frame_added":
        // User added the frame/mini app
        console.log("Frame added by user:", data)
        break
      case "frame_removed":
        // User removed the frame/mini app
        console.log("Frame removed by user:", data)
        break
      case "notifications_enabled":
        // User enabled notifications
        console.log("Notifications enabled:", data)
        break
      case "notifications_disabled":
        // User disabled notifications
        console.log("Notifications disabled:", data)
        break
      default:
        console.log("Unknown webhook event:", event, data)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
