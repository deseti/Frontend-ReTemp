'use client';

import { useTransactions, TxType } from '@/hooks/useTransactions';
import { ArrowLeftRight, Send, Download, FileText, RefreshCw } from 'lucide-react';

function TxIcon({ type }: { type: TxType }) {
  const map: Record<TxType, { icon: React.ReactNode; color: string; bgColor: string }> = {
    swap: {
      icon: <ArrowLeftRight size={16} />,
      color: '#a0a0a0', // grey
      bgColor: 'rgba(255,255,255,0.06)',
    },
    send: {
      icon: <Send size={16} />,
      color: 'var(--text-muted)', // dark grey
      bgColor: 'rgba(255,255,255,0.04)',
    },
    receive: {
      icon: <Download size={16} />,
      color: '#ffffff', // bright white
      bgColor: 'rgba(255,255,255,0.1)',
    },
    invoice_paid: {
      icon: <FileText size={16} />,
      color: '#888888', // mid grey
      bgColor: 'rgba(255,255,255,0.05)',
    },
    invoice_created: {
      icon: <FileText size={16} />,
      color: '#bbbbbb', // light grey
      bgColor: 'rgba(255,255,255,0.06)',
    },
  };
  const { icon, color, bgColor } = map[type];
  return (
    <div style={{
      width: 40,
      height: 40,
      borderRadius: 12,
      background: bgColor,
      border: `1.5px solid ${color}35`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color,
      flexShrink: 0,
    }}>
      {icon}
    </div>
  );
}

const TX_LABELS: Record<TxType, string> = {
  swap:            'Swap',
  send:            'Send',
  receive:         'Receive',
  invoice_paid:    'Invoice Paid',
  invoice_created: 'Invoice Created',
};

export function TransactionList({ limit = 5 }: { limit?: number }) {
  const { transactions, isLoading, refetch } = useTransactions();
  const visible = transactions.slice(0, limit);

  return (
    <div className="animate-fade-in-up" style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 12
      }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Recent Transactions</div>
        <button
          onClick={refetch}
          style={{
            background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text-muted)', padding: 4,
          }}
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 64, borderRadius: 14 }} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="card" style={{
          padding: '28px 16px', textAlign: 'center',
          color: 'var(--text-muted)', fontSize: '0.85rem'
        }}>
          No transactions yet. Start by sending or swapping tokens.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map(tx => (
            <div
              key={tx.id}
              className="card"
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
            >
              <TxIcon type={tx.type} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  {TX_LABELS[tx.type]}
                </div>

                {tx.type === 'swap' && tx.tokenIn && tx.tokenOut && (
                  <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {tx.tokenIn} → {tx.tokenOut}
                  </div>
                )}
                {tx.type === 'invoice_paid' && tx.tokenSymbol && (
                  <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    Paid with {tx.tokenSymbol}
                  </div>
                )}
                {tx.type === 'send' && tx.to && (
                  <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    To {tx.to.slice(0, 6)}…{tx.to.slice(-4)}
                  </div>
                )}
                {tx.type === 'receive' && tx.from && (
                  <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    From {tx.from.slice(0, 6)}…{tx.from.slice(-4)}
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {tx.type === 'swap' && tx.amountOut && tx.tokenOut && (
                  <div className="amount-positive" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    +{tx.amountOut} {tx.tokenOut}
                  </div>
                )}
                {tx.type === 'receive' && tx.amount && tx.tokenSymbol && (
                  <div className="amount-positive" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    +{tx.amount} {tx.tokenSymbol}
                  </div>
                )}
                {tx.type === 'invoice_paid' && tx.amount && tx.tokenSymbol && (
                  <div className="amount-negative" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    -{tx.amount} {tx.tokenSymbol}
                  </div>
                )}
                {tx.type === 'send' && tx.amount && tx.tokenSymbol && (
                  <div className="amount-negative" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                    -{tx.amount} {tx.tokenSymbol}
                  </div>
                )}
                <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Block #{tx.blockNumber.toString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
