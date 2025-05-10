'use client';

import { usePortfolioValue } from '@/hooks/useSolData';
import { TokenData } from '@/types/solana';

export function PortfolioValue({ walletAddress }: { walletAddress?: string }) {
  const { data, isLoading, error } = usePortfolioValue(walletAddress);

  if (isLoading) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-medium text-primary mb-6">Portfolio Value</h2>
        <div className="animate-pulse h-8 w-40 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-medium text-primary mb-6">Portfolio Value</h2>
        <div className="text-red-500">Failed to load portfolio data</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border h-full">
      <h2 className="text-xl font-medium text-primary mb-4">Portfolio Value</h2>

      {walletAddress ? (
        <div>
          <div className="text-3xl font-bold mb-6">${data.totalValue.toFixed(2)}</div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-card/50 rounded-lg">
              <p className="text-sm text-gray-400">SOL Value</p>
              <p className="text-lg font-medium">${data.solValue.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-card/50 rounded-lg">
              <p className="text-sm text-gray-400">Token Value</p>
              <p className="text-lg font-medium">${data.tokenValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Token Holdings</h3>
            {data.tokens.map((token: TokenData) => (
              <div
                key={token.mint}
                className="flex justify-between items-center p-3 bg-card/50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{token.name}</div>
                  <div className="text-sm text-gray-400">
                    {token.amount.toFixed(token.decimals)} {token.symbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    ${token.usdValue ? token.usdValue.toFixed(2) : '0.00'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[calc(100%-2rem)]">
          <p className="text-gray-400">Connect your wallet to see your portfolio value</p>
        </div>
      )}
    </div>
  );
}
