'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Send, QrCode, ArrowLeftRight, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home',     icon: LayoutDashboard },
  { href: '/send',      label: 'Send',     icon: Send },
  { href: '/receive',   label: 'Receive',  icon: QrCode },
  { href: '/swap',      label: 'Swap',     icon: ArrowLeftRight },
  { href: '/settings',  label: 'Account',  icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: 'rgba(13, 21, 38, 0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
      paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '6px 0',
              textDecoration: 'none',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 28,
                height: 2,
                background: 'var(--accent)',
                borderRadius: '0 0 2px 2px',
              }} />
            )}
            <Icon
              size={22}
              fill={isActive ? 'var(--accent)' : 'none'}
              color={isActive ? 'var(--accent)' : 'var(--text-muted)'}
              strokeWidth={isActive ? 2 : 1.8}
            />
            <span style={{
              fontSize: '0.65rem',
              fontWeight: isActive ? 700 : 500,
              letterSpacing: '0.03em',
            }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
