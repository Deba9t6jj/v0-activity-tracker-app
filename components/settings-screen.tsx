"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, ArrowLeft, Bell, LogOut, User, Wallet, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface SettingsScreenProps {
  farcasterUsername: string
  walletAddress: string
  onBack: () => void
  onUpdate: (data: { farcasterUsername: string; walletAddress: string }) => void
  onLogout: () => void
}

export function SettingsScreen({ farcasterUsername, walletAddress, onBack, onUpdate, onLogout }: SettingsScreenProps) {
  const [username, setUsername] = useState(farcasterUsername)
  const [wallet, setWallet] = useState(walletAddress)
  const [reminders, setReminders] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const handleSave = () => {
    onUpdate({ farcasterUsername: username, walletAddress: wallet })
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
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

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Settings</h1>
            <p className="text-muted-foreground">Customize your preferences and notification settings.</p>
          </div>

          <div className="space-y-6">
            {/* Account Settings */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="settings-username">Farcaster Username</Label>
                  <Input
                    id="settings-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g., vitalik"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settings-wallet">Base Wallet Address</Label>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="settings-wallet"
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      placeholder="0x..."
                      className="rounded-xl font-mono text-sm"
                    />
                  </div>
                </div>
                <Button onClick={handleSave} className="rounded-xl">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminders">Activity Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminders to engage more frequently</p>
                  </div>
                  <Switch id="reminders" checked={reminders} onCheckedChange={setReminders} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive activity updates and wallet alerts</p>
                  </div>
                  <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Card className="rounded-2xl border-border/50">
              <CardContent className="p-6">
                <Button
                  variant="outline"
                  onClick={onLogout}
                  className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Clear Data & Start Over
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
