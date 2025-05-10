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
  PortfolioData
} from '../types/solana';

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

      return {
        balance: lamports / 1_000_000_000,
        lamports,
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

      const tokens: TokenData[] = [];
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

      if (mintAddresses.length === 0) return [];

      try {
        const tokenMetadata = await fetchTokenMetadata(mintAddresses.slice(0, 100));

        for (const asset of tokenMetadata) {
          const assetId = asset?.id as string;
          if (asset && assetId && mintToAmountMap[assetId]) {
            const symbol = asset.content?.metadata?.symbol || 'Unknown';
            const name = asset.content?.metadata?.name || 'Unknown Token';
            const amount = mintToAmountMap[assetId].amount;
            const decimals = mintToAmountMap[assetId].decimals;
            const logo = asset.content?.links?.image || null;

            if (isLikelySpamToken(symbol, name, amount, decimals)) {
              continue;
            }

            tokens.push({
              mint: assetId,
              symbol,
              name,
              amount,
              decimals,
              usdValue: null,
              logo,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching token metadata:', error);
        for (const mint of mintAddresses) {
          tokens.push({
            mint,
            symbol: 'Unknown',
            name: 'Unknown Token',
            amount: mintToAmountMap[mint].amount,
            decimals: mintToAmountMap[mint].decimals,
            usdValue: null,
            logo: null,
          });
        }
      }

      return tokens;
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
  if (decimals > 12) return true;

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
  ];
  const lowerSymbol = symbol.toLowerCase();
  const lowerName = name.toLowerCase();

  if (suspiciousTerms.some(term => lowerSymbol.includes(term) || lowerName.includes(term))) {
    return true;
  }

  if (symbol.length > 12 || name.length > 30) return true;

  const hasRandomCharSequence = /[A-Z0-9]{10,}/.test(symbol);
  if (hasRandomCharSequence) return true;

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

      const solPrice = await fetchMockSolPrice();
      const solValue = solData.balance * solPrice;

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

async function fetchMockSolPrice(): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return 150;
}
