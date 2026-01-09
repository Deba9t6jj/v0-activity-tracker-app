"use client"

import type React from "react"

import dynamic from "next/dynamic"

const WagmiProvider = dynamic(() => import("@/components/providers/wagmi-provider"), {
  ssr: false,
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiProvider>{children}</WagmiProvider>
}
