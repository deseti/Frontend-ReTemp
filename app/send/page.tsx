'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { TokenIcon } from '@/components/ui/TokenIcon';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { SUPPORTED_TOKENS, ERC20_ABI, ROUTER_ADDRESS } from '@/lib/config';
import { ROUTER_ABI } from '@/lib/contracts';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SendPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { balances } = useTokenBalances();

  const [recipient, setRecipient] = useState('');
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0].address);
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'idle' | 'approving' | 'sending' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (ready && !authenticated) router.replace('/');
  }, [ready, authenticated, router]);

  const token = SUPPORTED_TOKENS.find(t => t.address === selectedToken)!;
  const balance = balances.find(b => b.address === selectedToken);

  async function handleSend() {
    if (!recipient || !amount || !token) return;
    setErrMsg('');
    try {
      const amountBn = parseUnits(amount, token.decimals);

      // 1. Approve router
      setStep('approving');
      await writeContractAsync({
        address: token.address,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [ROUTER_ADDRESS, amountBn],
      });

      // 2. Route swap / direct transfer via router – using routeSwap with same in/out for direct
      setStep('sending');
      const hash = await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: ROUTER_ABI,
        functionName: 'routeSwap',
        args: [token.address, token.address, amountBn],
      });
      setTxHash(hash);
      setStep('success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrMsg(msg.slice(0, 120));
      setStep('error');
    }
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="page">
        {/* Page header */}
        <div className="page-header">
          <Link href="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <ArrowLeft size={22} />
          </Link>
          <h1 className="page-title">Send Payment</h1>
        </div>

        {step === 'success' ? (
          <div className="card animate-fade-in-up" style={{ padding: '40px 24px', textAlign: 'center', marginTop: 20 }}>
            <CheckCircle size={52} color="var(--accent)" style={{ margin: '0 auto 16px' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
              Payment Sent!
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
              {amount} {token.symbol} sent to {recipient.slice(0, 8)}…
            </div>
            {txHash && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 24, wordBreak: 'break-all' }}>
                Tx: {txHash}
              </div>
            )}
            <button className="btn btn-primary" onClick={() => { setStep('idle'); setAmount(''); setRecipient(''); }} style={{ width: '100%' }}>
              Send Another
            </button>
          </div>
        ) : (
          <div className="card animate-fade-in-up" style={{ padding: '24px', marginTop: 8 }}>
            {/* Recipient */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                Recipient Address
              </label>
              <input
                id="recipient-input"
                className="input"
                placeholder="0x..."
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
              />
            </div>

            {/* Token */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                Token
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="token-select"
                  className="input select"
                  value={selectedToken}
                  onChange={e => setSelectedToken(e.target.value as `0x${string}`)}
                >
                  {SUPPORTED_TOKENS.map(t => (
                    <option key={t.address} value={t.address}>{t.symbol} – {t.name}</option>
                  ))}
                </select>
              </div>
              {balance && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  Balance: {balance.balance} {token.symbol}
                </div>
              )}
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                Amount
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="amount-input"
                  className="input"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ paddingRight: 70 }}
                />
                <span style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem',
                }}>
                  {token.symbol}
                </span>
              </div>
              {balance && (
                <button
                  onClick={() => setAmount(balance.balance)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', cursor: 'pointer', marginTop: 6, padding: 0 }}
                >
                  Use max
                </button>
              )}
            </div>

            {/* Routing info */}
            <div style={{
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              marginBottom: 20,
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
            }}>
              ⚡ Tempo Router automatically routes your payment. If a direct pool doesn't exist, it swaps via AlphaUSD hub.
            </div>

            {step === 'error' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 16, color: 'var(--red)', fontSize: '0.8rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {errMsg || 'Transaction failed. Please try again.'}
              </div>
            )}

            <button
              id="send-btn"
              className="btn btn-primary"
              onClick={handleSend}
              disabled={!recipient || !amount || step === 'approving' || step === 'sending' || isConfirming}
              style={{ width: '100%' }}
            >
              {step === 'approving' ? (
                <><div className="spinner" />Approving…</>
              ) : step === 'sending' || isConfirming ? (
                <><div className="spinner" />Sending…</>
              ) : (
                <><Send size={16} />Send Payment</>
              )}
            </button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
