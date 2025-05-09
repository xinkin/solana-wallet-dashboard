'use client';

import { useState } from 'react';

interface SolBalanceProps {
  walletAddress?: string;
}

export function SolBalance({ walletAddress }: SolBalanceProps) {
  // Sample data - would be replaced with actual balance from an API
  const [balance] = useState(Math.random() * 10 + 2);
  const [usdValue] = useState(balance * 150); // Assuming 1 SOL = $150
  
  return (
    <div className="p-6 bg-card rounded-lg border border-border h-full">
      <h2 className="text-xl font-medium text-primary mb-4">SOL Balance</h2>
      
      {walletAddress ? (
        <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
          <div className="text-4xl font-bold">{balance.toFixed(2)}</div>
          <div className="text-sm text-gray-400 mt-2">SOL</div>
          <div className="text-lg text-gray-300 mt-4">${usdValue.toFixed(2)}</div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[calc(100%-2rem)]">
          <p className="text-gray-400">Connect your wallet to see your SOL balance</p>
        </div>
      )}
    </div>
  );
}
