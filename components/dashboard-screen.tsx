"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  MessageSquare,
  Wallet,
  Heart,
  MessageCircle,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  TrendingUp,
  Settings,
  BarChart3,
  Lightbulb,
  RefreshCw,
  Coins,
  ImageIcon,
} from "lucide-react"
import { Tab } from "@/components/ui/tab"
import { StatCard } from "@/components/ui/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useFarcasterData, useWalletData, useNFTData } from "@/hooks/use-activity-data"

interface DashboardScreenProps {
  farcasterUsername: string
  walletAddress: string
  onNavigate: (screen: string) => void
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now()
  const time = timestamp.length === 10 ? Number(timestamp) * 1000 : new Date(timestamp).getTime()
  const diff = now - time

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export function DashboardScreen({ farcasterUsername, walletAddress, onNavigate }: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<number | null>(0)

  const {
    data: farcasterData,
    isLoading: farcasterLoading,
    refresh: refreshFarcaster,
  } = useFarcasterData(farcasterUsername || null)
  const { data: walletData, isLoading: walletLoading, refresh: refreshWallet } = useWalletData(walletAddress || null)
  const { data: nftData, isLoading: nftLoading, refresh: refreshNFTs } = useNFTData(walletAddress || null)

  console.log("[v0] Farcaster data:", farcasterData)
  console.log("[v0] User pfp_url:", farcasterData?.user?.pfp_url)

  const tabs = [
    { title: "Social", icon: MessageSquare },
    { title: "Wallet", icon: Wallet },
    { type: "separator" as const },
    { title: "Guide", icon: Lightbulb },
    { title: "Stats", icon: BarChart3 },
    { title: "Settings", icon: Settings },
  ]

  const handleTabChange = (index: number | null) => {
    setActiveTab(index)
    if (index === 3) onNavigate("guide")
    else if (index === 4) onNavigate("stats")
    else if (index === 5) onNavigate("settings")
  }

  const handleRefresh = () => {
    refreshFarcaster()
    refreshWallet()
    refreshNFTs()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Activity Tracker</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleRefresh} className="rounded-xl">
              <RefreshCw
                className={`w-4 h-4 ${farcasterLoading || walletLoading || nftLoading ? "animate-spin" : ""}`}
              />
            </Button>
            {farcasterData?.user?.pfp_url && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={farcasterData.user.pfp_url || "/placeholder.svg"} alt={farcasterUsername} />
                <AvatarFallback>{farcasterUsername?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              @{farcasterUsername || "user"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title & Tabs */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Your Activity Overview</h1>
            <p className="text-muted-foreground mt-1">
              A summary of your Farcaster and wallet activity.
            </p>
          </div>
          <Tab
            tabs={tabs}
            selected={activeTab}
            onChange={handleTabChange}
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Followers"
            value={farcasterData?.user?.follower_count?.toLocaleString() || 0}
            icon={Users}
            variant="blue"
            loading={farcasterLoading}
            delay={0}
          />
          <StatCard
            title="Following"
            value={farcasterData?.user?.following_count?.toLocaleString() || 0}
            icon={Users}
            variant="blue"
            loading={farcasterLoading}
            delay={0.1}
          />
          <StatCard
            title="Balance (USD)"
            value={walletData?.balance?.balanceUsd || "$0.00"}
            icon={Wallet}
            variant="purple"
            loading={walletLoading}
            delay={0.2}
          />
          <StatCard
            title="NFTs"
            value={nftData?.nfts?.length || 0}
            icon={ImageIcon}
            variant="purple"
            loading={nftLoading}
            delay={0.3}
          />
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Social Activity Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-sky-500/20 text-sky-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  Farcaster Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {farcasterLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <Skeleton className="h-24 rounded-xl" />
                  </div>
                ) : farcasterData?.user ? (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                      <Avatar className="w-16 h-16 border-2 border-sky-500/20">
                        <AvatarImage
                          src={farcasterData.user.pfp_url || "/placeholder.svg"}
                          alt={farcasterData.user.display_name}
                        />
                        <AvatarFallback className="text-lg">
                          {farcasterData.user.display_name?.slice(0, 2).toUpperCase() || "FC"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{farcasterData.user.display_name}</h3>
                        <p className="text-sm text-muted-foreground">@{farcasterData.user.username}</p>
                        {farcasterData.user.bio && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{farcasterData.user.bio}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Recent Casts</h4>
                      <div className="space-y-3">
                        {farcasterData.casts?.slice(0, 3).map((cast) => (
                          <div
                            key={cast.hash}
                            className="bg-secondary/50 rounded-xl p-4 hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <p className="text-sm mb-2 line-clamp-2">{cast.text}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" /> {cast.reactions?.likes_count || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" /> {cast.replies?.count || 0}
                              </span>
                              <span className="ml-auto">{formatRelativeTime(cast.timestamp)}</span>
                            </div>
                          </div>
                        ))}
                        {(!farcasterData.casts || farcasterData.casts.length === 0) && (
                          <p className="text-sm text-muted-foreground text-center py-4">No recent casts found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {farcasterUsername ? (
                      <p>User not found. Please check the username.</p>
                    ) : (
                      <p>Enter a Farcaster username to see activity</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Wallet Activity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-300">
                    <Wallet className="w-5 h-5" />
                  </div>
                  Base Wallet Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {walletLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-14 rounded-xl" />
                    <Skeleton className="h-14 rounded-xl" />
                    <Skeleton className="h-14 rounded-xl" />
                  </div>
                ) : walletData?.balance ? (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        NFT Collection
                      </h4>
                      {nftLoading ? (
                        <div className="grid grid-cols-3 gap-2">
                          {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="aspect-square rounded-xl" />
                          ))}
                        </div>
                      ) : nftData?.nfts && nftData.nfts.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {nftData.nfts.slice(0, 6).map((nft, idx) => (
                            <a
                              key={`${nft.contract}-${nft.identifier}-${idx}`}
                              href={nft.opensea_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="aspect-square rounded-xl overflow-hidden bg-secondary/50 hover:ring-2 hover:ring-purple-500/50 transition-all group relative"
                            >
                              {nft.image_url ? (
                                <img
                                  src={nft.image_url || "/placeholder.svg"}
                                  alt={nft.name || `NFT #${nft.identifier}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] text-white truncate">{nft.name || `#${nft.identifier}`}</p>
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-secondary/50 rounded-xl p-4 text-center">
                          <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">No NFTs found on Base</p>
                        </div>
                      )}
                      {nftData?.nfts && nftData.nfts.length > 6 && (
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          +{nftData.nfts.length - 6} more NFTs
                        </p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">Recent Transactions</h4>
                      <div className="space-y-2">
                        {walletData.transactions?.slice(0, 4).map((tx) => (
                          <a
                            key={tx.hash}
                            href={`https://basescan.org/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3 hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                tx.isReceive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                              }`}
                            >
                              {tx.isReceive ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm truncate">
                                {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                              </p>
                              <p className="text-xs text-muted-foreground">{formatRelativeTime(tx.timeStamp)}</p>
                            </div>
                            <p className={`text-sm font-medium ${tx.isReceive ? "text-emerald-500" : "text-rose-500"}`}>
                              {tx.isReceive ? "+" : "-"}
                              {tx.valueEth} ETH
                            </p>
                          </a>
                        ))}
                        {(!walletData.transactions || walletData.transactions.length === 0) && (
                          <p className="text-sm text-muted-foreground text-center py-4">No transactions found</p>
                        )}
                      </div>
                    </div>

                    {walletData.tokens && walletData.tokens.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Coins className="w-4 h-4" />
                          Token Holdings
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {walletData.tokens.slice(0, 4).map((token, idx) => (
                            <div key={idx} className="bg-secondary/50 rounded-xl p-3">
                              <p className="text-sm font-medium truncate">{token.symbol}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {Number(token.balance).toLocaleString(undefined, { maximumFractionDigits: 4 })}
                              </p>
                              {token.balanceUsd && <p className="text-xs text-muted-foreground">{token.balanceUsd}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full rounded-lg bg-transparent"
                      onClick={() => window.open(`https://basescan.org/address/${walletAddress}`, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Basescan
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {walletAddress ? (
                      <p>Unable to load wallet data. Please check the address.</p>
                    ) : (
                      <p>Enter a wallet address to see activity</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6"
        >
          <Card className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-sky-300" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Activity Score: {farcasterData?.user ? "Good" : "N/A"}</p>
                    <p className="text-sm text-white/80">
                      {farcasterData?.user ? "Keep up the engagement!" : "Connect your accounts to see your score"}
                    </p>
                  </div>
                </div>
                <Button onClick={() => onNavigate("guide")} className="rounded-xl bg-white/20 text-white hover:bg-white/30">
                  View Improvement Tips
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
