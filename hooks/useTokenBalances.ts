'use client';

import { useReadContracts } from 'wagmi';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { formatUnits } from 'viem';
import { SUPPORTED_TOKENS, ERC20_ABI } from '@/lib/config';

export interface TokenBalance {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
  color: string;
  isHub?: boolean;
  balance: string;
  balanceRaw: bigint;
  isLoading: boolean;
}

export function useTokenBalances() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address as `0x${string}` | undefined;

  const contracts = SUPPORTED_TOKENS.map(token => ({
    address: token.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf' as const,
    args: [address ?? '0x0000000000000000000000000000000000000000'] as [`0x${string}`],
  }));

  const { data, isLoading, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: authenticated && !!address,
      refetchInterval: 15_000, // refresh every 15s
    },
  });

  const balances: TokenBalance[] = SUPPORTED_TOKENS.map((token, i) => {
    const result = data?.[i];
    const raw = result?.status === 'success' ? (result.result as bigint) : BigInt(0);
    return {
      ...token,
      balanceRaw: raw,
      balance: raw > BigInt(0) ? parseFloat(formatUnits(raw, token.decimals)).toFixed(4) : '0.0000',
      isLoading,
    };
  });

  return { balances, isLoading, refetch, address };
}
