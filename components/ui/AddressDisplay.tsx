'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface AddressDisplayProps {
  address: string;
  full?: boolean;
  className?: string;
}

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function AddressDisplay({ address, full = false, className = '' }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className={`address-display ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        fontFamily: 'monospace',
      }}
      title="Click to copy"
    >
      <span>{full ? address : truncate(address)}</span>
      {copied
        ? <Check size={12} color="var(--accent)" />
        : <Copy size={12} />
      }
    </button>
  );
}
