import { CACHE_DURATION } from '../types/solana';

const priceCache: Record<string, { price: number; timestamp: number }> = {};

export async function fetchSolPrice(): Promise<number> {
  const cacheKey = 'sol_usd';
  const cachedData = priceCache[cacheKey];
  const now = Date.now();

  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.price;
  }

  const response = await fetch('/api/prices/sol');

  if (!response.ok) {
    throw new Error(`Failed to fetch SOL price: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const price = data.solana?.usd;

  if (!price) {
    throw new Error('SOL price not found in API response');
  }

  priceCache[cacheKey] = { price, timestamp: now };
  return price;
}

export async function fetchTokenPrices(tokenAddresses: string[]): Promise<Record<string, number>> {
  if (!tokenAddresses.length) return {};

  const now = Date.now();
  const result: Record<string, number> = {};

  const addressesToFetch = [];
  for (const addr of tokenAddresses) {
    const cachedData = priceCache[addr];
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      result[addr] = cachedData.price;
    } else {
      addressesToFetch.push(addr);
    }
  }
  if (addressesToFetch.length === 0) {
    return result;
  }

  for (const addr of addressesToFetch) {
    try {
      const response = await fetch(`/api/prices/token?address=${addr}`);

      if (!response.ok) {
        console.warn(
          `Failed to fetch price for token ${addr}: ${response.status} ${response.statusText}`
        );
        result[addr] = 0;
        continue;
      }

      const data = await response.json();

      const price = data[addr]?.usd || 0;

      priceCache[addr] = { price, timestamp: now };
      result[addr] = price;

      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.warn(`Error fetching price for token ${addr}:`, error);
      result[addr] = 0;
    }
  }

  return result;
}
