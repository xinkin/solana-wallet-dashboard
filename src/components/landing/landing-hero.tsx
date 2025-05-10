'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function LandingHero() {
  const { connected } = useWallet();
  const { isAuthenticated, signMessage, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-6 py-16 md:py-24">
      <div className="space-y-8 md:space-y-12">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          <span className="text-foreground">Wallet Analytics</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Connect your Solana wallet to access a comprehensive analytics dashboard. View transaction
          history, portfolio balance, and token holdings.
        </p>

        <div className="flex flex-col items-center space-y-4 py-6">
          {!connected ? (
            <div>
              <WalletMultiButton className="px-8 py-3 text-lg rounded-full" />
            </div>
          ) : !isAuthenticated ? (
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={signMessage}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full cursor-pointer"
              >
                Sign Message to Authenticate
              </button>
              <p className="text-sm text-gray-400">
                Please sign a message to verify wallet ownership
              </p>
              {authError && <p className="text-red-500 text-sm">{authError}</p>}
            </div>
          ) : (
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-full transition-colors"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>

      <div className="w-full mt-20 md:mt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <FeatureCard
            title="Transaction Activity"
            description="View your transaction history with a GitHub-style activity grid."
          />
          <FeatureCard
            title="Portfolio View"
            description="Track your SOL balance and all SPL tokens with USD values."
          />
          <FeatureCard
            title="Wallet Search"
            description="Search for any Solana address and view detailed analytics."
          />
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-border p-8 bg-card hover:translate-y-[-8px] transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
