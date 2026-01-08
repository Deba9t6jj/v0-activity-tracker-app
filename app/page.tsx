"use client"

import { useState } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { DashboardScreen } from "@/components/dashboard-screen"
import { GuideScreen } from "@/components/guide-screen"
import { StatsScreen } from "@/components/stats-screen"
import { SettingsScreen } from "@/components/settings-screen"

type Screen = "onboarding" | "dashboard" | "guide" | "stats" | "settings"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding")
  const [userData, setUserData] = useState({
    farcasterUsername: "",
    walletAddress: "",
  })

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
