"use client"

import { useEffect, useState, useCallback } from "react"
import sdk, { type Context } from "@farcaster/frame-sdk"

export function useFarcasterContext() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [context, setContext] = useState<Context.FrameContext | null>(null)
  const [isInFrame, setIsInFrame] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        // Check if we're in a Farcaster frame context
        const frameContext = await sdk.context
        setContext(frameContext)
        setIsInFrame(!!frameContext?.user)

        // Signal that the app is ready to be displayed
        sdk.actions.ready()
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
    (url: string) => {
      if (isInFrame) {
        sdk.actions.openUrl(url)
      } else {
        window.open(url, "_blank")
      }
    },
    [isInFrame],
  )

  const close = useCallback(() => {
    if (isInFrame) {
      sdk.actions.close()
    }
  }, [isInFrame])

  const openProfile = useCallback(
    (fid: number) => {
      if (isInFrame) {
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
