'use client';

import { usePortfolioValue, useSolBalance } from '@/hooks/useSolData';
import { TokenData } from '@/types/solana';
import { CreditCard, Coins, CircleDollarSign, FileX } from 'lucide-react';
import Image from 'next/image';

function renderSkeletonLoader() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-48 bg-gray-700/50 rounded-lg"></div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-card/50 rounded-lg border-0 shadow-sm h-20"></div>
        <div className="p-4 bg-card/50 rounded-lg border-0 shadow-sm h-20"></div>
      </div>

      <div className="h-6 w-full bg-gray-700/50 rounded mt-6"></div>
      <div className="h-6 w-full bg-gray-700/50 rounded mt-6"></div>

      <div className="space-y-4 mt-4">
        <div className="p-4 bg-card/50 rounded-lg border-0 shadow-sm h-16"></div>
        <div className="p-4 bg-card/50 rounded-lg border-0 shadow-sm h-16"></div>
      </div>
    </div>
  );
}

export function PortfolioValue({ walletAddress }: { walletAddress?: string }) {
  const { data, isLoading, error } = usePortfolioValue(walletAddress);
  const { data: solData, isLoading: solIsLoading, error: solError } = useSolBalance(walletAddress);

  if (isLoading && !data) {
    return renderSkeletonLoader();
  }
  if (error && !isLoading && !data) {
    return (
      <div className="p-8 bg-card rounded-xl border border-border/40 shadow-lg h-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-primary">Portfolio Value</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <FileX className="h-12 w-12 text-red-400/70 mb-4" />
          <div className="text-red-400 font-medium text-center">
            {error && typeof error === 'object' && 'message' in error
              ? (error as Error).message
              : 'Failed to load portfolio data'}
          </div>
          <p className="text-gray-500 mt-2 text-sm text-center max-w-md">
            This could be due to API rate limits or network issues. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-card rounded-xl border border-border/40 shadow-lg h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary">Portfolio Value</h2>
      </div>

      {walletAddress && data ? (
        <div>
          <div className="text-4xl font-bold mb-8">${data.totalValue.toFixed(2)}</div>

          <div className="mt-4 grid grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-br from-card/80 to-card/50 rounded-lg border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <CircleDollarSign className="h-5 w-5 mr-2 text-primary/70" />
                <p className="text-sm text-gray-400 font-medium">SOL Value</p>
              </div>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-primary">${data.solValue.toFixed(2)}</p>
                {solData && !solIsLoading && (
                  <p className="ml-2 text-sm text-gray-400">({solData.balance.toFixed(4)} SOL)</p>
                )}
              </div>
            </div>
            <div className="p-4 bg-gradient-to-br from-card/80 to-card/50 rounded-lg border border-primary/20 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 mr-2 text-primary/70" />
                <p className="text-sm text-gray-400 font-medium">Token Value</p>
              </div>
              <p className="text-xl font-semibold text-primary">${data.tokenValue.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-primary flex items-center">
                <Coins className="h-5 w-5 mr-2" />
                Token Holdings
              </h3>
              <p className="text-sm bg-primary/10 px-3 py-1 rounded-full text-primary font-medium">
                Top {Math.min(10, data.tokens.length)} of {data.tokens.length} tokens
              </p>
            </div>

            {data.tokens.length > 0 ? (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {data.tokens
                  .sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0))
                  .map((token: TokenData) => (
                  <div
                    key={token.mint}
                    className="flex justify-between items-center p-4 bg-gradient-to-br from-card/80 to-card/50 rounded-lg shadow-sm hover:shadow-md hover:bg-card/70 transition-all duration-300 hover:translate-x-1"
                  >
                    <div className="flex items-center">
                      {token.logo ? (
                        <img
                          src={token.logo}
                          alt={token.symbol}
                          className="w-10 h-10 rounded-full mr-4 shadow-md"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center mr-4 text-primary shadow-md">
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold flex items-center text-primary">
                          {token.name}
                          <span className="ml-2 text-xs px-2 py-0.5 bg-gray-700/30 rounded-full text-gray-400">
                            {token.symbol}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {token.amount.toLocaleString(undefined, {
                            maximumFractionDigits: token.decimals > 6 ? 6 : token.decimals,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        ${token.usdValue ? token.usdValue.toFixed(2) : '0.00'}
                      </div>
                      {token.usdValue && data.solValue > 0 && (
                        <div className="text-xs text-gray-400 mt-1 bg-card/50 px-2 py-1 rounded-full inline-block">
                          ~{((token.usdValue / data.solValue) * data.solBalance).toFixed(4)} SOL
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-card/30 rounded-lg border border-primary/20 shadow-inner">
                <FileX className="h-12 w-12 mx-auto text-gray-500/50 mb-3" />
                <p className="text-gray-400 font-medium">No tokens found</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        renderSkeletonLoader()
      )}
    </div>
  );
}
