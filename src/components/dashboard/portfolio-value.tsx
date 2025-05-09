'use client';

import { useState } from 'react';

interface PortfolioValueProps {
  walletAddress?: string;
}

interface TokenData {
  name: string;
  symbol: string;
  amount: number;
  value: number;
}

export function PortfolioValue({ walletAddress }: PortfolioValueProps) {
  // Sample data - would be replaced with actual token data from an API
  const [tokens] = useState<TokenData[]>(() => [
    { name: 'Solana', symbol: 'SOL', amount: Math.random() * 10 + 2, value: Math.random() * 1500 + 300 },
    { name: 'Bonk', symbol: 'BONK', amount: Math.random() * 1000000, value: Math.random() * 100 + 50 },
    { name: 'Raydium', symbol: 'RAY', amount: Math.random() * 100 + 10, value: Math.random() * 200 + 100 },
  ]);
  
  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
  
  return (
    <div className="p-6 bg-card rounded-lg border border-border h-full">
      <h2 className="text-xl font-medium text-primary mb-4">Portfolio Value</h2>
      
      {walletAddress ? (
        <div className="flex flex-col h-[calc(100%-2rem)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Total Value</span>
            <span className="text-2xl font-bold">${totalValue.toFixed(2)}</span>
          </div>
          
          <div className="space-y-3 overflow-auto flex-1">
            {tokens.map((token) => (
              <div key={token.symbol} className="flex justify-between items-center p-2 rounded-md bg-accent/10">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    {token.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-xs text-gray-400">{token.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div>${token.value.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">{((token.value / totalValue) * 100).toFixed(1)}%</div>
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
