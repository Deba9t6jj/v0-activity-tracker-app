"use client"

import { motion } from "framer-motion"
import { Activity, ArrowLeft, Target, CheckCircle2, Circle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useFarcasterData } from "@/hooks/use-activity-data"

interface GuideScreenProps {
  farcasterUsername: string
  walletAddress: string
  onBack: () => void
}

export function GuideScreen({ farcasterUsername, onBack }: GuideScreenProps) {
  const { data: farcasterData, isLoading } = useFarcasterData(farcasterUsername || null)

  const postsThisWeek = farcasterData?.casts?.length || 0
  const likesGiven = farcasterData?.totalLikes || 0
  const commentsCount = farcasterData?.totalComments || 0
  const followersCount = farcasterData?.user?.follower_count || 0

  const socialGoals = [
    { label: "Posts this day", current: Math.min(postsThisWeek, 3), target: 3, completed: postsThisWeek >= 3 },
    { label: "Total engagement", current: Math.min(likesGiven, 50), target: 50, completed: likesGiven >= 50 },
    { label: "Comments received", current: Math.min(commentsCount, 10), target: 10, completed: commentsCount >= 10 },
    {
      label: "Follower milestone",
      current: Math.min(followersCount, 100),
      target: 100,
      completed: followersCount >= 100,
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(145deg, #f0f0f3 0%, #e6e6ea 100%)" }}>
      <header
        className="sticky top-0 z-50 px-4 py-4"
        style={{ background: "linear-gradient(145deg, #f0f0f3, #e6e6ea)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="glass-card px-4 py-3 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.55 0.2 250)" }}
              >
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-semibold">Activity Guide</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold" style={{ color: "oklch(0.55 0.2 250)" }}>
              Improve Your Activity
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Personalized tips to grow your Farcaster presence.</p>
          </div>

          <div className="grid gap-4">
            {/* Status Card - Like Hexagon AI status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`gradient-card p-6 ${postsThisWeek >= 3 ? "gradient-card-cyan" : "gradient-card-peach"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: postsThisWeek >= 3 ? "oklch(0.6 0.15 160)" : "oklch(0.7 0.15 60)" }}
                >
                  {postsThisWeek >= 3 ? (
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  ) : (
                    <Circle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {postsThisWeek >= 3
                      ? `Great job! You've posted ${postsThisWeek} times recently.`
                      : `You've posted ${postsThisWeek} time${postsThisWeek !== 1 ? "s" : ""} recently. Let's aim for 3!`}
                  </p>
                </div>
                {/* Status indicator like Hexagon AI */}
                <div className="status-indicator">
                  <span className="text-sm">{postsThisWeek >= 3 ? "Done" : "Working..."}</span>
                  <span className={`status-dot ${postsThisWeek >= 3 ? "done" : "working"}`} />
                </div>
              </div>
            </motion.div>

            {/* Goals - Like Retainable task status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="font-medium mb-4">Your Goals</h3>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 rounded-2xl" />
                  <Skeleton className="h-16 rounded-2xl" />
                </div>
              ) : (
                <div className="space-y-3">
                  {socialGoals.map((goal, index) => (
                    <div key={index} className="task-card">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {goal.completed ? (
                            <CheckCircle2 className="w-5 h-5" style={{ color: "oklch(0.6 0.15 160)" }} />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="text-sm font-medium">{goal.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${(goal.current / goal.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-medium mb-4">Suggestions</h3>
              <div className="space-y-2">
                {[
                  "Post more often to stay visible in your followers' feeds.",
                  "Engage with others by liking and commenting on posts.",
                  "Reply to comments on your posts to boost engagement.",
                  "Share interesting content to attract new followers.",
                ].map((tip, i) => (
                  <div key={i} className="task-card flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "oklch(0.55 0.2 250)" }} />
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA - Like profile card button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="gradient-card gradient-card-purple p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "oklch(0.55 0.2 250)" }}
                  >
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Ready to level up?</p>
                    <p className="text-sm text-muted-foreground">Set personalized goals for the week.</p>
                  </div>
                </div>
                <button
                  className="px-6 py-3 rounded-full text-sm font-medium text-white"
                  style={{
                    background: "oklch(0.55 0.2 250)",
                    boxShadow: "0 4px 16px oklch(0.55 0.2 250 / 0.3)",
                  }}
                >
                  Set Goals
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
