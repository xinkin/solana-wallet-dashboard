import { useQuery } from '@tanstack/react-query';
import {
  HELIUS_API_KEY,
  HELIUS_RPC_URL,
  HELIUS_API_URL,
  STALE_TIMES,
  SolBalance,
  TokenData,
  TokenAmountInfo,
  TransactionHeatmapData,
  PortfolioData,
} from '../types/solana';
import { fetchSolPrice, fetchTokenPrices } from '../utils/price';

export function useSolBalance(address: string | undefined) {
  return useQuery<SolBalance>({
    queryKey: ['solBalance', address],
    queryFn: async () => {
      if (!address) throw new Error('Address required');

      const response = await fetch(HELIUS_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: '1',
          method: 'getBalance',
          params: [address],
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch SOL balance');
      const data = await response.json();

      if (data.error) {
        throw new Error(`API Error: ${data.error.message}`);
      }

      const lamports = data.result.value;
      const balance = lamports / 1_000_000_000;

      const usdPrice = await fetchSolPrice();

      return {
        balance,
        lamports,
        usdPrice,
        usdValue: balance * usdPrice,
      };
    },
    enabled: !!address,
    staleTime: STALE_TIMES.BALANCE,
  });
}

export function useTokenHoldings(address: string | undefined) {
  return useQuery<TokenData[]>({
    queryKey: ['tokenHoldings', address],
    queryFn: async () => {
      if (!address) throw new Error('Address required');

      const tokenAccounts = await fetchTokenAccounts(address);

      const mintAddresses: string[] = [];
      const mintToAmountMap: Record<string, TokenAmountInfo> = {};

      for (const account of tokenAccounts) {
        const parsedData = account.account.data.parsed.info;
        const tokenAmount = parsedData.tokenAmount;

        if (tokenAmount.uiAmount === 0) continue;

        const mint = parsedData.mint;
        mintAddresses.push(mint);
        mintToAmountMap[mint] = {
          amount: tokenAmount.uiAmount,
          decimals: tokenAmount.decimals,
        };
      }

      try {
        if (mintAddresses.length === 0) return [];

        const tokenMetadata = await fetchTokenMetadata(mintAddresses);
        const validTokens: TokenData[] = [];

        for (const metadata of tokenMetadata) {
          const assetId = metadata.id;
          if (!mintToAmountMap[assetId]) continue;

          const { amount, decimals } = mintToAmountMap[assetId];

          const symbol = metadata.content?.metadata?.symbol || 'Unknown';
          const name = metadata.content?.metadata?.name || 'Unknown Token';
          const logo = metadata.content?.links?.image || null;

          if (isLikelySpamToken(symbol, name, amount, decimals)) {
            continue;
          }

          validTokens.push({
            mint: assetId,
            symbol,
            name,
            amount,
            decimals,
            usdValue: null,
            logo,
          });
        }

        if (validTokens.length > 0) {
          try {
            const tokenAddresses = validTokens.map(token => token.mint);
            const prices = await fetchTokenPrices(tokenAddresses);

            // Filter out tokens with no price data (likely spam or very obscure tokens)
            const tokensWithPrices = validTokens.filter(token => {
              const price = prices[token.mint];
              if (price) {
                token.usdValue = token.amount * price;
                return true;
              }
              return false;
            });

            return tokensWithPrices;
          } catch (priceError) {
            console.error('Error fetching token prices:', priceError);
            // If price fetching fails, return tokens without price data
            // but don't filter them out
            validTokens.forEach(token => {
              token.usdValue = 0;
            });
          }
        }
        return validTokens;
      } catch (error) {
        console.error('Error fetching token metadata:', error);
        return [];
      }
    },
    enabled: !!address,
    staleTime: STALE_TIMES.TOKENS,
  });
}

async function fetchTokenAccounts(address: string) {
  const response = await fetch(HELIUS_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '1',
      method: 'getTokenAccountsByOwner',
      params: [
        address,
        {
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          encoding: 'jsonParsed',
        },
      ],
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch token holdings');
  const data = await response.json();

  if (data.error) {
    throw new Error(`API Error: ${data.error.message}`);
  }

  return data.result.value;
}

function isLikelySpamToken(
  symbol: string,
  name: string,
  amount: number,
  decimals: number
): boolean {
  // Tokens with extremely high decimals are likely spam
  if (decimals > 12) return true;

  // Tokens with extremely large amounts are likely spam
  if (amount > 1_000_000_000) return true;

  const suspiciousTerms = [
    'airdrop',
    'free',
    'claim',
    'reward',
    'gift',
    'bonus',
    'scam',
    'fake',
    'test',
    'memo',
    'promo',
    'bot',
    'hack',
    'giveaway',
  ];
  const lowerSymbol = symbol.toLowerCase();
  const lowerName = name.toLowerCase();

  // Check for suspicious terms in name or symbol
  if (suspiciousTerms.some(term => lowerSymbol.includes(term) || lowerName.includes(term))) {
    return true;
  }

  // Excessively long names or symbols are suspicious
  if (symbol.length > 12 || name.length > 30) return true;

  // Tokens with random-looking character sequences are likely spam
  const hasRandomCharSequence = /[A-Z0-9]{10,}/.test(symbol);
  if (hasRandomCharSequence) return true;

  // Check for excessive number of digits in token amount
  // which often indicates dust attacks or spam tokens
  const amountStr = amount.toString();
  if (amountStr.length > 15 && amountStr.includes('e+')) return true;

  return false;
}

async function fetchTokenMetadata(mintAddresses: string[]) {
  const response = await fetch(HELIUS_RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: '1',
      method: 'getAssetBatch',
      params: {
        ids: mintAddresses,
        options: { showFungible: true },
      },
    }),
  });

  if (!response.ok) throw new Error('Failed to fetch token metadata');
  const data = await response.json();

  if (data.error) {
    console.error('Error fetching token metadata:', data.error);
    return [];
  }

  return data.result;
}

