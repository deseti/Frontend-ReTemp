'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, parseGwei } from 'viem';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { TokenIcon } from '@/components/ui/TokenIcon';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { SUPPORTED_TOKENS, tempoChain } from '@/lib/config';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SendPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();
  const { balances, refetch: balancesRefetch } = useTokenBalances();

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

      // Direct ERC-20 Transfer to the recipient
      setStep('sending');
      const hash = await writeContractAsync({
        address: token.address,
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ],
        functionName: 'transfer',
        args: [recipient as `0x${string}`, amountBn],
        chainId: tempoChain.id,
        gasPrice: parseGwei('25'), // Paksa pakai legacy gasPrice minimum 25 Gwei untuk Tempo
      });
      setTxHash(hash);
      setStep('success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErrMsg(msg.slice(0, 120));
      setStep('error');
    }
  }

  // Refetch balances when transaction is confirmed
  useEffect(() => {
    if (step === 'success' && !isConfirming) {
      balancesRefetch();
    }
  }, [step, isConfirming, balancesRefetch]);

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

            {/* Routing info 
                This block is now hidden for simple send because we only do peer to peer transfer 
            */}

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
              disabled={!recipient || !amount || step === 'sending' || isConfirming}
              style={{ width: '100%' }}
            >
              {step === 'sending' || isConfirming ? (
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
