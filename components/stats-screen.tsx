"use client"

import { motion } from "framer-motion"
import { Activity, ArrowLeft, MessageSquare, TrendingUp, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useFarcasterData } from "@/hooks/use-activity-data"

interface StatsScreenProps {
  farcasterUsername: string
  walletAddress: string
  onBack: () => void
}

export function StatsScreen({ farcasterUsername, onBack }: StatsScreenProps) {
  const { data: farcasterData, isLoading: farcasterLoading } = useFarcasterData(farcasterUsername || null)

  const socialChartData =
    farcasterData?.casts
      ?.slice(0, 7)
      .reverse()
      .map((cast, index) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index % 7],
        likes: cast.reactions?.likes_count || 0,
        comments: cast.replies?.count || 0,
      })) || []

  const totalPosts = farcasterData?.casts?.length || 0
  const avgLikes = totalPosts > 0 ? Math.round((farcasterData?.totalLikes || 0) / totalPosts) : 0
  const avgComments = totalPosts > 0 ? Math.round((farcasterData?.totalComments || 0) / totalPosts) : 0
  const engagementRate = totalPosts > 0 ? Math.min(avgLikes * 2, 100) : 0

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(145deg, #f0f0f3 0%, #e6e6ea 100%)" }}>
      <header
        className="sticky top-0 z-50 px-4 py-4"
        style={{ background: "linear-gradient(145deg, #f0f0f3, #e6e6ea)" }}
      >
        <div className="max-w-5xl mx-auto">
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
              <span className="text-base font-semibold">Activity Stats</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: MessageSquare, label: "Recent Casts", value: totalPosts },
              { icon: BarChart3, label: "Avg Likes", value: avgLikes },
              { icon: MessageSquare, label: "Avg Comments", value: avgComments },
              { icon: TrendingUp, label: "Engagement", value: `${engagementRate}%` },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "oklch(0.55 0.2 250 / 0.1)" }}
                  >
                    <stat.icon className="w-4 h-4" style={{ color: "oklch(0.55 0.2 250)" }} />
                  </div>
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                {farcasterLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-semibold">{stat.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Line Chart like Youcare */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-medium mb-4">Engagement Trends</h3>
              {farcasterLoading ? (
                <Skeleton className="h-48 w-full rounded-2xl" />
              ) : socialChartData.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={socialChartData}>
                      <defs>
                        <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.55 0.2 250)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="rgba(0,0,0,0.3)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="rgba(0,0,0,0.3)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="likes"
                        stroke="oklch(0.55 0.2 250)"
                        strokeWidth={2}
                        fill="url(#colorLikes)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground bg-secondary/20 rounded-2xl">
                  No data available
                </div>
              )}
            </motion.div>

            {/* Bar Chart like Youcare Patient Report */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="gradient-card gradient-card-peach p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Weekly Activity</h3>
                <button
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: "oklch(0.55 0.2 250)", color: "white" }}
                >
                  See Details
                </button>
              </div>
              {socialChartData.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={socialChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="rgba(0,0,0,0.3)" />
                      <YAxis tick={{ fontSize: 12 }} stroke="rgba(0,0,0,0.3)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Bar dataKey="likes" fill="oklch(0.55 0.2 250)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground">No data available</div>
              )}
            </motion.div>
          </div>

          {/* Goal Progress - Like Retainable usage transparency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="font-medium mb-4">Goal Progress</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Posts Today", current: Math.min(totalPosts, 3), max: 3, unit: "posts" },
                { label: "Engagement Target", current: Math.min(avgLikes, 50), max: 50, unit: "likes/post" },
                { label: "Community Growth", current: Math.min(engagementRate, 100), max: 100, unit: "%" },
              ].map((goal, index) => (
                <div key={index} className="task-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{goal.label}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {goal.current}/{goal.max} {goal.unit}
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${(goal.current / goal.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
