'use client';

import { useTokenBalances } from '@/hooks/useTokenBalances';
import { TokenIcon } from '@/components/ui/TokenIcon';

export function TokenPortfolio() {
  const { balances, isLoading } = useTokenBalances();

  return (
    <div className="animate-fade-in-up" style={{ marginBottom: 20 }}>
      <div className="section-title">Token Portfolio</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {balances.map(token => (
          <div
            key={token.address}
            className="card"
            style={{
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              transition: 'all 0.2s',
            }}
          >
            <TokenIcon token={token} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                }}>
                  {token.symbol}
                </span>
                {token.isHub && (
                  <span style={{
                    fontSize: '0.6rem',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-glow)',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    border: '1px solid var(--border-accent)',
                  }}>
                    HUB
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {token.name}
              </div>
            </div>

            {isLoading ? (
              <div className="skeleton" style={{ width: 72, height: 20 }} />
            ) : (
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: token.color,
                }}>
                  {token.balance}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Balance</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
