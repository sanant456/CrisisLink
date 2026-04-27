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
          Google Solution Challenge 2026
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>Crisis Response</span>
          <span className={styles.titleGradient}>In Real Time.</span>
        </h1>

        <p className={styles.subtitle}>
          Instantly detect, report, and coordinate emergency responses across hospitality venues. 
          Bridge the gap between distressed guests, on-site staff, and first responders — 
          when every second counts.
        </p>

        <div className={styles.actions}>
          <Link href="/report" className={`btn btn-danger btn-lg ${styles.sosBtn}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Report Emergency
          </Link>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Open Dashboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Live mock indicator */}
        <div className={styles.liveBar}>
          <div className={styles.liveDot} />
          <span>4 active incidents • 5 staff responding • 387 guests on-site</span>
        </div>
      </div>

      {/* Dashboard preview */}
      <div className={`container ${styles.previewWrap} ${visible ? styles.visible : ''}`}>
        <div className={styles.preview}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDots}>
              <span style={{background: '#ef4444'}} />
              <span style={{background: '#eab308'}} />
              <span style={{background: '#22c55e'}} />
            </div>
            <span className={styles.previewTitle}>CrisisLink Command Center</span>
          </div>
          <div className={styles.previewBody}>
            <div className={styles.previewSidebar}>
              <div className={styles.previewNavItem} style={{background: 'rgba(59,130,246,0.2)', borderLeft: '2px solid #3b82f6'}}>
                <span>📊</span> Dashboard
              </div>
              <div className={styles.previewNavItem}><span>🚨</span> Incidents</div>
              <div className={styles.previewNavItem}><span>🗺️</span> Map</div>
              <div className={styles.previewNavItem}><span>👥</span> Staff</div>
              <div className={styles.previewNavItem}><span>📈</span> Analytics</div>
            </div>
            <div className={styles.previewMain}>
              <div className={styles.previewCards}>
                <div className={styles.previewCard} style={{borderTop: '2px solid #ef4444'}}>
                  <div style={{fontSize: '11px', color: '#94a3b8'}}>Active Crises</div>
                  <div style={{fontSize: '24px', fontWeight: '800', color: '#ef4444'}}>4</div>
                </div>
                <div className={styles.previewCard} style={{borderTop: '2px solid #f97316'}}>
                  <div style={{fontSize: '11px', color: '#94a3b8'}}>Responding</div>
                  <div style={{fontSize: '24px', fontWeight: '800', color: '#f97316'}}>5</div>
                </div>
                <div className={styles.previewCard} style={{borderTop: '2px solid #22c55e'}}>
                  <div style={{fontSize: '11px', color: '#94a3b8'}}>Avg Response</div>
                  <div style={{fontSize: '24px', fontWeight: '800', color: '#22c55e'}}>1:42</div>
                </div>
                <div className={styles.previewCard} style={{borderTop: '2px solid #3b82f6'}}>
                  <div style={{fontSize: '11px', color: '#94a3b8'}}>Guests On-Site</div>
                  <div style={{fontSize: '24px', fontWeight: '800', color: '#3b82f6'}}>387</div>
                </div>
              </div>
              <div className={styles.previewIncidents}>
                <div className={styles.previewIncident}>
                  <span className={styles.previewSeverity} style={{background: '#ef4444'}} />
                  <div>
                    <div style={{fontSize: '12px', fontWeight: '600'}}>🔥 Kitchen Fire — Building A</div>
                    <div style={{fontSize: '10px', color: '#94a3b8'}}>Floor 1 • Responding • 2m ago</div>
                  </div>
                </div>
                <div className={styles.previewIncident}>
                  <span className={styles.previewSeverity} style={{background: '#f97316'}} />
                  <div>
                    <div style={{fontSize: '12px', fontWeight: '600'}}>🏥 Medical Emergency — Room 412</div>
                    <div style={{fontSize: '10px', color: '#94a3b8'}}>Floor 4 • Responding • 7m ago</div>
                  </div>
                </div>
                <div className={styles.previewIncident}>
                  <span className={styles.previewSeverity} style={{background: '#eab308'}} />
                  <div>
                    <div style={{fontSize: '12px', fontWeight: '600'}}>🛡️ Unauthorized Access — Parking B2</div>
                    <div style={{fontSize: '10px', color: '#94a3b8'}}>Level B2 • Acknowledged • 15m ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
