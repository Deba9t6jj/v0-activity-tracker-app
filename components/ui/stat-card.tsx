"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
  loading?: boolean
}

export function StatCard({ title, value, icon: Icon, color, loading = false }: StatCardProps) {
  return (
    <Card className="rounded-2xl border-border/60 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div
            className={cn("w-8 h-8 rounded-full flex items-center justify-center", color)}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-24 mt-2" />
        ) : (
          <p className="text-3xl font-semibold mt-2">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}
