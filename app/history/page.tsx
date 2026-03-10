'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { TransactionList } from '@/components/wallet/TransactionList';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

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
          <h1 className="page-title">Transaction History</h1>
        </div>
        <div style={{ marginTop: 8 }}>
          <TransactionList limit={50} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
