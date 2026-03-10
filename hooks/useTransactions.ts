'use client';

import { useWallets } from '@privy-io/react-auth';
import { usePublicClient } from 'wagmi';
import { useEffect, useState, useCallback } from 'react';
import { ROUTER_ABI } from '@/lib/contracts';
import { ROUTER_ADDRESS, SUPPORTED_TOKENS, tempoChain } from '@/lib/config';
import { formatUnits } from 'viem';

export type TxType = 'swap' | 'send' | 'receive' | 'invoice_paid' | 'invoice_created';

export interface Transaction {
  id: string;
  type: TxType;
  txHash: `0x${string}`;
  blockNumber: bigint;
  timestamp?: number;
  // Swap fields
  tokenIn?: string;
  tokenOut?: string;
  amountIn?: string;
  amountOut?: string;
  // Send/Receive fields
  from?: string;
  to?: string;
  amount?: string;
  tokenSymbol?: string;
}

const MAX_BLOCKS = BigInt(10_000);

function getTokenSymbol(addr: string): string {
  const t = SUPPORTED_TOKENS.find(t => t.address.toLowerCase() === addr.toLowerCase());
  return t?.symbol ?? addr.slice(0, 6) + '…';
}

export function useTransactions() {
  const { wallets } = useWallets();
  const publicClient = usePublicClient({ chainId: tempoChain.id });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address as `0x${string}` | undefined;

  const fetchTxs = useCallback(async () => {
    if (!address || !publicClient || ROUTER_ADDRESS === '0x0000000000000000000000000000000000000000') {
      return;
    }
    setIsLoading(true);
    try {
      const latestBlock = await publicClient.getBlockNumber();
      const fromBlock = latestBlock > MAX_BLOCKS ? latestBlock - MAX_BLOCKS : BigInt(0);

      // Fetch SwapRouted events
      const swapLogs = await publicClient.getLogs({
        address: ROUTER_ADDRESS,
        event: {
          name: 'SwapRouted',
          type: 'event',
          inputs: [
            { name: 'sender',   type: 'address', indexed: true },
            { name: 'tokenIn',  type: 'address', indexed: true },
            { name: 'tokenOut', type: 'address', indexed: true },
            { name: 'amountIn',  type: 'uint256', indexed: false },
            { name: 'amountOut', type: 'uint256', indexed: false },
          ],
        },
        args: { sender: address },
        fromBlock,
        toBlock: latestBlock,
      }).catch(() => []);

      // Fetch InvoicePaid events
      const paidLogs = await publicClient.getLogs({
        address: ROUTER_ADDRESS,
        event: {
          name: 'InvoicePaid',
          type: 'event',
          inputs: [
            { name: 'invoiceId',    type: 'uint256', indexed: true },
            { name: 'payer',        type: 'address', indexed: true },
            { name: 'paymentToken', type: 'address', indexed: false },
            { name: 'amountPaid',   type: 'uint256', indexed: false },
          ],
        },
        args: { payer: address },
        fromBlock,
        toBlock: latestBlock,
      }).catch(() => []);

      const swapTxs: Transaction[] = swapLogs.map(log => ({
        id: `swap-${log.transactionHash}-${log.logIndex}`,
        type: 'swap',
        txHash: log.transactionHash!,
        blockNumber: log.blockNumber ?? BigInt(0),
        tokenIn:   getTokenSymbol((log.args as Record<string,string>).tokenIn  ?? ''),
        tokenOut:  getTokenSymbol((log.args as Record<string,string>).tokenOut ?? ''),
        amountIn:  parseFloat(formatUnits((log.args as Record<string,bigint>).amountIn  ?? BigInt(0), 18)).toFixed(4),
        amountOut: parseFloat(formatUnits((log.args as Record<string,bigint>).amountOut ?? BigInt(0), 18)).toFixed(4),
      }));

      const paidTxs: Transaction[] = paidLogs.map(log => ({
        id: `paid-${log.transactionHash}-${log.logIndex}`,
        type: 'invoice_paid',
        txHash: log.transactionHash!,
        blockNumber: log.blockNumber ?? BigInt(0),
        tokenSymbol: getTokenSymbol((log.args as Record<string,string>).paymentToken ?? ''),
        amount: parseFloat(formatUnits((log.args as Record<string,bigint>).amountPaid ?? BigInt(0), 18)).toFixed(4),
      }));

      const all = [...swapTxs, ...paidTxs].sort(
        (a, b) => Number(b.blockNumber) - Number(a.blockNumber)
      );
      setTransactions(all);
    } catch (err) {
      console.error('[useTransactions]', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, publicClient]);

  useEffect(() => {
    fetchTxs();
    const interval = setInterval(fetchTxs, 30_000);
    return () => clearInterval(interval);
  }, [fetchTxs]);

  return { transactions, isLoading, refetch: fetchTxs };
}
