"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, ArrowRight, HelpCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFarcasterContext } from "@/hooks/use-farcaster-context"

interface OnboardingScreenProps {
  onSubmit: (data: { farcasterUsername: string; walletAddress: string }) => void
}

export function OnboardingScreen({ onSubmit }: OnboardingScreenProps) {
  const [farcasterUsername, setFarcasterUsername] = useState("")
  const { isInFrame, user } = useFarcasterContext()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (farcasterUsername) {
      onSubmit({ farcasterUsername, walletAddress: "" })
    }
  }

  const handleUseConnectedAccount = () => {
    if (user?.username) {
      onSubmit({ farcasterUsername: user.username, walletAddress: "" })
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(145deg, #f0f0f3 0%, #e6e6ea 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="soft-container">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(0.55 0.2 250)",
                boxShadow: "0 4px 16px oklch(0.55 0.2 250 / 0.3)",
              }}
            >
              <Activity className="w-7 h-7 text-white" />
            </motion.div>
          </div>

          <div className="text-center mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{
                  background: "oklch(0.55 0.2 250 / 0.1)",
                  color: "oklch(0.55 0.2 250)",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Activity Tracker
              </div>
              <h1
                className="text-2xl font-semibold tracking-tight mb-3 text-balance"
                style={{ color: "oklch(0.55 0.2 250)" }}
              >
                Good Morning!
              </h1>
              <p className="text-muted-foreground text-sm text-pretty">
                Track your Farcaster activity without connecting your account.
              </p>
            </motion.div>
          </div>

          {isInFrame && user?.username && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-6"
            >
              <button
                onClick={handleUseConnectedAccount}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-[oklch(0.55_0.2_250)]/30 hover:border-[oklch(0.55_0.2_250)] hover:bg-[oklch(0.55_0.2_250)]/5 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  {user.pfpUrl && (
                    <img
                      src={user.pfpUrl || "/placeholder.svg"}
                      alt={user.displayName || user.username}
                      className="w-10 h-10 rounded-full ring-2 ring-[oklch(0.55_0.2_250)]/20"
                    />
                  )}
                  <div className="text-left flex-1">
                    <p className="font-medium text-sm">{user.displayName || user.username}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[oklch(0.55_0.2_250)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-left">
                  Continue with your connected Farcaster account
                </p>
              </button>
            </motion.div>
          )}

          {isInFrame && user?.username && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or enter manually</span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="task-card"
            >
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Farcaster Username</label>
              <Input
                placeholder="e.g., vitalik"
                value={farcasterUsername}
                onChange={(e) => setFarcasterUsername(e.target.value)}
                className="h-12 rounded-xl bg-white/50 border-white/60 text-base placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-[oklch(0.55_0.2_250)]/30"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button
                type="submit"
                disabled={!farcasterUsername}
                className="w-full h-12 rounded-full text-sm font-medium group text-white"
                style={{
                  background: "oklch(0.55 0.2 250)",
                  boxShadow: "0 4px 16px oklch(0.55 0.2 250 / 0.3)",
                }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </form>

          {/* Help Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              Need help?
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
