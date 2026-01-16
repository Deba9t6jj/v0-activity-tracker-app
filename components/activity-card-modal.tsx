"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Share2, Sparkles, Heart, MessageCircle, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toPng } from "html-to-image"

interface ActivityCardModalProps {
  isOpen: boolean
  onClose: () => void
  userData: {
    username: string
    displayName: string
    pfpUrl?: string | null
    bio?: string
    followers: number
    following: number
    totalLikes: number
    totalComments: number
    castsCount: number
    avgEngagement: number
    avgLikesPerCast: number
  }
}

type GenerationState = "idle" | "analyzing" | "complete"

function getTier(avgEngagement: number): {
  name: string
  accentColor: string
  bgGradient: string
  borderColor: string
  glowColor: string
  badgeBg: string
  badgeText: string
} {
  if (avgEngagement >= 40) {
    return {
      name: "Diamond",
      accentColor: "text-violet-600",
      bgGradient: "from-violet-50 via-white to-purple-50",
      borderColor: "border-violet-200",
      glowColor: "shadow-[0_0_40px_rgba(139,92,246,0.3)]",
      badgeBg: "bg-gradient-to-r from-violet-500 to-purple-500",
      badgeText: "text-white",
    }
  }
  if (avgEngagement >= 20) {
    return {
      name: "Platinum",
      accentColor: "text-slate-600",
      bgGradient: "from-slate-50 via-white to-gray-50",
      borderColor: "border-slate-200",
      glowColor: "shadow-[0_0_40px_rgba(148,163,184,0.3)]",
      badgeBg: "bg-gradient-to-r from-slate-400 to-gray-500",
      badgeText: "text-white",
    }
  }
  if (avgEngagement >= 10) {
    return {
      name: "Gold",
      accentColor: "text-amber-600",
      bgGradient: "from-amber-50 via-white to-yellow-50",
      borderColor: "border-amber-200",
      glowColor: "shadow-[0_0_40px_rgba(251,191,36,0.3)]",
      badgeBg: "bg-gradient-to-r from-amber-400 to-yellow-500",
      badgeText: "text-white",
    }
  }
  if (avgEngagement >= 5) {
    return {
      name: "Silver",
      accentColor: "text-gray-600",
      bgGradient: "from-gray-50 via-white to-slate-50",
      borderColor: "border-gray-200",
      glowColor: "shadow-[0_0_30px_rgba(148,163,184,0.25)]",
      badgeBg: "bg-gradient-to-r from-gray-400 to-slate-400",
      badgeText: "text-white",
    }
  }
  return {
    name: "Bronze",
    accentColor: "text-orange-600",
    bgGradient: "from-orange-50 via-white to-amber-50",
    borderColor: "border-orange-200",
    glowColor: "shadow-[0_0_30px_rgba(234,88,12,0.25)]",
    badgeBg: "bg-gradient-to-r from-orange-400 to-amber-500",
    badgeText: "text-white",
  }
}

