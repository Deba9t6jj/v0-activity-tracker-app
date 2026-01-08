"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, ArrowRight, HelpCircle, Wallet, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OnboardingScreenProps {
  onSubmit: (data: { farcasterUsername: string; walletAddress: string }) => void
}

export function OnboardingScreen({ onSubmit }: OnboardingScreenProps) {
  const [farcasterUsername, setFarcasterUsername] = useState("")
  const [walletAddress, setWalletAddress] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (farcasterUsername || walletAddress) {
      onSubmit({ farcasterUsername, walletAddress })
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold tracking-tight">Activity Tracker</span>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl border shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-3 text-balance">Welcome to Activity Tracker!</h1>
            <p className="text-muted-foreground text-pretty">
              Track your Farcaster activity and wallet transactions without needing to log in!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Farcaster Input */}
            <div className="space-y-2">
              <Label htmlFor="farcaster" className="flex items-center gap-2 text-sm font-medium">
                <MessageSquare className="w-4 h-4 text-chart-2" />
                Farcaster Username
              </Label>
              <div className="relative">
                <Input
                  id="farcaster"
                  placeholder="e.g., vitalik"
                  value={farcasterUsername}
                  onChange={(e) => setFarcasterUsername(e.target.value)}
                  className="h-12 rounded-xl bg-secondary/50 border-border/50 pl-4 pr-4 placeholder:text-muted-foreground/60"
                />
              </div>
              <p className="text-xs text-muted-foreground">Enter username only (without @)</p>
            </div>

            {/* Wallet Input */}
            <div className="space-y-2">
              <Label htmlFor="wallet" className="flex items-center gap-2 text-sm font-medium">
                <Wallet className="w-4 h-4 text-chart-1" />
                Base Wallet Address
              </Label>
              <Input
                id="wallet"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="h-12 rounded-xl bg-secondary/50 border-border/50 pl-4 pr-4 font-mono text-sm placeholder:text-muted-foreground/60"
              />
              <p className="text-xs text-muted-foreground">Enter your Base wallet address</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!farcasterUsername && !walletAddress}
              className="w-full h-12 rounded-xl text-base font-medium group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Help Link */}
          <div className="mt-6 text-center">
            <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
              Need help finding your username or address?
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          No account connection required. Your data stays private.
        </p>
      </motion.div>
    </div>
  )
}
