'use client';

// import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Navbar() {
  // const { connected } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

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
          <div className="flex items-center">
            <span className="text-lg sm:text-xl md:text-2xl font-bold ml-2">Solanalytics</span>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* {connected && (
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-full transition-all hover:bg-card hover:text-primary"
              >
                Dashboard
              </Link>
            )} */}
            <div className={windowWidth < 640 ? 'scale-90 origin-right' : ''}>
              <WalletMultiButton className="rounded-full" />
            </div>
          </div>
        </div>
      </header>
      <div className="h-16 md:h-20"></div>
    </>
  );
}
