'use client';

import Link from 'next/link';
import { Send, QrCode, ArrowLeftRight, History, Droplets, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useWallets } from '@privy-io/react-auth';
import { useState } from 'react';

export function QuickActions() {
  const { wallets } = useWallets();
  const address = wallets.find(w => w.walletClientType === 'privy')?.address;
  
  const [faucetState, setFaucetState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [faucetMsg, setFaucetMsg] = useState('');

  const handleFaucet = async () => {
    if (!address || faucetState === 'loading') return;
    
    setFaucetState('loading');
    setFaucetMsg('Requesting...');
    
    try {
      const res = await fetch('https://docs.tempo.xyz/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      
      if (res.ok) {
        setFaucetState('success');
        setFaucetMsg('Funded 1M Tokens!');
      } else {
        setFaucetState('error');
        setFaucetMsg('Faucet Failed');
      }
    } catch (e) {
      setFaucetState('error');
      setFaucetMsg('Network Error');
    } finally {
      // Reset after 3 seconds
      setTimeout(() => {
        setFaucetState('idle');
        setFaucetMsg('');
      }, 3000);
    }
  };

  const ACTIONS = [
    { label: 'Send',    href: '/send',    icon: Send },
    { label: 'Receive', href: '/receive', icon: QrCode },
    { label: 'Swap',    href: '/swap',    icon: ArrowLeftRight },
    { label: 'History', href: '/history', icon: History },
  ];

  return (
    <div className="animate-fade-in-up" style={{ margin: '8px 0 20px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 8,
      }}>
        {ACTIONS.map(action => (
          <Link
            key={action.href}
            href={action.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: '14px 4px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = `var(--border-accent)`;
              (e.currentTarget as HTMLElement).style.background = `rgba(16,185,129,0.05)`;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: `var(--bg-elevated)`,
              border: `1.5px solid var(--border)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <action.icon size={18} color="var(--text-secondary)" />
            </div>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              letterSpacing: '0.01em',
            }}>
              {action.label}
            </span>
          </Link>
        ))}

        {/* Faucet Button (Action) */}
        <button
          onClick={handleFaucet}
          disabled={faucetState === 'loading'}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '14px 4px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.2s',
            cursor: faucetState === 'loading' ? 'wait' : 'pointer',
            opacity: faucetState === 'loading' ? 0.7 : 1,
            outline: 'none',
          }}
          onMouseEnter={e => {
            if (faucetState !== 'loading') {
              (e.currentTarget as HTMLElement).style.borderColor = `rgba(6, 182, 212, 0.5)`;
              (e.currentTarget as HTMLElement).style.background = `rgba(6, 182, 212, 0.1)`;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={e => {
            if (faucetState !== 'loading') {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }
          }}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: faucetState === 'success' ? 'rgba(16, 185, 129, 0.15)' : faucetState === 'error' ? 'rgba(244, 63, 94, 0.15)' : `rgba(6, 182, 212, 0.15)`,
            border: `1.5px solid ${faucetState === 'success' ? 'rgba(16, 185, 129, 0.3)' : faucetState === 'error' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {faucetState === 'loading' ? (
              <Loader2 size={18} color="#06b6d4" className="animate-spin" />
            ) : faucetState === 'success' ? (
              <CheckCircle2 size={18} color="#10b981" />
            ) : faucetState === 'error' ? (
              <AlertCircle size={18} color="#f43f5e" />
            ) : (
              <Droplets size={18} color="#06b6d4" />
            )}
          </div>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            color: faucetState === 'success' ? '#10b981' : faucetState === 'error' ? '#f43f5e' : 'var(--text-secondary)',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}>
            {faucetState === 'idle' ? 'Faucet' : faucetMsg}
          </span>
        </button>
      </div>
    </div>
  );
}
