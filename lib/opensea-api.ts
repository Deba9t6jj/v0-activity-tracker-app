// OpenSea API for NFT data
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || ""

export interface NFT {
  identifier: string
  collection: string
  contract: string
  name: string
  description: string
  image_url: string
  metadata_url: string
  opensea_url: string
}

export interface NFTCollection {
  collection: string
  name: string
  description: string
  image_url: string
  banner_image_url: string
  owner: string
  category: string
  is_disabled: boolean
  is_nsfw: boolean
  trait_offers_enabled: boolean
  collection_offers_enabled: boolean
  opensea_url: string
  contracts: { address: string; chain: string }[]
}

export interface WalletNFTData {
  nfts: NFT[]
  error?: string
}

// Get NFTs by wallet address on Base chain
export async function getNFTsByWallet(address: string, chain = "base", limit = 10): Promise<WalletNFTData> {
  try {
    const headers: Record<string, string> = {
      accept: "application/json",
    }

    // Add API key if available
    if (OPENSEA_API_KEY) {
      headers["X-API-KEY"] = OPENSEA_API_KEY
    }

    const response = await fetch(
      `https://api.opensea.io/api/v2/chain/${chain}/account/${address}/nfts?limit=${limit}`,
      {
        headers,
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[v0] OpenSea API error: ${response.status}, body: ${errorText}`)

      // Return empty array if rate limited or no API key
      return { nfts: [], error: response.status === 429 ? "Rate limited" : "API error" }
    }

    const data = await response.json()
    return { nfts: data.nfts || [] }
  } catch (error) {
    console.error("[v0] Error fetching NFTs:", error)
    return { nfts: [], error: "Failed to fetch NFTs" }
  }
}

// Get specific collection NFTs (e.g., CryptoPunks)
export async function getNFTsByCollection(collection: string, limit = 10): Promise<NFT[]> {
  try {
    const headers: Record<string, string> = {
      accept: "application/json",
    }

    if (OPENSEA_API_KEY) {
      headers["X-API-KEY"] = OPENSEA_API_KEY
    }

    const response = await fetch(`https://api.opensea.io/api/v2/collection/${collection}/nfts?limit=${limit}`, {
      headers,
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.nfts || []
  } catch (error) {
    console.error("[v0] Error fetching collection NFTs:", error)
    return []
  }
}