export function useTransactionHistory(address: string | undefined) {
  return useQuery<TransactionHeatmapData[]>({
    queryKey: ['transactionHistory', address],
    queryFn: async () => {
      if (!address) throw new Error('Address required');

      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      const oneYearAgoTimestamp = Math.floor(oneYearAgo.getTime() / 1000);

      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };

      const response = await fetch(
        `${HELIUS_API_URL}/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}`,
        options
      );

      if (!response.ok) throw new Error('Failed to fetch transaction history');
      const data = await response.json();

      const dailyCounts: Record<string, number> = {};

      data.forEach((tx: any) => {
        if (tx.transactionError !== null) return;

        if (tx.timestamp < oneYearAgoTimestamp) return;

        const date = new Date(tx.timestamp * 1000).toISOString().split('T')[0];

        if (!dailyCounts[date]) {
          dailyCounts[date] = 0;
        }

        dailyCounts[date]++;
      });

      return Object.entries(dailyCounts).map(([date, count]) => ({
        date,
        count,
      }));
    },
    enabled: !!address,
    staleTime: STALE_TIMES.TRANSACTIONS,
  });
}

export function usePortfolioValue(address: string | undefined) {
  const solBalanceQuery = useSolBalance(address);
  const tokenHoldingsQuery = useTokenHoldings(address);

  return useQuery<PortfolioData>({
    queryKey: ['portfolioValue', address],
    queryFn: async () => {
      const [solData, tokenData] = await Promise.all([
        solBalanceQuery.data
          ? Promise.resolve(solBalanceQuery.data)
          : solBalanceQuery.refetch().then(res => res.data),
        tokenHoldingsQuery.data
          ? Promise.resolve(tokenHoldingsQuery.data)
          : tokenHoldingsQuery.refetch().then(res => res.data),
      ]);

      if (!solData || !tokenData) throw new Error('Failed to fetch portfolio data');

      // Use the USD value directly from the SOL balance data
      const solValue = solData.usdValue;

      // Sum up token USD values
      const tokenValue = tokenData.reduce((sum, token) => {
        return sum + (token.usdValue || 0);
      }, 0);

      const totalValue = solValue + tokenValue;

      return {
        totalValue,
        solValue,
        tokenValue,
        solBalance: solData.balance,
        tokens: tokenData,
      };
    },
    enabled: solBalanceQuery.isSuccess && tokenHoldingsQuery.isSuccess,
    staleTime: STALE_TIMES.PORTFOLIO,
  });
}
