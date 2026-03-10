'use client';

import { Token } from '@/lib/config';

interface TokenIconProps {
  token: Pick<Token, 'symbol' | 'color'>;
  size?: number;
}

export function TokenIcon({ token, size = 40 }: TokenIconProps) {
  // Get first 1–2 chars of the symbol for the avatar
  const label = token.symbol.replace(/USD|usd/g, '').slice(0, 2) || token.symbol.slice(0, 2);

  return (
    <div
      className="token-icon"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 35%, ${token.color}40, ${token.color}18)`,
        border: `1.5px solid ${token.color}50`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 700,
        color: token.color,
        flexShrink: 0,
        letterSpacing: '-0.02em',
        fontFamily: 'var(--font-outfit)',
      }}
    >
      {label}
    </div>
  );
}
