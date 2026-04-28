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
              <a href="#security" className={styles.link} onClick={() => setMenuOpen(false)}>Security</a>
              <a href="#pricing" className={styles.link} onClick={() => setMenuOpen(false)}>Pricing</a>
            </>
          )}
          <div className={styles.authButtons}>
            <Link href="/login" className={styles.signInBtn} onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
            <Link href="/report" className="btn btn-danger btn-sm" onClick={() => setMenuOpen(false)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '4px'}}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Report Emergency
            </Link>
            <Link href="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </div>
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