function ProfileImage({ src, alt }: { src?: string | null; alt: string }) {
  const [imgError, setImgError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const initials = alt?.slice(0, 2).toUpperCase() || "FC"

  if (!src || imgError) {
    return (
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 ring-4 ring-white shadow-lg">
        {initials}
      </div>
    )
  }

  return (
    <div className="w-20 h-20 rounded-2xl overflow-hidden relative ring-4 ring-white shadow-lg">
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
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

export function ActivityCardModal({ isOpen, onClose, userData }: ActivityCardModalProps) {
  const [state, setState] = useState<GenerationState>("idle")
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisText, setAnalysisText] = useState("Analyzing engagement...")
  const [isDownloading, setIsDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const tier = getTier(userData.avgEngagement)

  useEffect(() => {
    if (isOpen) {
      setState("idle")
      setAnalysisProgress(0)
    }
  }, [isOpen])

  const handleGenerate = () => {
    setState("analyzing")
    setAnalysisProgress(0)

    const texts = [
      "Analyzing engagement...",
      "Calculating growth metrics...",
      "Evaluating social reach...",
      "Building your card...",
    ]

    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setAnalysisProgress(progress)

      const textIndex = Math.floor((progress / 100) * texts.length)
      if (textIndex < texts.length) {
        setAnalysisText(texts[textIndex])
      }

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setState("complete")
        }, 300)
      }
    }, 80)
  }

  const handleDownload = async () => {
    if (!cardRef.current || isDownloading) return

    setIsDownloading(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      })

      const link = document.createElement("a")
      link.download = `activity-card-${userData.username}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate image:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${userData.displayName}'s Farcaster Activity Card`,
          text: `Check out my Farcaster activity! ${tier.name} tier with ${userData.avgEngagement.toFixed(1)} avg engagement per cast.`,
          url: window.location.href,
        })
      } catch {
        // User cancelled
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Initial state */}
            {state === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 text-center shadow-2xl"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Activity Card</h2>
                <p className="text-gray-500 mb-8">Turn your Farcaster activity into a shareable visual card</p>
                <Button
                  onClick={handleGenerate}
                  className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Card
                </Button>
              </motion.div>
            )}

            {/* Analyzing state */}
            {state === "analyzing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-8 text-center shadow-2xl"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Heart, label: "Likes", value: userData.totalLikes },
                      { icon: MessageCircle, label: "Comments", value: userData.totalComments },
                      { icon: Users, label: "Followers", value: userData.followers },
                    ].map((metric, i) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <metric.icon className="w-4 h-4 mx-auto mb-2 text-blue-500" />
                        <motion.span className="text-lg font-bold text-gray-900 block">
                          {Math.floor((analysisProgress / 100) * metric.value).toLocaleString()}
                        </motion.span>
                        <span className="text-xs text-gray-500">{metric.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="h-16 flex items-end gap-1 px-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                        initial={{ height: 0 }}
                        animate={{
                          height: `${Math.max(20, Math.sin((i / 20) * Math.PI * 2 + analysisProgress / 30) * 40 + 50)}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">{analysisText}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Complete state - clean UI card matching dashboard style */}
            {state === "complete" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div
                  ref={cardRef}
                  className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${tier.bgGradient} border ${tier.borderColor} ${tier.glowColor}`}
                  style={{ aspectRatio: "1 / 1.3" }}
                >
                  {/* Subtle top accent glow */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-24 opacity-60"
                    style={{
                      background: `radial-gradient(ellipse at center, ${
                        tier.name === "Diamond"
                          ? "rgba(139,92,246,0.3)"
                          : tier.name === "Platinum"
                            ? "rgba(148,163,184,0.3)"
                            : tier.name === "Gold"
                              ? "rgba(251,191,36,0.3)"
                              : tier.name === "Silver"
                                ? "rgba(148,163,184,0.2)"
                                : "rgba(234,88,12,0.3)"
                      } 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative h-full flex flex-col p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-gray-500 tracking-wide">Activity Tracker</span>
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tier.badgeBg} ${tier.badgeText}`}
                      >
                        {tier.name}
                      </div>
                    </div>

                    {/* Profile section */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <ProfileImage src={userData.pfpUrl} alt={userData.displayName} />

                      <h3 className="text-xl font-bold text-gray-900 mt-4 flex items-center gap-1.5">
                        {userData.displayName}
                        <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500" />
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">@{userData.username}</p>

                      {/* Status badge */}
                      <div className="mt-3 px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                        {userData.avgEngagement >= 20
                          ? "High Engagement Creator"
                          : userData.avgEngagement >= 10
                            ? "Growing Account"
                            : "Active Builder"}
                      </div>

                      {/* Stats pills */}
                      <div className="flex gap-3 mt-4">
                        <div className="px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-100">
                          <span className={`text-lg font-bold ${tier.accentColor}`}>
                            {userData.avgEngagement.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">Avg Eng</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-100">
                          <span className={`text-lg font-bold ${tier.accentColor}`}>
                            {userData.avgLikesPerCast.toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">Avg Likes</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{userData.followers.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold">{userData.castsCount}</span>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full px-4 bg-gray-900 text-white hover:bg-gray-800 font-semibold text-xs"
                      >
                        Follow +
                      </Button>
                    </div>

                    {/* Mini activity chart */}
                    <div className="mt-3 h-10 flex items-end gap-0.5">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t ${
                            tier.name === "Diamond"
                              ? "bg-violet-300"
                              : tier.name === "Platinum"
                                ? "bg-slate-300"
                                : tier.name === "Gold"
                                  ? "bg-amber-300"
                                  : tier.name === "Silver"
                                    ? "bg-gray-300"
                                    : "bg-orange-300"
                          }`}
                          style={{
                            height: `${Math.max(15, Math.sin((i / 30) * Math.PI * 2) * 35 + 50 + Math.random() * 15)}%`,
                            opacity: 0.7 + Math.random() * 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex-1 py-5 rounded-2xl bg-white text-gray-900 hover:bg-gray-50 font-semibold border border-gray-200 shadow-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {isDownloading ? "Saving..." : "Download"}
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold border-0 shadow-lg"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
