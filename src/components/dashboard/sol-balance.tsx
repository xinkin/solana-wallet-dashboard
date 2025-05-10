'use client';
import { useSolBalance } from '@/hooks/useSolData';

export function SolBalance({ walletAddress }: { walletAddress?: string }) {
  const { data, isLoading, error } = useSolBalance(walletAddress);

  if (isLoading) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-medium text-primary mb-6">SOL Balance</h2>
        <div className="animate-pulse h-8 w-32 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-medium text-primary mb-6">SOL Balance</h2>
        <div className="text-red-500">Failed to load balance</div>
      </div>
    );
  }

  const solBalance = data.balance || data.lamports / 1_000_000_000;

  const solPrice = 150;
  const usdValue = solBalance * solPrice;

  return (
    <div className="p-6 bg-card rounded-lg border border-border">
      <h2 className="text-xl font-medium text-primary mb-6">SOL Balance</h2>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <span className="text-3xl font-bold">{solBalance.toFixed(4)}</span>
          <span className="ml-2 text-lg text-gray-400">SOL</span>
        </div>
        <div className="text-lg text-gray-400">
          ${usdValue.toFixed(2)} USD
          <span className="text-sm ml-2">@ ${solPrice} per SOL</span>
        </div>
      </div>
    </div>
  );
}
