'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useWallets } from '@privy-io/react-auth';
import { parseUnits } from 'viem';
import { ROUTER_ABI } from '@/lib/contracts';
import { ROUTER_ADDRESS, ERC20_ABI } from '@/lib/config';

// ─── routeSwap ────────────────────────────────────────────────────────────────
export function useRouteSwap() {
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  async function routeSwap(
    tokenIn:  `0x${string}`,
    tokenOut: `0x${string}`,
    amountIn: string,
    decimals: number = 18
  ) {
    const amount = parseUnits(amountIn, decimals);

    // Step 1: approve router to spend tokenIn
    await writeContract({
      address: tokenIn,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [ROUTER_ADDRESS, amount],
    });

    // Step 2: call routeSwap
    writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'routeSwap',
      args: [tokenIn, tokenOut, amount],
    });
  }

  return { routeSwap, hash, isPending, isConfirming, isSuccess, error, reset };
}

// ─── payInvoice ───────────────────────────────────────────────────────────────
export function usePayInvoice() {
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  async function payInvoice(
    invoiceId: bigint,
    paymentTokenAddress: `0x${string}`,
    approvalAmount: bigint
  ) {
    // Approve first
    await writeContract({
      address: paymentTokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [ROUTER_ADDRESS, approvalAmount],
    });

    // Then pay
    writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'payInvoice',
      args: [invoiceId, paymentTokenAddress],
    });
  }

  return { payInvoice, hash, isPending, isConfirming, isSuccess, error, reset };
}

// ─── createInvoice ────────────────────────────────────────────────────────────
export function useCreateInvoice() {
  const { data: hash, writeContract, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  function createInvoice(tokenAddress: `0x${string}`, amount: string, decimals = 18) {
    const amountBn = parseUnits(amount, decimals);
    writeContract({
      address: ROUTER_ADDRESS,
      abi: ROUTER_ABI,
      functionName: 'createInvoice',
      args: [tokenAddress, amountBn],
    });
  }

  return { createInvoice, hash, isPending, isConfirming, isSuccess, error, reset };
}
