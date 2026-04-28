'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Animated orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={`container ${styles.content} ${visible ? styles.visible : ''}`}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Real-time Emergency Coordination Platform
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>Crisis Response</span>
          <span className="text-gradient">In Real Time.</span>
        </h1>

        <p className={styles.subtitle}>
          Instantly detect, report, and coordinate emergency responses across hospitality venues. 
          Bridge the gap between distressed guests, on-site staff, and first responders — 
          when every second counts.
        </p>

        <div className={styles.statsRow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span className={styles.statText}>Trusted by <strong>50+ venues</strong></span>
          <span className={styles.statDot}>•</span>
          <span className={styles.statText}><strong>1,000+</strong> incidents handled</span>
          <span className={styles.statDot}>•</span>
          <span className={styles.statText}><strong>98%</strong> resolution rate</span>
        </div>

        <div className={styles.actions}>
          <Link href="/report" className="btn btn-danger btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Report Emergency
          </Link>
          <Link href="/dashboard" className="btn btn-ghost btn-lg glass">
            View Dashboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '6px'}}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>

      {/* Dashboard preview */}
      <div className={`container-wide ${styles.previewWrap} ${visible ? styles.visible : ''}`}>
        
        <div className={styles.previewCenterText}>
          <div className={styles.previewCommandBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Command center
          </div>
          <h2>Live Crisis Dashboard</h2>
          <p>Monitor, coordinate, and resolve emergencies in real-time with our intuitive command center.</p>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDots}>
              <span style={{background: '#ef4444'}} />
              <span style={{background: '#eab308'}} />
              <span style={{background: '#22c55e'}} />
            </div>
            <div className={styles.mockUrlBar}>app.crisislink.io/dashboard</div>
            <div className={styles.secureText}>
              <span className={styles.secureDot} /> Secure
            </div>
          </div>
          <div className={styles.previewBody}>
            <div className={styles.previewCards}>
              <div className={styles.previewCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapGreen}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <span className={styles.bigNumber}>4</span>
                </div>
                <div className={styles.cardTitle}>Active Incidents</div>
                <div className={styles.cardMeta}><span className={styles.metaDotGreen} /> Live tracking</div>
              </div>
              <div className={styles.previewCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapBlue}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span className={styles.bigNumber}>14</span>
                </div>
                <div className={styles.cardTitle}>Staff Responders Online</div>
                <div className={styles.cardMeta}><span className={styles.metaDotBlue} /> Real-time</div>
              </div>
              <div className={styles.previewCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapPurple}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                  </div>
                  <span className={styles.bigNumber}>156s</span>
                </div>
                <div className={styles.cardTitle}>Avg Response Time</div>
                <div className={styles.cardMeta}><span className={styles.metaDotPurple} /> Updated live</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
