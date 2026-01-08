const CDP_API_KEY_ID = process.env.CDP_API_KEY_ID || ""
const CDP_API_KEY_SECRET = process.env.CDP_API_KEY_SECRET || ""

export async function generateCDPJwt(requestMethod: string, requestPath: string): Promise<string> {
  const requestHost = "api.cdp.coinbase.com"
  const uri = `${requestMethod} ${requestHost}${requestPath}`

  const now = Math.floor(Date.now() / 1000)
  const nonce = crypto.randomUUID().replace(/-/g, "")

  // For ES256 keys (ECDSA)
  const payload = {
    sub: CDP_API_KEY_ID,
    iss: "cdp",
    aud: ["cdp_service"],
    nbf: now,
    exp: now + 120,
    uri: uri,
  }

  // If using Ed25519 key format from CDP
  try {
    const decoded = Buffer.from(CDP_API_KEY_SECRET, "base64")

    if (decoded.length === 64) {
      // Ed25519 key - use crypto for signing
      const seed = decoded.subarray(0, 32)

      const header = {
        alg: "EdDSA",
        typ: "JWT",
        kid: CDP_API_KEY_ID,
        nonce: nonce,
      }

      const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url")
      const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
      const message = `${encodedHeader}.${encodedPayload}`

      // Use Web Crypto API for Ed25519 signing
      const keyData = new Uint8Array([
        ...seed,
        ...decoded.subarray(32), // public key portion
      ])

      const cryptoKey = await crypto.subtle.importKey("raw", seed, { name: "Ed25519" }, false, ["sign"])

      const signature = await crypto.subtle.sign("Ed25519", cryptoKey, new TextEncoder().encode(message))
      const encodedSignature = Buffer.from(signature).toString("base64url")

      return `${message}.${encodedSignature}`
    }
  } catch {
    // Fall back to simple API key approach
  }

  // Fallback: return empty string to trigger API key fallback
  return ""
}

export function getCDPClientApiUrl(): string {
  // Use the Client API Key approach for JSON-RPC (simpler auth)
  return `https://api.developer.coinbase.com/rpc/v1/base/${CDP_API_KEY_ID}`
}
