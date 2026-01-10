// Farcaster API using Neynar

export interface FarcasterUser {
  fid: number
  username: string
  display_name: string
  pfp_url: string
  follower_count: number
  following_count: number
  verifications: string[]
  bio: string
}

export interface FarcasterCast {
  hash: string
  text: string
  timestamp: string
  reactions: {
    likes_count: number
    recasts_count: number
  }
  replies: {
    count: number
  }
  author: {
    username: string
    display_name: string
    pfp_url: string
  }
}

export interface FarcasterData {
  user: FarcasterUser | null
  casts: FarcasterCast[]
  totalLikes: number
  totalComments: number
  error?: string
}

function getApiKey(): string {
  return process.env.NEYNAR_API_KEY || ""
}

function normalizeUsername(username: string): string {
  // Remove @ prefix if present
  let normalized = username.startsWith("@") ? username.slice(1) : username

  // Remove common domain suffixes
  const suffixes = [".farcaster.eth", ".base.eth", ".eth", ".xyz", ".lens"]
  for (const suffix of suffixes) {
    if (normalized.toLowerCase().endsWith(suffix)) {
      normalized = normalized.slice(0, -suffix.length)
      break
    }
  }

  // Remove any remaining special characters that aren't valid in Farcaster usernames
  // Farcaster usernames can only contain lowercase letters, numbers, and underscores
  normalized = normalized.toLowerCase().trim()

  return normalized
}

// Get user by username
export async function getFarcasterUser(username: string): Promise<FarcasterUser | null> {
  try {
    const apiKey = getApiKey()
    if (!apiKey) {
      console.error("[v0] NEYNAR_API_KEY environment variable is not set")
      return null
    }

    const normalizedUsername = normalizeUsername(username)
    console.log("[v0] Fetching Farcaster user by username:", username, "-> normalized:", normalizedUsername)

    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(normalizedUsername)}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": apiKey,
        },
        next: { revalidate: 60 },
      },
    )

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[v0] Neynar API error: ${response.status}, body: ${errorBody}`)
      return null
    }

    const data = await response.json()
    console.log("[v0] Farcaster user data received by username:", JSON.stringify(data.user, null, 2))
    return data.user as FarcasterUser
  } catch (error) {
    console.error("[v0] Error fetching Farcaster user by username:", error)
    return null
  }
}

// Get user by FID
export async function getFarcasterUserByFid(fid: number): Promise<FarcasterUser | null> {
  try {
    const apiKey = getApiKey()
    if (!apiKey) {
      console.error("[v0] NEYNAR_API_KEY environment variable is not set")
      return null
    }

    console.log("[v0] Fetching Farcaster user by FID:", fid)

    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[v0] Neynar API error: ${response.status}, body: ${errorBody}`)
      return null
    }

    const data = await response.json()
    const user = data.users?.[0]
    if (user) {
      console.log("[v0] Farcaster user data received by FID:", JSON.stringify(user, null, 2))
      return user as FarcasterUser
    }
    return null
  } catch (error) {
    console.error("[v0] Error fetching Farcaster user by FID:", error)
    return null
  }
}

// Get user's recent casts
export async function getFarcasterCasts(fid: number, limit = 10): Promise<FarcasterCast[]> {
  try {
    const apiKey = getApiKey()
    if (!apiKey) {
      console.error("[v0] NEYNAR_API_KEY environment variable is not set")
      return []
    }

    const response = await fetch(`https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${fid}&limit=${limit}`, {
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error(`[v0] Neynar API error: ${response.status}, body: ${errorBody}`)
      return []
    }

    const data = await response.json()
    return data.casts || []
  } catch (error) {
    console.error("[v0] Error fetching Farcaster casts:", error)
    return []
  }
}

// Get complete Farcaster data for a user
export async function getFarcasterData(username: string): Promise<FarcasterData> {
  const user = await getFarcasterUser(username)

  if (!user) {
    return {
      user: null,
      casts: [],
      totalLikes: 0,
      totalComments: 0,
      error: "User not found",
    }
  }

  const casts = await getFarcasterCasts(user.fid, 10)

  // Calculate total engagement
  const totalLikes = casts.reduce((sum, cast) => sum + (cast.reactions?.likes_count || 0), 0)
  const totalComments = casts.reduce((sum, cast) => sum + (cast.replies?.count || 0), 0)

  return {
    user,
    casts,
    totalLikes,
    totalComments,
  }
}

// Get complete Farcaster data for a user by FID
export async function getFarcasterDataByFid(fid: number): Promise<FarcasterData> {
  const user = await getFarcasterUserByFid(fid)

  if (!user) {
    return {
      user: null,
      casts: [],
      totalLikes: 0,
      totalComments: 0,
      error: "User not found",
    }
  }

  const casts = await getFarcasterCasts(user.fid, 10)

  const totalLikes = casts.reduce((sum, cast) => sum + (cast.reactions?.likes_count || 0), 0)
  const totalComments = casts.reduce((sum, cast) => sum + (cast.replies?.count || 0), 0)

  return {
    user,
    casts,
    totalLikes,
    totalComments,
  }
}
