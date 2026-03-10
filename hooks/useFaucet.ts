'use client';

import { useState } from 'react';
import { tempoChain } from '@/lib/config';

export type FaucetStatus = 'idle' | 'loading' | 'success' | 'error';

const TEMPO_RPC = tempoChain.rpcUrls.default.http[0] ?? 'https://rpc.moderato.tempo.xyz';

/**
 * useFaucet — request test tokens dari Tempo faucet.
 *
 * Menggunakan `tempo_fundAddress` JSON-RPC method yang built-in ke Tempo node.
 * Dipanggil langsung via fetch ke RPC URL (bukan lewat wagmi) karena:
 * 1. wagmi/viem tidak mengizinkan custom method tanpa type override
 * 2. Dokumentasi Tempo URL (docs.tempo.xyz/api/faucet) gagal di browser karena CORS
 */
export function useFaucet() {
  const [status, setStatus] = useState<FaucetStatus>('idle');
  const [error, setError] = useState<string>('');

  async function requestTokens(address: `0x${string}`) {
    if (!address) return;
    setStatus('loading');
    setError('');

    try {
      // Direct JSON-RPC call ke Tempo node — ini yang paling reliable
      const res = await fetch(TEMPO_RPC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tempo_fundAddress',
          params: [address.toLowerCase()],
          id: 1,
        }),
      });

      const json = await res.json();

      if (json.error) {
        throw new Error(json.error.message ?? 'RPC error');
      }

      setStatus('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg.slice(0, 160));
      setStatus('error');
    }
  }

  function reset() {
    setStatus('idle');
    setError('');
  }

  return { requestTokens, status, error, reset };
}
