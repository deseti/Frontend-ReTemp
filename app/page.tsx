'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Zap, Shield, Zap as ZapIcon } from 'lucide-react';

export default function LoginPage() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/dashboard');
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
      }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(180deg, var(--bg-base) 0%, #081022 100%)',
      padding: '60px 28px 48px',
      maxWidth: 430,
      margin: '0 auto',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background gradient orb */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 400,
        height: 400,
        background: 'radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div />

      {/* Hero Section */}
      <div className="animate-fade-in-up" style={{ position: 'relative' }}>
        {/* Logo */}
        <div style={{
          width: 88,
          height: 88,
          borderRadius: 26,
          background: 'linear-gradient(135deg, var(--accent) 0%, #0d9488 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 12px 40px var(--accent-glow), 0 0 60px rgba(16,185,129,0.12)',
        }} className="animate-pulse-glow">
          <Zap size={44} color="#fff" fill="#fff" />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.4rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 12,
        }}>
          ReTempo
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: 300,
          margin: '0 auto 40px',
        }}>
          Your gateway to Tempo Network. Send, receive, and swap stablecoins instantly.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
          {[
            { icon: '⚡', label: 'Instant Routing' },
            { icon: '🔒', label: 'Embedded Wallet' },
            { icon: '💱', label: 'Auto Swap' },
          ].map(pill => (
            <div key={pill.label} className="badge badge-green" style={{ fontSize: '0.75rem', padding: '6px 14px' }}>
              {pill.icon} {pill.label}
            </div>
          ))}
        </div>
      </div>

      {/* Login Section */}
      <div className="animate-fade-in-up" style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 24px',
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            Sign In or Create Wallet
          </div>

          <button
            id="privy-login-btn"
            className="btn btn-primary"
            onClick={login}
            style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: 'var(--radius-lg)' }}
          >
            <Zap size={18} />
            Continue with Email / Google
          </button>

          <div style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>or use passkey</span>
            <div className="divider" style={{ flex: 1 }} />
          </div>

          <button
            id="passkey-login-btn"
            className="btn btn-ghost"
            onClick={login}
            style={{ width: '100%', marginTop: 16, padding: '14px' }}
          >
            <Shield size={16} />
            Sign in with Passkey
          </button>
        </div>

        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          A wallet is automatically created for you on first login.
          Powered by Privy embedded wallets on Tempo Blockchain.
        </p>
      </div>
    </div>
  );
}
