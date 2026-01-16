"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Share2, Sparkles, Heart, MessageCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  laserClass: string
  colors: { primary: string; secondary: string; glow: string; text: string }
} {
  if (avgEngagement >= 40) {
    return {
      name: "Diamond",
      laserClass: "laser-card-diamond",
      colors: {
        primary: "from-violet-500 via-purple-500 to-blue-500",
        secondary: "from-violet-600 to-blue-600",
        glow: "shadow-[0_0_60px_rgba(139,92,246,0.5)]",
        text: "text-violet-100",
      },
    }
  }
  if (avgEngagement >= 20) {
    return {
      name: "Platinum",
      laserClass: "laser-card-platinum",
      colors: {
        primary: "from-slate-300 via-gray-200 to-slate-400",
        secondary: "from-slate-400 to-gray-300",
        glow: "shadow-[0_0_50px_rgba(148,163,184,0.4)]",
        text: "text-slate-700",
      },
    }
  }
  if (avgEngagement >= 10) {
    return {
      name: "Gold",
      laserClass: "laser-card-gold",
      colors: {
        primary: "from-amber-400 via-yellow-400 to-orange-400",
        secondary: "from-amber-500 to-yellow-500",
        glow: "shadow-[0_0_50px_rgba(251,191,36,0.4)]",
        text: "text-amber-900",
      },
    }
  }
  if (avgEngagement >= 5) {
    return {
      name: "Silver",
      laserClass: "laser-card-silver",
      colors: {
        primary: "from-gray-300 via-slate-200 to-gray-400",
        secondary: "from-gray-400 to-slate-300",
        glow: "shadow-[0_0_40px_rgba(148,163,184,0.3)]",
        text: "text-gray-700",
      },
    }
  }
  return {
    name: "Bronze",
    laserClass: "laser-card-bronze",
    colors: {
      primary: "from-orange-700 via-amber-700 to-yellow-800",
      secondary: "from-orange-800 to-amber-700",
      glow: "shadow-[0_0_30px_rgba(180,83,9,0.3)]",
      text: "text-orange-100",
    },
  }
}

function ProfileImage({ src, alt }: { src?: string | null; alt: string }) {
  const [imgError, setImgError] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const initials = alt?.slice(0, 2).toUpperCase() || "FC"

  if (!src || imgError) {
    return (
      <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600">
        {initials}
      </div>
    )
  }

  return (
    <div className="w-24 h-24 rounded-2xl overflow-hidden relative ring-4 ring-white/30">
      {!loaded && <div className="absolute inset-0 bg-gray-300 animate-pulse" />}
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
  const cardRef = useRef<HTMLDivElement>(null)

  const tier = getTier(userData.avgEngagement)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setState("idle")
      setAnalysisProgress(0)
    }
  }, [isOpen])

  const handleGenerate = () => {
    setState("analyzing")
    setAnalysisProgress(0)

    // Simulate analysis with progress
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
    if (!cardRef.current) return

    // Use html2canvas for screenshot
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      })

      const link = document.createElement("a")
      link.download = `activity-card-${userData.username}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch {
      // Fallback: alert user
      alert("Screenshot functionality requires html2canvas. Card is ready to screenshot!")
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
          style={{ background: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Initial state - prompt to generate */}
            {state === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-center border border-white/10"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Generate Activity Card</h2>
                <p className="text-gray-400 mb-8">Turn your Farcaster activity into a shareable visual card</p>
                <Button
                  onClick={handleGenerate}
                  className="w-full py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
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
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-center border border-white/10"
              >
                <div className="space-y-6">
                  {/* Animated metrics */}
                  <div className="grid grid-cols-3 gap-4">
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
                        className="p-4 rounded-xl bg-white/5"
                      >
                        <metric.icon className="w-5 h-5 mx-auto mb-2 text-blue-400" />
                        <motion.span
                          className="text-xl font-bold text-white block"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {Math.floor((analysisProgress / 100) * metric.value).toLocaleString()}
                        </motion.span>
                        <span className="text-xs text-gray-500">{metric.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Animated line chart */}
                  <div className="h-20 flex items-end gap-1">
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

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400">{analysisText}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Complete state - show the card with laser glow effect */}
            {state === "complete" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className={`laser-card ${tier.laserClass}`}>
                  <div
                    ref={cardRef}
                    className="relative rounded-3xl overflow-hidden"
                    style={{ aspectRatio: "1 / 1.2" }}
                  >
                    {/* Background gradient based on tier */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tier.colors.primary}`} />

                    {/* Glow effect at top */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32"
                      style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)",
                        filter: "blur(20px)",
                      }}
                    />

                    {/* Content */}
                    <div className="relative h-full flex flex-col p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <span className={`text-sm font-semibold ${tier.colors.text} opacity-80`}>Activity Tracker</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 ${tier.colors.text}`}>
                          {tier.name}
                        </div>
                      </div>

                      {/* Profile section */}
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <ProfileImage src={userData.pfpUrl} alt={userData.displayName} />
                        <h3 className={`text-2xl font-bold mt-4 ${tier.colors.text}`}>
                          {userData.displayName}
                          <span className="ml-2 inline-block">
                            <svg className="w-5 h-5 inline text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        </h3>
                        <p className={`text-sm ${tier.colors.text} opacity-70 mt-1`}>@{userData.username}</p>

                        {/* Status label */}
                        <div className={`mt-3 px-4 py-1.5 rounded-full bg-white/15 ${tier.colors.text} text-sm`}>
                          {userData.avgEngagement >= 20
                            ? "High Engagement Creator"
                            : userData.avgEngagement >= 10
                              ? "Growing Account"
                              : "Active Builder"}
                        </div>
                      </div>

                      {/* Stats pills */}
                      <div className="flex justify-center gap-3 mb-4">
                        <div className={`px-4 py-2 rounded-xl bg-white/15 ${tier.colors.text}`}>
                          <span className="text-lg font-bold">{userData.avgEngagement.toFixed(1)}</span>
                          <span className="text-xs opacity-70 ml-1">Avg Eng</span>
                        </div>
                        <div className={`px-4 py-2 rounded-xl bg-white/15 ${tier.colors.text}`}>
                          <span className="text-lg font-bold">{userData.avgLikesPerCast.toFixed(1)}</span>
                          <span className="text-xs opacity-70 ml-1">Avg Likes</span>
                        </div>
                      </div>

                      {/* Bottom stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/20">
                        <div className={`flex items-center gap-1.5 ${tier.colors.text}`}>
                          <Users className="w-4 h-4 opacity-70" />
                          <span className="font-semibold">{userData.followers.toLocaleString()}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${tier.colors.text}`}>
                          <MessageCircle className="w-4 h-4 opacity-70" />
                          <span className="font-semibold">{userData.castsCount}</span>
                        </div>
                        <Button
                          size="sm"
                          className="rounded-full px-4 bg-white/90 text-gray-900 hover:bg-white font-semibold"
                        >
                          Follow +
                        </Button>
                      </div>

                      {/* Mini chart */}
                      <div className="mt-4 h-12 flex items-end gap-0.5">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-white/30"
                            style={{
                              height: `${Math.max(15, Math.sin((i / 30) * Math.PI * 2) * 40 + 50 + Math.random() * 20)}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 py-5 rounded-2xl bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={handleShare}
                    className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold border-0"
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
