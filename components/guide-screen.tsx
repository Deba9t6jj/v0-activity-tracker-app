"use client"

import { motion } from "framer-motion"
import {
  Activity,
  ArrowLeft,
  MessageSquare,
  Wallet,
  Target,
  CheckCircle2,
  Circle,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useFarcasterData, useWalletData } from "@/hooks/use-activity-data"

interface GuideScreenProps {
  farcasterUsername: string
  walletAddress: string
  onBack: () => void
}

export function GuideScreen({ farcasterUsername, walletAddress, onBack }: GuideScreenProps) {
  const { data: farcasterData, isLoading: farcasterLoading } = useFarcasterData(farcasterUsername || null)
  const { data: walletData, isLoading: walletLoading } = useWalletData(walletAddress || null)

  const isLoading = farcasterLoading || walletLoading

  // Calculate goals from real data
  const postsThisWeek = farcasterData?.casts?.length || 0
  const likesGiven = farcasterData?.totalLikes || 0
  const commentsCount = farcasterData?.totalComments || 0
  const transactionsCount = walletData?.transactions?.length || 0

  const socialGoals = [
    { label: "Posts this week", current: Math.min(postsThisWeek, 3), target: 3, completed: postsThisWeek >= 3 },
    { label: "Total engagement", current: Math.min(likesGiven, 50), target: 50, completed: likesGiven >= 50 },
    { label: "Comments received", current: Math.min(commentsCount, 10), target: 10, completed: commentsCount >= 10 },
  ]

  const walletGoals = [
    {
      label: "Transactions this month",
      current: Math.min(transactionsCount, 5),
      target: 5,
      completed: transactionsCount >= 5,
    },
    {
      label: "Active wallet usage",
      current: transactionsCount > 0 ? 1 : 0,
      target: 1,
      completed: transactionsCount > 0,
    },
  ]

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
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
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Your Activity Improvement Guide</h1>
            <p className="text-muted-foreground">
              Personalized tips and goals to help you stay engaged and grow your presence.
            </p>
          </div>

          <div className="grid gap-6">
            {/* Social Activity Guide */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-chart-2" />
                  Social Activity Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                  </div>
                ) : (
                  <>
                    {/* Status Message - Dynamic based on real data */}
                    <div
                      className={`${postsThisWeek >= 3 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"} border rounded-xl p-4`}
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles
                          className={`w-5 h-5 ${postsThisWeek >= 3 ? "text-emerald-500" : "text-amber-500"} mt-0.5`}
                        />
                        <div>
                          <p
                            className={`font-medium ${postsThisWeek >= 3 ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}
                          >
                            {postsThisWeek >= 3
                              ? `Great job! You've posted ${postsThisWeek} times recently. Keep it up!`
                              : `You've posted ${postsThisWeek} time${postsThisWeek !== 1 ? "s" : ""} recently. Let's aim for 3 posts!`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Goals */}
                    <div className="space-y-4">
                      {socialGoals.map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {goal.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">{goal.label}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {goal.current}/{goal.target}
                            </span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Suggestions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                          Post more often to stay visible in your followers&apos; feeds.
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                          Engage with others by liking and commenting on posts.
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                          Reply to comments on your posts to boost engagement.
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Wallet Activity Guide */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-chart-1" />
                  Wallet Activity Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                    <Skeleton className="h-12 rounded-xl" />
                  </div>
                ) : (
                  <>
                    {/* Status Message - Dynamic based on real data */}
                    <div
                      className={`${transactionsCount >= 5 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-chart-2/10 border-chart-2/20"} border rounded-xl p-4`}
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles
                          className={`w-5 h-5 ${transactionsCount >= 5 ? "text-emerald-500" : "text-chart-2"} mt-0.5`}
                        />
                        <div>
                          <p
                            className={`font-medium ${transactionsCount >= 5 ? "text-emerald-700 dark:text-emerald-400" : "text-teal-700 dark:text-teal-400"}`}
                          >
                            {transactionsCount >= 5
                              ? `Excellent! You've made ${transactionsCount} transactions. You're very active!`
                              : `You've made ${transactionsCount} transaction${transactionsCount !== 1 ? "s" : ""} recently. Let's aim for 5!`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Goals */}
                    <div className="space-y-4">
                      {walletGoals.map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {goal.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">{goal.label}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {goal.current}/{goal.target}
                            </span>
                          </div>
                          <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>

                    {/* Tips */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Suggestions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-chart-1 mt-0.5 shrink-0" />
                          Try transferring a small amount of crypto to stay active.
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-chart-1 mt-0.5 shrink-0" />
                          Explore NFT collections on Base to discover new projects.
                        </li>
                        <li className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-chart-1 mt-0.5 shrink-0" />
                          Set up wallet alerts to monitor your balance and transactions.
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Set Goals CTA */}
            <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-chart-2/5 to-chart-1/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Ready to level up?</p>
                      <p className="text-sm text-muted-foreground">Set personalized goals for the upcoming week.</p>
                    </div>
                  </div>
                  <Button className="rounded-xl">Set Goals</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
