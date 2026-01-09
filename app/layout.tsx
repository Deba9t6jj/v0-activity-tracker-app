import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "./providers"
import { minikitConfig } from "@/lib/minikit-config"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  const ROOT_URL = process.env.NEXT_PUBLIC_URL || "https://activity-tracker.vercel.app"

  return {
    title: "Activity Tracker - Track Farcaster Activity",
    description: "Track your Farcaster social activity with beautiful analytics and insights.",
    generator: "v0.app",
    icons: {
      icon: [
        {
          url: "/icon-light-32x32.png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/icon-dark-32x32.png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/icon.svg",
          type: "image/svg+xml",
        },
      ],
      apple: "/apple-icon.png",
    },
    openGraph: {
      title: minikitConfig.miniapp.ogTitle,
      description: minikitConfig.miniapp.ogDescription,
      images: [minikitConfig.miniapp.ogImageUrl],
    },
    // Farcaster Mini App embed metadata
    other: {
      "base:app_id": "69613b498a6eeb04b568da24",
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: `${ROOT_URL}/og-image.png`,
        button: {
          title: "Track Activity",
          action: {
            type: "launch_miniapp",
            name: minikitConfig.miniapp.name,
            url: ROOT_URL,
            splashImageUrl: minikitConfig.miniapp.splashImageUrl,
            splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
          },
        },
      }),
    },
  }
}

export const viewport: Viewport = {
  themeColor: "#f0f0f3",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
