"use client"

import { useEffect, useState, useCallback, useRef } from "react"

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
  const readyCalledRef = useRef(false)

  useEffect(() => {
    const load = async () => {
      try {
        // Dynamically import SDK
        const { default: sdk } = await import("@farcaster/frame-sdk")

        // This is critical - Farcaster requires ready() to be called ASAP
        if (!readyCalledRef.current) {
          readyCalledRef.current = true
          await sdk.actions.ready()
        }

        // Now get context with a timeout
        const timeout = new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 2000)
        })

        const frameContext = await Promise.race([sdk.context, timeout])

        if (frameContext && typeof frameContext === "object") {
          setContext(frameContext as FrameContext)
          setIsInFrame(true)
        } else {
          setIsInFrame(false)
        }
      } catch (error) {
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
