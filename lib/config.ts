import { defineChain } from 'viem';

// ─── Tempo Blockchain L1 Chain Definition ─────────────────────────────────────
export const tempoChain = defineChain({
  id: 42431,
  name: 'Tempo Testnet (Moderato)',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_TEMPO_RPC_URL ?? 'https://rpc.moderato.tempo.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Tempo Explorer',
      url: 'https://explore.tempo.xyz',
    },
  },
  testnet: true,
});

// ─── Contract Addresses ────────────────────────────────────────────────────────
// UPDATE THESE after deploying the contracts

export const ROUTER_ADDRESS = (
  process.env.NEXT_PUBLIC_ROUTER_ADDRESS ?? '0x148ACa4DF102E7E4F94C8eFDF3A1710E41AFc093'
) as `0x${string}`;

export const TREASURY_ADDRESS = (
  process.env.NEXT_PUBLIC_TREASURY_ADDRESS ?? '0x75b0b8EFb946e2892Bc650311D28DEFfbe015Ea9'
) as `0x${string}`;

// ─── Supported Tokens (TIP-20 on Tempo Testnet) ───────────────────────────────
// Based on Deploy.s.sol:
//   ALPHA_USD  = 0x20c0000000000000000000000000000000000001 (HUB token)
//   BETA_USD   = 0x20c0000000000000000000000000000000000002
//   THETA_USD  = 0x20c0000000000000000000000000000000000003
//   PATH_USD   = 0x20c0000000000000000000000000000000000000

export interface Token {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
  color: string;    // accent color for UI
  isHub?: boolean;  // AlphaUSD is the hub token
}

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: 'αUSD',
    name: 'AlphaUSD',
    address: '0x20c0000000000000000000000000000000000001',
    decimals: 6,
    color: '#10b981',
    isHub: true,
  },
  {
    symbol: 'βUSD',
    name: 'BetaUSD',
    address: '0x20c0000000000000000000000000000000000002',
    decimals: 6,
    color: '#3b82f6',
  },
  {
    symbol: 'θUSD',
    name: 'ThetaUSD',
    address: '0x20c0000000000000000000000000000000000003',
    decimals: 6,
    color: '#8b5cf6',
  },
  {
    symbol: 'πUSD',
    name: 'PathUSD',
    address: '0x20c0000000000000000000000000000000000000',
    decimals: 6,
    color: '#f59e0b',
  },
];

// ─── Pool Addresses (Tempo Moderato Testnet — deployed 2026-03-09) ──────────────
// pools[tokenA][tokenB] mirrors the router registry
// Source: https://github.com/deseti/ReTemp/blob/main/contracts.md
const ALPHA = '0x20C0000000000000000000000000000000000001' as `0x${string}`;
const BETA  = '0x20C0000000000000000000000000000000000002' as `0x${string}`;
const THETA = '0x20C0000000000000000000000000000000000003' as `0x${string}`;
const PATH  = '0x20C0000000000000000000000000000000000000' as `0x${string}`;

export const POOL_ADDRESSES: Record<string, Record<string, `0x${string}`>> = {
  // AlphaUSD ↔ BetaUSD
  [ALPHA]: {
    [BETA]:  '0x857F4F2dEF1a6A2C4c417ae2c5bb1A62F1A0950C' as `0x${string}`,
    [THETA]: '0x86ca17F2fe550E8B245cB23967343bc5C8DCfab9' as `0x${string}`,
    [PATH]:  '0x23b549AbaE9003ceBD95ac4fFe2BC948E7DcBfEd' as `0x${string}`,
  },
  // Reverse direction — same pools
  [BETA]: {
    [ALPHA]: '0x857F4F2dEF1a6A2C4c417ae2c5bb1A62F1A0950C' as `0x${string}`,
  },
  [THETA]: {
    [ALPHA]: '0x86ca17F2fe550E8B245cB23967343bc5C8DCfab9' as `0x${string}`,
  },
  [PATH]: {
    [ALPHA]: '0x23b549AbaE9003ceBD95ac4fFe2BC948E7DcBfEd' as `0x${string}`,
  },
};

/** Utility: resolve pool address for a token pair (order-independent). */
export function getPoolAddress(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
): `0x${string}` | undefined {
  return (
    POOL_ADDRESSES[tokenA]?.[tokenB] ??
    POOL_ADDRESSES[tokenB]?.[tokenA]
  );
}

// ─── ERC-20 minimal ABI ────────────────────────────────────────────────────────
export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const;
