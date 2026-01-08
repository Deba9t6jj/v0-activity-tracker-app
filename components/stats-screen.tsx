"use client"

import { motion } from "framer-motion"
import { Activity, ArrowLeft, MessageSquare, Wallet, TrendingUp, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useFarcasterData, useWalletDataWithHistory } from "@/hooks/use-activity-data"

interface StatsScreenProps {
  farcasterUsername: string
  walletAddress: string
  onBack: () => void
}

export function StatsScreen({ farcasterUsername, walletAddress, onBack }: StatsScreenProps) {
  const { data: farcasterData, isLoading: farcasterLoading } = useFarcasterData(farcasterUsername || null)
  const { data: walletData, isLoading: walletLoading } = useWalletDataWithHistory(walletAddress || null)

  const socialChartData =
    farcasterData?.casts
      ?.slice(0, 7)
      .reverse()
      .map((cast, index) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index % 7],
        likes: cast.reactions?.likes_count || 0,
        comments: cast.replies?.count || 0,
      })) || []

  const walletChartData =
    walletData?.balanceHistory && walletData.balanceHistory.length > 0
      ? walletData.balanceHistory.slice(-7).map((item) => ({
          date: item.date,
          balance: item.balance,
        }))
      : walletData?.transactions
          ?.slice(0, 4)
          .reverse()
          .map((tx, index) => ({
            date: `W${index + 1}`,
            balance: Number(tx.valueEth),
          })) || []

  const isLoading = farcasterLoading || walletLoading

  const totalPosts = farcasterData?.casts?.length || 0
  const avgLikes = totalPosts > 0 ? Math.round((farcasterData?.totalLikes || 0) / totalPosts) : 0
  const totalTransactions = walletData?.transactions?.length || 0
  const totalMoved = walletData?.transactions?.reduce((sum, tx) => sum + Number(tx.valueEth), 0).toFixed(2) || "0"

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Activity Tracker</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Your Activity Stats</h1>
            <p className="text-muted-foreground">Detailed insights into your social and wallet activity over time.</p>
          </div>

          <div className="grid gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="rounded-2xl border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">Recent Casts</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold">{totalPosts}</p>
                  )}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-xs">Avg Likes</span>
                  </div>
                  {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-semibold">{avgLikes}</p>}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Wallet className="w-4 h-4" />
                    <span className="text-xs">Transactions</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold">{totalTransactions}</p>
                  )}
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Wallet className="w-4 h-4" />
                    <span className="text-xs">Total Moved</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold">{totalMoved} ETH</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-chart-2" />
                  Social Activity Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : socialChartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={socialChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="day" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="likes"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No social data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-chart-1" />
                  Balance History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : walletChartData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={walletChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value.toFixed(4)} ETH`, "Balance"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--chart-1))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No wallet data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-chart-4" />
                  Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Weekly Posts Goal</span>
                    <span className="text-muted-foreground">{Math.min(totalPosts, 10)}/10 posts</span>
                  </div>
                  <Progress value={Math.min(totalPosts * 10, 100)} className="h-3" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Monthly Transactions Goal</span>
                    <span className="text-muted-foreground">{Math.min(totalTransactions, 15)}/15 transactions</span>
                  </div>
                  <Progress value={Math.min((totalTransactions / 15) * 100, 100)} className="h-3" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Engagement Score</span>
                    <span className="text-muted-foreground">{Math.min(avgLikes * 2, 100)}/100</span>
                  </div>
                  <Progress value={Math.min(avgLikes * 2, 100)} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
