import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L2 8v12l12 6 12-6V8L14 2z" stroke="url(#footer-grad)" strokeWidth="2" fill="none"/>
              <circle cx="14" cy="14" r="3" fill="url(#footer-grad)"/>
              <defs>
                <linearGradient id="footer-grad" x1="2" y1="2" x2="26" y2="26">
                  <stop stopColor="#3b82f6"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <span>CrisisLink</span>
          </div>
          <p className={styles.tagline}>
            Rapid crisis response for hospitality venues. Built for the Google Solution Challenge 2026.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.column}>
            <h4>Platform</h4>
            <Link href="/report">Report Emergency</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/staff">Staff Portal</Link>
          </div>
          <div className={styles.column}>
            <h4>SDG Impact</h4>
            <a href="#sdg">SDG 3 — Health</a>
            <a href="#sdg">SDG 11 — Cities</a>
            <a href="#sdg">SDG 16 — Peace</a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© 2026 CrisisLink. Google Solution Challenge Submission.</p>
        <p className={styles.tech}>Built with Next.js • Firebase • Gemini AI</p>
      </div>
    </footer>
  );
}
