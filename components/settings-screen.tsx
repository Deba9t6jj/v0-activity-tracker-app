"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, ArrowLeft, Bell, LogOut, User, Save, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface SettingsScreenProps {
  farcasterUsername: string
  walletAddress: string
  onBack: () => void
  onUpdate: (data: { farcasterUsername: string; walletAddress: string }) => void
  onLogout: () => void
  isInFrame?: boolean
}

export function SettingsScreen({ farcasterUsername, onBack, onUpdate, onLogout, isInFrame }: SettingsScreenProps) {
  const [username, setUsername] = useState(farcasterUsername)
  const [reminders, setReminders] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const handleSave = () => {
    onUpdate({ farcasterUsername: username, walletAddress: "" })
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(145deg, #f0f0f3 0%, #e6e6ea 100%)" }}>
      <header
        className="sticky top-0 z-50 px-4 py-4"
        style={{ background: "linear-gradient(145deg, #f0f0f3, #e6e6ea)" }}
      >
        <div className="max-w-2xl mx-auto">
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
              <span className="text-base font-semibold">Settings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="space-y-4">
            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.55 0.2 250 / 0.1)" }}
                >
                  <User className="w-4 h-4" style={{ color: "oklch(0.55 0.2 250)" }} />
                </div>
                <h3 className="font-medium">Account Settings</h3>
              </div>

              <div className="task-card mb-4">
                <label className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" style={{ color: "oklch(0.55 0.2 250)" }} />
                  Farcaster Username
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., vitalik"
                  className="h-11 rounded-xl bg-white/50 border-white/60"
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 rounded-full text-sm font-medium text-white flex items-center justify-center gap-2"
                style={{
                  background: "oklch(0.55 0.2 250)",
                  boxShadow: "0 4px 16px oklch(0.55 0.2 250 / 0.3)",
                }}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.55 0.2 250 / 0.1)" }}
                >
                  <Bell className="w-4 h-4" style={{ color: "oklch(0.55 0.2 250)" }} />
                </div>
                <h3 className="font-medium">Notifications</h3>
              </div>

              <div className="space-y-3">
                <div className="task-card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Activity Reminders</p>
                    <p className="text-xs text-muted-foreground">Get reminders to engage more</p>
                  </div>
                  <Switch checked={reminders} onCheckedChange={setReminders} />
                </div>
                <div className="task-card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive activity updates</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </div>
            </motion.div>

            {/* Logout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <button
                onClick={onLogout}
                className="w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 text-rose-600"
                style={{
                  background: "rgba(255,255,255,0.6)",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.05), -2px -2px 6px rgba(255,255,255,0.8)",
                }}
              >
                <LogOut className="w-4 h-4" />
                Clear Data & Start Over
              </button>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
