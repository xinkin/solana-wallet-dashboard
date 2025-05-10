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
        <div className="text-red-500">
          {error instanceof Error ? `Error: ${error.message}` : 'Failed to load portfolio data'}
        </div>
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

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Token Holdings</h3>
              <p className="text-xs text-gray-400">{data.tokens.length} tokens</p>
            </div>

            {data.tokens.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {data.tokens.map((token: TokenData) => (
                  <div
                    key={token.mint}
                    className="flex justify-between items-center p-3 bg-card/50 rounded-lg hover:bg-card/70 transition-colors"
                  >
                    <div className="flex items-center">
                      {token.logo ? (
                        <img
                          src={token.logo}
                          alt={token.symbol}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary">
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium flex items-center">
                          {token.name}
                          <span className="ml-2 text-xs text-gray-400">{token.symbol}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {token.amount.toLocaleString(undefined, {
                            maximumFractionDigits: token.decimals > 6 ? 6 : token.decimals,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${token.usdValue ? token.usdValue.toFixed(2) : '0.00'}
                      </div>
                      {token.usdValue && data.solValue > 0 && (
                        <div className="text-xs text-gray-400">
                          ~{((token.usdValue / data.solValue) * data.solBalance).toFixed(4)} SOL
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-card/30 rounded-lg">
                <p className="text-gray-400">No tokens found</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">Connect your wallet or enter an address to view portfolio</p>
        </div>
      )}
    </div>
  );
}
