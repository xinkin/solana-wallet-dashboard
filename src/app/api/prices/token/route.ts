import { NextResponse } from 'next/server';
import {
  COINGECKO_API_URL,
  COINGECKO_PLATFORM,
  COINGECKO_API_KEY,
  CACHE_DURATION,
} from '@/types/solana';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractAddress = searchParams.get('address');

    if (!contractAddress) {
      return NextResponse.json({ error: 'Token address is required' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      accept: 'application/json',
    };

    if (COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = COINGECKO_API_KEY;
    }

    const response = await fetch(
      `${COINGECKO_API_URL}/simple/token_price/${COINGECKO_PLATFORM}?contract_addresses=${contractAddress}&vs_currencies=usd`,
      {
        headers,
        next: { revalidate: CACHE_DURATION },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
      },
    });
  } catch (error) {
    console.error('Error fetching token price:', error);
    return NextResponse.json({ error: 'Failed to fetch token price' }, { status: 500 });
  }
}
