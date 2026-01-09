"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useFarcasterContext } from "@/hooks/use-farcaster-context"

// Dynamic imports for client components
const OnboardingScreen = dynamic(
  () => import("@/components/onboarding-screen").then((mod) => ({ default: mod.OnboardingScreen })),
  { ssr: false },
)
const DashboardScreen = dynamic(
  () => import("@/components/dashboard-screen").then((mod) => ({ default: mod.DashboardScreen })),
  { ssr: false },
)
const GuideScreen = dynamic(() => import("@/components/guide-screen").then((mod) => ({ default: mod.GuideScreen })), {
  ssr: false,
})
const StatsScreen = dynamic(() => import("@/components/stats-screen").then((mod) => ({ default: mod.StatsScreen })), {
  ssr: false,
})
const SettingsScreen = dynamic(
  () => import("@/components/settings-screen").then((mod) => ({ default: mod.SettingsScreen })),
  { ssr: false },
)

type Screen = "onboarding" | "dashboard" | "guide" | "stats" | "settings"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding")
  const [userData, setUserData] = useState({
    farcasterUsername: "",
    walletAddress: "",
  })
  const [isInitialized, setIsInitialized] = useState(false)

  const { isSDKLoaded, isInFrame, user } = useFarcasterContext()

  useEffect(() => {
    if (isSDKLoaded && !isInitialized) {
      if (isInFrame && user?.username) {
        // Auto-login with Farcaster user data
        setUserData({
          farcasterUsername: user.username,
          walletAddress: "",
        })
        setCurrentScreen("dashboard")
      }
      setIsInitialized(true)
    }
  }, [isSDKLoaded, isInFrame, user, isInitialized])

  const handleOnboardingSubmit = (data: { farcasterUsername: string; walletAddress: string }) => {
    setUserData(data)
    setCurrentScreen("dashboard")
  }

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen)
  }

  const handleUpdateSettings = (data: { farcasterUsername: string; walletAddress: string }) => {
    setUserData(data)
    setCurrentScreen("dashboard")
  }

  const handleLogout = () => {
    setUserData({ farcasterUsername: "", walletAddress: "" })
    setCurrentScreen("onboarding")
  }

  if (!isSDKLoaded || !isInitialized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(145deg, #f0f0f3 0%, #e6e6ea 100%)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[oklch(0.55_0.2_250)] flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Loading Activity Tracker...</p>
        </div>
      </div>
    )
  }

  switch (currentScreen) {
    case "onboarding":
      return <OnboardingScreen onSubmit={handleOnboardingSubmit} />
    case "dashboard":
      return (
        <DashboardScreen
          farcasterUsername={userData.farcasterUsername}
          walletAddress={userData.walletAddress}
          onNavigate={handleNavigate}
        />
      )
    case "guide":
      return (
        <GuideScreen
          farcasterUsername={userData.farcasterUsername}
          walletAddress={userData.walletAddress}
          onBack={() => setCurrentScreen("dashboard")}
        />
      )
    case "stats":
      return (
        <StatsScreen
          farcasterUsername={userData.farcasterUsername}
          walletAddress={userData.walletAddress}
          onBack={() => setCurrentScreen("dashboard")}
        />
      )
    case "settings":
      return (
        <SettingsScreen
          farcasterUsername={userData.farcasterUsername}
          walletAddress={userData.walletAddress}
          onBack={() => setCurrentScreen("dashboard")}
          onUpdate={handleUpdateSettings}
          onLogout={handleLogout}
        />
      )
    default:
      return <OnboardingScreen onSubmit={handleOnboardingSubmit} />
  }
}
