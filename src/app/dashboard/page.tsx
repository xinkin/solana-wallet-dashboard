'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { TransactionActivity } from '@/components/dashboard/transaction-activity';
import { PortfolioValue } from '@/components/dashboard/portfolio-value';

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [walletAddress, setWalletAddress] = useState<string | undefined>();

  useEffect(() => {
    const addressParam = searchParams.get('address');
    if (addressParam) {
      setWalletAddress(addressParam);
    } else if (publicKey) {
      setWalletAddress(publicKey.toString());
    }
  }, [publicKey, searchParams]);

  useEffect(() => {
    if (publicKey && !searchParams.get('address') && pathname === '/dashboard') {
      setWalletAddress(publicKey.toString());
    }
  }, [publicKey, searchParams, pathname]);

  useEffect(() => {
    if (!isAuthenticated && !searchParams.get('address')) {
      router.push('/');
    }
  }, [isAuthenticated, router, searchParams]);

  if (!isAuthenticated && !searchParams.get('address')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 pb-10">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 text-primary">
            {searchParams.get('address') && searchParams.get('address') !== publicKey?.toString()
              ? 'Wallet Analytics'
              : 'My Dashboard'}
          </h1>

          {walletAddress &&
            searchParams.get('address') &&
            searchParams.get('address') !== publicKey?.toString() && (
              <div className="mb-4 text-sm text-gray-400 flex items-center">
                <span className="mr-2">Viewing data for:</span>
                <span className="font-mono bg-card/50 px-3 py-1 rounded-full text-xs">
                  {walletAddress}
                </span>
              </div>
            )}
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
            <TransactionActivity walletAddress={walletAddress} />
          </div>

          <div className="transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl">
            <PortfolioValue walletAddress={walletAddress} />
          </div>
        </div>
      </div>
    </div>
  );
}
