"use client"

import useSWR from "swr"
import type { FarcasterData } from "@/lib/farcaster-api"
import type { WalletData } from "@/lib/base-api"
import type { WalletNFTData } from "@/lib/opensea-api"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface WalletDataWithHistory extends WalletData {
  balanceHistory?: { date: string; balance: number }[]
}

export function useFarcasterData(username: string | null) {
  const { data, error, isLoading, mutate } = useSWR<FarcasterData>(
    username ? `/api/farcaster?username=${encodeURIComponent(username)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 minute
    },
  )

  return {
    data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

export function useWalletData(address: string | null) {
  const { data, error, isLoading, mutate } = useSWR<WalletData>(
    address ? `/api/wallet?address=${encodeURIComponent(address)}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // 30 seconds
    },
  )

  return {
    data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

export function useWalletDataWithHistory(address: string | null) {
  const { data, error, isLoading, mutate } = useSWR<WalletDataWithHistory>(
    address ? `/api/wallet?address=${encodeURIComponent(address)}&history=true` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  )

  return {
    data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

export function useNFTData(address: string | null, chain = "base") {
  const { data, error, isLoading, mutate } = useSWR<WalletNFTData>(
    address ? `/api/nfts?address=${encodeURIComponent(address)}&chain=${chain}&limit=12` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes
    },
  )

  return {
    data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}
