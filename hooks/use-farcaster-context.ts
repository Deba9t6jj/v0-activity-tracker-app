"use client"

import { useEffect, useState, useCallback } from "react"

type FrameContext = {
  user?: {
    fid: number
    username?: string
    displayName?: string
    pfpUrl?: string
  }
  client?: {
    clientFid: number
    added: boolean
  }
}

export function useFarcasterContext() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<FrameContext | null>(null)
  const [isInFrame, setIsInFrame] = useState(false)

  useEffect(() => {
    const load = async () => {
      const timeout = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 1500) // 1.5s timeout
      })

      try {
        // Dynamically import SDK to prevent issues in non-frame environments
        const { default: sdk } = await import("@farcaster/frame-sdk")

        // Race between SDK context and timeout
        const frameContext = await Promise.race([sdk.context, timeout])

        if (frameContext && typeof frameContext === "object" && "user" in frameContext) {
          setContext(frameContext as FrameContext)
          setIsInFrame(true)
          // Signal that the app is ready to be displayed
          sdk.actions.ready()
        } else {
          // Timeout reached or no user context - running as standalone
          setIsInFrame(false)
        }
      } catch (error) {
        // Not in a frame context, running as standalone app
        console.log("Not in Farcaster frame context")
        setIsInFrame(false)
      }
      setIsSDKLoaded(true)
    }

    if (!isSDKLoaded) {
      load()
    }
  }, [isSDKLoaded])

  const openUrl = useCallback(
    async (url: string) => {
      if (isInFrame) {
        const { default: sdk } = await import("@farcaster/frame-sdk")
        sdk.actions.openUrl(url)
      } else {
        window.open(url, "_blank")
      }
    },
    [isInFrame],
  )

  const close = useCallback(async () => {
    if (isInFrame) {
      const { default: sdk } = await import("@farcaster/frame-sdk")
      sdk.actions.close()
    }
  }, [isInFrame])

  const openProfile = useCallback(
    async (fid: number) => {
      if (isInFrame) {
        const { default: sdk } = await import("@farcaster/frame-sdk")
        sdk.actions.openUrl(`https://warpcast.com/~/profiles/${fid}`)
      } else {
        window.open(`https://warpcast.com/~/profiles/${fid}`, "_blank")
      }
    },
    [isInFrame],
  )

  return {
    isSDKLoaded,
    context,
    isInFrame,
    user: context?.user,
    openUrl,
    close,
    openProfile,
  }
}
