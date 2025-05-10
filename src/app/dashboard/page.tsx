'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { TransactionActivity } from '@/components/dashboard/transaction-activity';
import { SolBalance } from '@/components/dashboard/sol-balance';
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
    <div className="container mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold mb-8 text-primary">
          {searchParams.get('address') && searchParams.get('address') !== publicKey?.toString()
            ? 'Wallet Analytics'
            : 'My Dashboard'}
        </h1>

        {walletAddress &&
          searchParams.get('address') &&
          searchParams.get('address') !== publicKey?.toString() && (
            <div className="mb-8 text-sm text-gray-400">
              Viewing data for: <span className="font-mono">{walletAddress}</span>
            </div>
          )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-3">
            <TransactionActivity walletAddress={walletAddress} />
          </div>

          <div className="h-full">
            <SolBalance walletAddress={walletAddress} />
          </div>

          <div className="col-span-2 h-full">
            <PortfolioValue walletAddress={walletAddress} />
          </div>
        </div>
      </div>
    </div>
  );
}
