'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar({ variant = 'landing' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L2 8v12l12 6 12-6V8L14 2z" stroke="url(#logo-grad)" strokeWidth="2" fill="none"/>
              <path d="M14 8l-6 3v6l6 3 6-3v-6l-6-3z" fill="url(#logo-grad)" opacity="0.3"/>
              <circle cx="14" cy="14" r="3" fill="url(#logo-grad)"/>
              <defs>
                <linearGradient id="logo-grad" x1="2" y1="2" x2="26" y2="26">
                  <stop stopColor="#3b82f6"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>CrisisLink</span>
        </Link>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {variant === 'landing' && (
            <>
              <a href="#features" className={styles.link} onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className={styles.link} onClick={() => setMenuOpen(false)}>How It Works</a>
              <a href="#sdg" className={styles.link} onClick={() => setMenuOpen(false)}>Impact</a>
            </>
          )}
          <Link href="/report" className={`btn btn-danger btn-sm ${styles.sos}`} onClick={() => setMenuOpen(false)}>
            <span className={styles.sosDot} />
            Report Emergency
          </Link>
          <Link href="/login" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
            Staff Login
          </Link>
        </div>

        <button 
          className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
