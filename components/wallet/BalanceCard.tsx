'use client';

import { useTokenBalances } from '@/hooks/useTokenBalances';
import { TokenIcon } from '@/components/ui/TokenIcon';
import { SUPPORTED_TOKENS } from '@/lib/config';

export function BalanceCard() {
  const { balances, isLoading } = useTokenBalances();

  const hubBalance = balances.find(b => b.isHub);

  return (
    <div className="card-accent animate-fade-in-up" style={{
      padding: '28px 20px',
      margin: '16px 0',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: -40,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 200,
        height: 120,
        background: 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
        Wallet Balance
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div className="skeleton" style={{ width: 160, height: 44, borderRadius: 8 }} />
        </div>
      ) : (
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.8rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: 4,
        }}>
          {hubBalance?.balance ?? '0.0000'}
          <span style={{ fontSize: '1rem', color: 'var(--accent)', marginLeft: 8 }}>
            {hubBalance?.symbol}
          </span>
        </div>
      )}

      <div style={{
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        marginBottom: 20,
      }}>
        Hub Token · AlphaUSD
      </div>

      {/* Mini token row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        {SUPPORTED_TOKENS.map(token => {
          const bal = balances.find(b => b.address === token.address);
          return (
            <div key={token.address} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              minWidth: 80,
            }}>
              <TokenIcon token={token} size={28} />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {token.symbol}
              </span>
              {isLoading ? (
                <div className="skeleton" style={{ width: 48, height: 12 }} />
              ) : (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {bal?.balance ?? '0.0000'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
