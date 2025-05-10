'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  signMessage: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signMessage: async () => {},
  authError: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { connected, publicKey, signMessage: walletSignMessage } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Store the last authenticated public key
  const [lastAuthenticatedKey, setLastAuthenticatedKey] = useState<string | null>(null);

  // Check for saved authentication on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('solanalytics-auth');
      const savedKey = localStorage.getItem('solanalytics-pubkey');
      
      console.log('Initial auth check:', { savedAuth, savedKey, connected, currentKey: publicKey?.toString() });
      
      if (savedAuth === 'true') {
        if (connected && publicKey) {
          // Wallet is already connected and matches saved state
          setIsAuthenticated(true);
          setLastAuthenticatedKey(publicKey.toString());
          console.log('Authentication restored - wallet already connected');
        } else if (savedKey) {
          // Save the last authenticated key for comparison when wallet connects
          setLastAuthenticatedKey(savedKey);
          console.log('Saved authenticated key for later verification');
        }
      }
    }
  }, []);
  
  // Handle wallet connection changes
  useEffect(() => {
    if (connected && publicKey && lastAuthenticatedKey) {
      // If wallet connects and matches the last authenticated key, restore auth
      if (publicKey.toString() === lastAuthenticatedKey) {
        setIsAuthenticated(true);
        console.log('Authentication restored - wallet reconnected');
      }
    }
  }, [connected, publicKey, lastAuthenticatedKey]);

  useEffect(() => {
    if (!connected) {
      setIsAuthenticated(false);
      localStorage.removeItem('solanalytics-auth');
    }
  }, [connected]);

  useEffect(() => {
    const protectedRoutes = ['/dashboard'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated && !pathname.includes('?address=')) {
      router.push('/');
    }
  }, [isAuthenticated, pathname, router]);

  const signMessage = async () => {
    if (!connected || !publicKey || !walletSignMessage) {
      setAuthError('Wallet not connected');
      return;
    }

    try {
      setAuthError(null);

      const message = 'Sign this message to authenticate with Solanalytics';
      const encodedMessage = new TextEncoder().encode(message);

      const signature = await walletSignMessage(encodedMessage);

      if (signature) {
        const response = await fetch('/api/verify-signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message,
            signature: Array.from(signature),
            publicKey: publicKey.toString(),
          }),
        });

        const result = await response.json();

        if (result.success) {
          // Store authentication state in localStorage
          try {
            localStorage.setItem('solanalytics-auth', 'true');
            console.log('Authentication saved to localStorage');
          } catch (storageError) {
            console.error('Failed to save auth state to localStorage:', storageError);
          }
          setIsAuthenticated(true);
          router.push('/dashboard');
        } else {
          setAuthError('Signature verification failed. Please try again.');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      setAuthError('Failed to sign message. Please try again.');
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signMessage, authError }}>
      {children}
    </AuthContext.Provider>
  );
}
