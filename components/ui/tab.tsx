"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TabProps {
  tabs: {
    title: string
    icon: React.ElementType
  }[]
  selected: number | null
  onChange: (index: number | null) => void
  className?: string
  activeColor?: string
}

export function Tab({ tabs, selected, onChange, className, activeColor = "text-primary" }: TabProps) {
  return (
    <div className={cn("flex items-center gap-2 p-1.5 bg-secondary/80 rounded-full", className)}>
      {tabs.map((tab, i) => {
        if ((tab as any).type === "separator") {
          return <div key={i} className="w-px h-5 bg-border/80" />
        }
        return (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selected === i ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {selected === i && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.title}
            </div>
          </button>
        )
      })}
    </div>
  )
}
