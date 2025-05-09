'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';

export default function DashboardPage() {
  const { connected } = useWallet();
  const router = useRouter();

  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!connected) {
      router.push('/');
    }
  }, [connected, router]);

  if (!connected) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold mb-8">Wallet Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-3 p-6 bg-card rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Transaction Activity</h2>
              <div className="h-64 flex items-center justify-center bg-accent/20 rounded-md">
                <p className="text-gray-400">Transaction activity visualization will appear here</p>
              </div>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">SOL Balance</h2>
              <div className="h-40 flex items-center justify-center bg-accent/20 rounded-md">
                <p className="text-gray-400">SOL balance will appear here</p>
              </div>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Portfolio Value</h2>
              <div className="h-40 flex items-center justify-center bg-accent/20 rounded-md">
                <p className="text-gray-400">Portfolio value will appear here</p>
              </div>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border">
              <h2 className="text-xl font-semibold mb-4">Wallet Search</h2>
              <div className="h-40 flex items-center justify-center bg-accent/20 rounded-md">
                <p className="text-gray-400">Wallet search will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
