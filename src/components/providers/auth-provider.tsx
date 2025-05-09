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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('solanalytics-auth');
      if (savedAuth === 'true' && connected) {
        setIsAuthenticated(true);
      }
    }
  }, [connected]);

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
          setIsAuthenticated(true);
          localStorage.setItem('solanalytics-auth', 'true');
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
