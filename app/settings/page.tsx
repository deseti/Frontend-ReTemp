'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import {
  ArrowLeft, Copy, Key, Shield, LogOut, ChevronRight, Download,
} from 'lucide-react';
import Link from 'next/link';

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
  danger?: boolean;
}

function SettingRow({ icon, label, description, onClick, danger }: SettingRowProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--border)',
        width: '100%',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: danger ? 'rgba(244,63,94,0.12)' : 'var(--bg-elevated)',
        border: `1.5px solid ${danger ? 'rgba(244,63,94,0.25)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: danger ? 'var(--red)' : 'var(--text-secondary)',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: danger ? 'var(--red)' : 'var(--text-primary)' }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {description}
          </div>
        )}
      </div>
      <ChevronRight size={16} color="var(--text-muted)" />
    </button>
  );
}

export default function SettingsPage() {
  const { ready, authenticated, logout, exportWallet } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address ?? '';

  useEffect(() => {
    if (ready && !authenticated) router.replace('/');
  }, [ready, authenticated, router]);

  async function handleCopyAddress() {
    if (address) await navigator.clipboard.writeText(address);
  }

  async function handleExportKey() {
    if (exportWallet) {
      await exportWallet();
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="page">
        <div className="page-header">
          <Link href="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <ArrowLeft size={22} />
          </Link>
          <h1 className="page-title">Settings</h1>
        </div>

        {/* Wallet address section */}
        <div className="card animate-fade-in-up" style={{ padding: '20px', marginBottom: 16 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            My Wallet
          </div>
          {address && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--text-secondary)', wordBreak: 'break-all', lineHeight: 1.6 }}>
                {address}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <AddressDisplay address={address} />
              </div>
            </div>
          )}
        </div>

        {/* Settings options */}
        <div className="card animate-fade-in-up" style={{ overflow: 'hidden', padding: 0 }}>
          <SettingRow
            icon={<Copy size={16} />}
            label="Copy Address"
            description="Copy wallet address to clipboard"
            onClick={handleCopyAddress}
          />
          <SettingRow
            icon={<Key size={16} />}
            label="Export Private Key"
            description="Securely export via Privy"
            onClick={handleExportKey}
          />
          <SettingRow
            icon={<Download size={16} />}
            label="Backup Wallet"
            description="Save your recovery phrase"
            onClick={handleExportKey}
          />
          <SettingRow
            icon={<Shield size={16} />}
            label="Security Settings"
            description="Passkey and 2FA options"
            onClick={() => {}}
          />
          <SettingRow
            icon={<LogOut size={16} />}
            label="Sign Out"
            description="Log out of your wallet"
            onClick={handleLogout}
            danger
          />
        </div>

        {/* Network info */}
        <div className="card animate-fade-in-up" style={{ padding: '16px', marginTop: 16 }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 10, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Network
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Network</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Tempo Blockchain</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Chain ID</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'monospace' }}>42431</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Router Fee</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>0.20%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Pool Fee</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>0.30%</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 20, paddingBottom: 16 }}>
          ReTemp Wallet · Powered by Tempo Protocol
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
