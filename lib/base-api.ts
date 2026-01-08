// Base blockchain API using Coinbase Developer Platform (CDP)
const CDP_API_KEY = process.env.CDP_API_KEY_ID || ""
const CDP_RPC_URL = `https://api.developer.coinbase.com/rpc/v1/base/${CDP_API_KEY}`

export interface WalletBalance {
  balance: string
  balanceEth: string
  balanceUsd: string
}

export interface TokenBalance {
  symbol: string
  name: string
  balance: string
  decimals: number
  contractAddress: string
  balanceUsd?: string
}

export interface WalletTransaction {
  hash: string
  from: string
  to: string
  value: string
  valueEth: string
  timeStamp: string
  isReceive: boolean
  status: string
  blockNumber: string
  gasUsed?: string
}

export interface WalletData {
  balance: WalletBalance
  tokens: TokenBalance[]
  transactions: WalletTransaction[]
  totalTransactions: number
  error?: string
}

// Get ETH price in USD via CoinGecko
export async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd", {
      next: { revalidate: 300 },
    })
    if (!response.ok) return 0
    const data = await response.json()
    return data.ethereum?.usd || 0
  } catch {
    return 0
  }
}

// Get wallet ETH balance using CDP JSON-RPC
export async function getWalletBalance(address: string): Promise<WalletBalance> {
  try {
    const response = await fetch(CDP_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
      next: { revalidate: 30 },
    })

    if (!response.ok) {
      return { balance: "0", balanceEth: "0 ETH", balanceUsd: "$0.00" }
    }

    const data = await response.json()
    const balanceWei = data.result || "0x0"
    const balanceEthNum = Number.parseInt(balanceWei, 16) / 1e18
    const balanceEth = balanceEthNum.toFixed(4)

    const ethPrice = await getEthPrice()
    const balanceUsd = (balanceEthNum * ethPrice).toFixed(2)

    return {
      balance: balanceWei,
      balanceEth: `${balanceEth} ETH`,
      balanceUsd: `$${balanceUsd}`,
    }
  } catch (error) {
    console.error("Error fetching wallet balance:", error)
    return { balance: "0", balanceEth: "0 ETH", balanceUsd: "$0.00" }
  }
}

// Get token balances using CDP Token Balances API (JSON-RPC)
export async function getTokenBalances(address: string): Promise<TokenBalance[]> {
  try {
    const response = await fetch(CDP_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "cdp_listBalances",
        params: [{ address: address.toLowerCase(), pageSize: 20 }],
      }),
      next: { revalidate: 60 },
    })

    if (!response.ok) return []

    const data = await response.json()
    const balances = data.result?.balances || []

    return balances.map((token: Record<string, unknown>) => ({
      symbol: token.asset?.symbol || "Unknown",
      name: token.asset?.name || "Unknown Token",
      balance: token.amount || "0",
      decimals: token.asset?.decimals || 18,
      contractAddress: token.asset?.contractAddress || "",
      balanceUsd: token.amountUsd ? `$${Number(token.amountUsd).toFixed(2)}` : undefined,
    }))
  } catch (error) {
    console.error("Error fetching token balances:", error)
    return []
  }
}

// Get transaction history using CDP Wallet History API (JSON-RPC)
export async function getWalletTransactions(address: string, limit = 10): Promise<WalletTransaction[]> {
  try {
    const response = await fetch(CDP_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "cdp_listAddressTransactions",
        params: [{ address: address.toLowerCase(), pageSize: limit }],
      }),
      next: { revalidate: 30 },
    })

    if (!response.ok) return []

    const data = await response.json()
    const transactions = data.result?.transactions || []

    return transactions.map((tx: Record<string, unknown>) => {
      const content = (tx.content as Record<string, unknown>) || {}
      const value = String(content.value || "0")
      const valueNum = Number.parseInt(value, 16) / 1e18

      return {
        hash: tx.transaction_hash || "",
        from: String(content.from || ""),
        to: String(content.to || ""),
        value: value,
        valueEth: valueNum.toFixed(4),
        timeStamp: content.block_timestamp
          ? new Date(content.block_timestamp as string).getTime().toString()
          : Date.now().toString(),
        isReceive: String(content.to || "").toLowerCase() === address.toLowerCase(),
        status: String(tx.status || "confirmed"),
        blockNumber: String(content.block_number || "0"),
        gasUsed: String(content.gas_used || "0"),
      }
    })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

// Get historical balance data for charts
export async function getBalanceHistory(address: string): Promise<{ date: string; balance: number }[]> {
  try {
    const response = await fetch(CDP_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "cdp_listBalanceHistories",
        params: [
          {
            address: address.toLowerCase(),
            asset: "eth",
            pageSize: 30,
          },
        ],
      }),
      next: { revalidate: 300 },
    })

    if (!response.ok) return []

    const data = await response.json()
    const histories = data.result?.balanceHistories || []

    return histories
      .map((item: Record<string, unknown>) => ({
        date: new Date(item.blockTimestamp as string).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        balance: Number(item.amount || 0) / 1e18,
      }))
      .reverse()
  } catch (error) {
    console.error("Error fetching balance history:", error)
    return []
  }
}

// Get complete wallet data
export async function getWalletData(address: string): Promise<WalletData> {
  if (!address || !address.startsWith("0x")) {
    return {
      balance: { balance: "0", balanceEth: "0 ETH", balanceUsd: "$0.00" },
      tokens: [],
      transactions: [],
      totalTransactions: 0,
      error: "Invalid address",
    }
  }

  const [balance, tokens, transactions] = await Promise.all([
    getWalletBalance(address),
    getTokenBalances(address),
    getWalletTransactions(address, 10),
  ])

  return {
    balance,
    tokens,
    transactions,
    totalTransactions: transactions.length,
  }
}
