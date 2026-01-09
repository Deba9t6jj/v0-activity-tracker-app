"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  variant: "blue" | "purple"
  loading?: boolean
  delay?: number
}

export function StatCard({ title, value, icon: Icon, variant, loading = false, delay = 0 }: StatCardProps) {
  const colors = {
    blue: "bg-sky-500/20 text-sky-300",
    purple: "bg-purple-500/20 text-purple-300",
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white/80">{title}</p>
          <div
            className={cn("w-8 h-8 rounded-full flex items-center justify-center", colors[variant])}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-24 mt-2 bg-white/20" />
        ) : (
          <p className="text-3xl font-semibold mt-2 text-white">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}
