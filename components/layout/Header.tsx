'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import { Zap, Settings } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address;

  return (
    <header style={{
      padding: '20px 16px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-base)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Logo & App name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px var(--accent-glow)',
        }}>
          <img src="/retempo.svg" alt="RETEMPO Logo" style={{width: '18px', height: '18px'}} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}>
            RETEMPO
          </div>
          <div style={{
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            Tempo Network
          </div>
        </div>
      </div>

      {/* Network badge + address + settings */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="badge badge-green" style={{ fontSize: '0.65rem' }}>
            <div className="status-dot" style={{ width: 6, height: 6 }} />
            Tempo • Testnet
          </div>
          <Link
            href="/settings"
            style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)', textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            title="Account Settings"
          >
            <Settings size={14} />
          </Link>
        </div>
        {authenticated && address && (
          <AddressDisplay address={address} />
        )}
      </div>
    </header>
  );
}
