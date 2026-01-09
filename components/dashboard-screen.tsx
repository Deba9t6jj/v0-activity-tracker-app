"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, MessageSquare, Heart, MessageCircle, RefreshCw, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useFarcasterData } from "@/hooks/use-activity-data"

interface DashboardScreenProps {
  farcasterUsername: string
  walletAddress: string
  onNavigate: (screen: string) => void
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now()
  const time = timestamp.length === 10 ? Number(timestamp) * 1000 : new Date(timestamp).getTime()
  const diff = now - time

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

function ProfileImage({ src, alt, size = "md" }: { src?: string | null; alt: string; size?: "sm" | "md" | "lg" }) {
  const [imgError, setImgError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  }

  const initials = alt?.slice(0, 2).toUpperCase() || "FC"

  if (!src || imgError) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold`}
        style={{
          background: "oklch(0.55 0.2 250)",
          boxShadow: "0 0 0 4px oklch(0.7 0.15 250 / 0.3)",
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden relative`}
      style={{ boxShadow: "0 0 0 4px oklch(0.7 0.15 250 / 0.3)" }}
    >
      {!loaded && <div className="absolute inset-0 bg-secondary animate-pulse" />}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
        onError={() => setImgError(true)}
        onLoad={() => setLoaded(true)}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}

