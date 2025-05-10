'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (walletAddress.trim()) {
      router.push(`/dashboard?address=${walletAddress}`);
      setShowSearch(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-md'
            : 'bg-background/80 backdrop-blur-sm'
        } border-b border-border`}
      >
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary cursor-pointer">
              Solanalytics
            </span>
            {isAuthenticated && (
              <button
                onClick={() => router.push('/dashboard')}
                className="hidden sm:flex items-center justify-center text-sm text-gray-400 px-4 py-2 rounded-full transition-all hover:bg-card/50 hover:text-primary cursor-pointer"
              >
                My Dashboard
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            {isDashboard && isAuthenticated && (
              <div className="relative">
                {showSearch ? (
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={e => setWalletAddress(e.target.value)}
                      placeholder="Enter wallet address"
                      className="bg-card border border-border rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-[200px] md:w-[300px]"
                    />
                    <button
                      type="submit"
                      className="ml-2 bg-primary text-white rounded-full p-2 text-sm hover:bg-primary/90 transition-colors"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSearch(false)}
                      className="ml-2 bg-card text-gray-400 rounded-full p-2 text-sm hover:bg-card/90 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="hidden sm:flex items-center justify-center text-sm font-medium px-4 py-2 rounded-full transition-all hover:bg-card hover:text-primary border border-border cursor-pointer"
                  >
                    Search Wallet
                  </button>
                )}
              </div>
            )}

            <div className={windowWidth < 640 ? 'scale-90 origin-right' : ''}>
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </header>
      <div className="h-16 md:h-20"></div>
    </>
  );
}
