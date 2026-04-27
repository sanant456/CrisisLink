'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/incidents', label: 'Incidents', icon: '🚨' },
  { href: '/dashboard/map', label: 'Venue Map', icon: '🗺️' },
  { href: '/dashboard/staff', label: 'Staff', icon: '👥' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L2 8v12l12 6 12-6V8L14 2z" stroke="url(#dash-grad)" strokeWidth="2" fill="none"/>
              <circle cx="14" cy="14" r="3" fill="url(#dash-grad)"/>
              <defs>
                <linearGradient id="dash-grad" x1="2" y1="2" x2="26" y2="26">
                  <stop stopColor="#3b82f6"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <span>CrisisLink</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.navActive : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.venueInfo}>
            <div className={styles.venueName}>Grand Horizon Resort</div>
            <div className={styles.venueStatus}>
              <span className={styles.onlineDot} />
              System Online
            </div>
          </div>
          <Link href="/report" className={`btn btn-danger btn-sm ${styles.sosBtn}`}>
            🚨 New Report
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className={styles.main}>
        {/* Top bar */}
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className={styles.topbarCenter}>
            <div className={styles.livePulse}>
              <span className={styles.liveDot} />
              LIVE
            </div>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.alertBell}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className={styles.alertCount}>4</span>
            </div>
            <div className={styles.avatar}>CM</div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
