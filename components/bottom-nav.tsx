"use client"

import { Home, BookOpen, BarChart3, Settings } from "lucide-react"

interface BottomNavProps {
  activeTab: string
  onNavigate: (screen: string) => void
}

export function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "guide", label: "Guide", icon: BookOpen },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 md:hidden">
      <div className="max-w-md mx-auto">
        <nav
          className="flex items-center justify-center gap-1 p-1.5 rounded-full"
          style={{
            background: "oklch(0.98 0.002 250)",
            boxShadow:
              "0 2px 12px rgba(0, 0, 0, 0.06), 0 0 0 1px oklch(0.9 0.005 250 / 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab.id
                  ? {
                      background: "oklch(0.52 0.17 250)",
                      color: "white",
                      boxShadow: "0 1px 3px oklch(0.52 0.17 250 / 0.25), 0 2px 6px oklch(0.52 0.17 250 / 0.15)",
                    }
                  : {
                      color: "oklch(0.5 0.01 250)",
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export function BottomNavAlways({ activeTab, onNavigate }: BottomNavProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "guide", label: "Guide", icon: BookOpen },
    { id: "stats", label: "Stats", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
      <div className="max-w-md mx-auto">
        <nav
          className="flex items-center justify-center gap-1 p-1.5 rounded-full"
          style={{
            background: "oklch(0.98 0.002 250)",
            boxShadow:
              "0 2px 12px rgba(0, 0, 0, 0.06), 0 0 0 1px oklch(0.9 0.005 250 / 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
              style={
                activeTab === tab.id
                  ? {
                      background: "oklch(0.52 0.17 250)",
                      color: "white",
                      boxShadow: "0 1px 3px oklch(0.52 0.17 250 / 0.25), 0 2px 6px oklch(0.52 0.17 250 / 0.15)",
                    }
                  : {
                      color: "oklch(0.5 0.01 250)",
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
