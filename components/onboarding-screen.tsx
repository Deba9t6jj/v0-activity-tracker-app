"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, HelpCircle, Wallet, MessageSquare, Sparkles } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2 text-balance">Welcome to Activity Tracker</h1>
            <p className="text-muted-foreground text-pretty">
              Enter a Farcaster username or wallet address to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Farcaster Input */}
            <div className="space-y-2">
              <Label htmlFor="farcaster" className="font-medium">
                Farcaster Username
              </Label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="farcaster"
                  placeholder="e.g., vitalik"
                  value={farcasterUsername}
                  onChange={(e) => setFarcasterUsername(e.target.value)}
                  className="h-12 rounded-lg bg-secondary/50 border-border/50 pl-10 pr-4 placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Wallet Input */}
            <div className="space-y-2">
              <Label htmlFor="wallet" className="font-medium">
                Base Wallet Address
              </Label>
              <div className="relative">
                <Wallet className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="wallet"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="h-12 rounded-lg bg-secondary/50 border-border/50 pl-10 pr-4 font-mono text-sm placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!farcasterUsername && !walletAddress}
              className="w-full h-12 rounded-lg text-base font-medium group mt-6"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Help Link */}
          <div className="mt-6 text-center">
            <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
              Need help?
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          No account connection required. Your data stays private.
        </p>
      </motion.div>
    </div>
  )
}