export function DashboardScreen({ farcasterUsername, onNavigate }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const {
    data: farcasterData,
    isLoading: farcasterLoading,
    refresh: refreshFarcaster,
  } = useFarcasterData(farcasterUsername || null)

  const handleRefresh = () => {
    refreshFarcaster()
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(145deg, #f0f0f3 0%, #e6e6ea 100%)" }}>
      <header
        className="sticky top-0 z-50 px-4 py-4"
        style={{ background: "linear-gradient(145deg, #f0f0f3, #e6e6ea)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="glass-card px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.55 0.2 250)" }}
              >
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-semibold">Activity Tracker</span>
            </div>

            <div className="pill-nav">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "guide", label: "Guide" },
                { id: "stats", label: "Stats" },
                { id: "settings", label: "Settings" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => (tab.id === "dashboard" ? setActiveTab(tab.id) : onNavigate(tab.id))}
                  className={`pill-nav-item ${activeTab === tab.id ? "active" : ""}`}
                  style={{
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="rounded-full w-10 h-10"
                style={{ background: "rgba(255,255,255,0.5)" }}
              >
                <RefreshCw className={`w-4 h-4 ${farcasterLoading ? "animate-spin" : ""}`} />
              </Button>
              <ProfileImage
                src={farcasterData?.user?.pfp_url}
                alt={farcasterData?.user?.display_name || farcasterUsername}
                size="sm"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "oklch(0.55 0.2 250)" }}>
            Good Morning, {farcasterData?.user?.display_name || farcasterUsername}!
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Profile Card - Like reference image 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gradient-card gradient-card-cyan p-6"
          >
            {farcasterLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : farcasterData?.user ? (
              <>
                <div className="flex justify-end mb-2">
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  </button>
                </div>
                <ProfileImage
                  src={farcasterData.user.pfp_url}
                  alt={farcasterData.user.display_name || farcasterUsername}
                  size="lg"
                />
                <h3 className="font-semibold text-xl mt-4">{farcasterData.user.display_name}</h3>
                <p className="text-sm text-muted-foreground">@{farcasterData.user.username}</p>

                {/* Tags like profile card reference */}
                <div className="flex gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-white/60 text-muted-foreground">Farcaster</span>
                  <span className="px-3 py-1 rounded-full text-xs bg-white/60 text-muted-foreground">Base</span>
                </div>

                {/* Stats row like profile card reference */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/30">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star className="w-4 h-4" style={{ color: "oklch(0.55 0.2 250)" }} />
                      <span className="font-semibold">
                        {((farcasterData.totalLikes || 0) / Math.max(farcasterData.casts?.length || 1, 1)).toFixed(1)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Likes</p>
                  </div>
                  <div className="text-center border-l border-r border-white/30 px-4">
                    <span className="font-semibold">{farcasterData.user.follower_count?.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <span className="font-semibold">{farcasterData.user.following_count?.toLocaleString()}</span>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>

                {/* CTA button like profile card */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="flex-1 py-3 rounded-full text-sm font-medium"
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      boxShadow: "2px 2px 6px rgba(0,0,0,0.05), -2px -2px 6px rgba(255,255,255,0.8)",
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white"
                    style={{ boxShadow: "2px 2px 6px rgba(0,0,0,0.05)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Enter a username to see profile</p>
              </div>
            )}
          </motion.div>

          {/* Engagement Chart - Like Youcare Health Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Engagement Rate</h3>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: "oklch(0.55 0.2 250 / 0.1)", color: "oklch(0.55 0.2 250)" }}
              >
                +0.75%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold">
                {Math.min(
                  ((farcasterData?.totalLikes || 0) / Math.max(farcasterData?.casts?.length || 1, 1)) * 10,
                  100,
                ).toFixed(0)}
                %
              </span>
            </div>
            {/* Simple bar chart like Youcare */}
            <div className="flex items-end gap-1 h-20">
              {["Mon", "Tue", "Wed", "Thu"].map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg"
                    style={{
                      height: `${30 + Math.random() * 50}%`,
                      background: "oklch(0.55 0.2 250 / 0.7)",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Progress - Like Retainable */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Activity Progress</h3>
              <span className="text-xs text-muted-foreground">...</span>
            </div>
            {/* Timeline items like Retainable checkup progress */}
            <div className="space-y-4">
              {[
                { date: "Today", label: "Posted 3 casts", done: true },
                { date: "Yesterday", label: "10+ engagements", done: true },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.55 0.2 250 / 0.1)" }}
                  >
                    <MessageSquare className="w-5 h-5" style={{ color: "oklch(0.55 0.2 250)" }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: "oklch(0.55 0.2 250)" }}>
                      {item.date}
                    </p>
                    <div className="progress-bar-container mt-1.5">
                      <div className="progress-bar-fill" style={{ width: item.done ? "100%" : "60%" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Casts - Like Retainable task status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="gradient-card gradient-card-peach p-6 md:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Recent Casts</h3>
              <button
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  background: "oklch(0.55 0.2 250)",
                  color: "white",
                }}
              >
                See Details
              </button>
            </div>

            <div className="space-y-3">
              {farcasterLoading ? (
                <>
                  <Skeleton className="h-16 rounded-2xl" />
                  <Skeleton className="h-16 rounded-2xl" />
                </>
              ) : (
                farcasterData?.casts?.slice(0, 3).map((cast) => (
                  <div key={cast.hash} className="task-card">
                    <p className="text-sm line-clamp-1 mb-2">{cast.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-500" /> {cast.reactions?.likes_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" style={{ color: "oklch(0.55 0.2 250)" }} />{" "}
                          {cast.replies?.count || 0}
                        </span>
                      </div>
                      {/* Status indicator like hexagon AI */}
                      <div className="status-indicator">
                        <span className="text-muted-foreground">{formatRelativeTime(cast.timestamp)}</span>
                        <span className={`status-dot ${(cast.reactions?.likes_count || 0) > 5 ? "done" : "working"}`} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Total Engagement</h3>
              <button className="text-xs text-muted-foreground">See Details</button>
            </div>
            <div className="space-y-3">
              <div
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.5)" }}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="text-sm">Total Likes</span>
                </div>
                <span className="font-semibold">{farcasterData?.totalLikes?.toLocaleString() || 0}</span>
              </div>
              <div
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.5)" }}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" style={{ color: "oklch(0.55 0.2 250)" }} />
                  <span className="text-sm">Comments</span>
                </div>
                <span className="font-semibold">{farcasterData?.totalComments?.toLocaleString() || 0}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
