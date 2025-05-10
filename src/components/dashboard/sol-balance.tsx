'use client';
import { useSolBalance } from '@/hooks/useSolData';

export function SolBalance({ walletAddress }: { walletAddress?: string }) {
  const { data, isLoading, error } = useSolBalance(walletAddress);

  if (isLoading) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-medium text-primary mb-6">SOL Balance</h2>
        <div className="animate-pulse h-8 w-40 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-medium text-primary mb-6">SOL Balance</h2>
        <div className="text-red-500">
          {error instanceof Error 
            ? `Error: ${error.message}` 
            : 'Failed to load SOL balance'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <h2 className="text-xl font-medium text-primary mb-6">SOL Balance</h2>
      <div className="flex flex-col space-y-4">
        <div>
          <div className="text-3xl font-bold">{data.balance.toFixed(4)} SOL</div>
          <div className="text-gray-400">${data.usdValue.toFixed(2)} USD</div>
        </div>
        <div className="text-sm text-gray-400">
          <div>Current SOL Price: ${data.usdPrice.toFixed(2)} USD</div>
        </div>
      </div>
    </div>
  );
}
