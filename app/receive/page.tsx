'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets } from '@privy-io/react-auth';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { AddressDisplay } from '@/components/ui/AddressDisplay';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

// Load QR dynamically to avoid SSR issues
const QRCode = dynamic(() => import('qrcode.react').then(m => m.QRCodeSVG), { ssr: false });

export default function ReceivePage() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();

  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const address = embeddedWallet?.address ?? '';

  useEffect(() => {
    if (ready && !authenticated) router.replace('/');
  }, [ready, authenticated, router]);

  return (
    <div className="app-shell">
      <Header />
      <main className="page">
        <div className="page-header">
          <Link href="/dashboard" style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <ArrowLeft size={22} />
          </Link>
          <h1 className="page-title">Receive</h1>
        </div>

        <div className="card animate-fade-in-up" style={{ padding: '32px 24px', textAlign: 'center', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 6 }}>
            <Download size={16} color="var(--accent)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Your Wallet Address
            </span>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 28 }}>
            Share this address to receive tokens on Tempo Network
          </div>

          {/* QR Code */}
          <div style={{
            display: 'inline-block',
            padding: 20,
            background: '#fff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            marginBottom: 24,
          }}>
            {address ? (
              <QRCode
                id="wallet-qr"
                value={address}
                size={200}
                level="M"
                fgColor="#0a0f1a"
                bgColor="#ffffff"
              />
            ) : (
              <div className="skeleton" style={{ width: 200, height: 200, borderRadius: 8 }} />
            )}
          </div>

          {/* Address display */}
          {address && (
            <>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                Tap to copy
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <AddressDisplay address={address} />
              </div>
              <div style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                wordBreak: 'break-all',
                letterSpacing: '0.04em',
              }}>
                {address}
              </div>
            </>
          )}
        </div>

        {/* Info card */}
        <div className="card" style={{ padding: '16px', marginTop: 12 }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Supported tokens:</strong> AlphaUSD (αUSD), BetaUSD (βUSD), ThetaUSD (θUSD), PathUSD (πUSD)
            <br />
            Only send tokens on <strong style={{ color: 'var(--accent)' }}>Tempo Network (Chain ID 42431)</strong>.
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
