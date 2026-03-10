'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import { Zap } from 'lucide-react';

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
          <Zap size={18} color="#fff" fill="#fff" />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}>
            Tempo Wallet
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

      {/* Network badge + address */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        <div className="badge badge-green" style={{ fontSize: '0.65rem' }}>
          <div className="status-dot" style={{ width: 6, height: 6 }} />
          Tempo Blockchain • Tesnet        </div>
        {authenticated && address && (
          <AddressDisplay address={address} />
        )}
      </div>
    </header>
  );
}
