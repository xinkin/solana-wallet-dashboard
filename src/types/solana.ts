// API Constants
// Helius API (Solana RPC)
export const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
export const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
export const HELIUS_API_URL = 'https://api.helius.xyz/v0';

// CoinGecko API
export const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY!;
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
export const COINGECKO_SOLANA_ID = 'solana';
export const COINGECKO_PLATFORM = 'solana';

// Cache settings
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache durations
export const STALE_TIMES = {
  BALANCE: 30 * 1000,
  TOKENS: 60 * 1000,
  TRANSACTIONS: 60 * 1000,
  PORTFOLIO: 60 * 1000,
};

// Interfaces
export interface SolBalance {
  balance: number;
  lamports: number;
  usdPrice: number;
  usdValue: number;
}

export interface TokenData {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  usdValue: number | null;
  logo: string | null;
}

export interface TokenAmountInfo {
  amount: number;
  decimals: number;
}

export interface TransactionHeatmapData {
  date: string;
  count: number;
}

export interface PortfolioData {
  totalValue: number;
  solValue: number;
  tokenValue: number;
  solBalance: number;
  tokens: TokenData[];
}
