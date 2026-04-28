'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './SecuritySection.module.css';

const securityFeatures = [
  {
    title: 'End-to-End Encryption',
    description: 'All communication and data transfers are secured with AES-256 and TLS 1.3 encryption protocols.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
  },
  {
    title: 'Biometric Authentication',
    description: 'Access to the responder portal is secured with multi-factor and biometric authentication.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.5-2.5"></path>
      </svg>
    ),
  },
  {
    title: 'Real-time Threat Monitoring',
    description: 'Continuous monitoring for unauthorized access attempts and potential security breaches.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
  },
  {
    title: 'Data Privacy Compliance',
    description: 'Fully compliant with GDPR, HIPAA, and SOC 2 Type II enterprise standards.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
];

export default function SecuritySection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} id="security" ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          <div className={`${styles.content} ${visible ? styles.visible : ''}`}>
            <span className={styles.badge}>Security First</span>
            <h2 className={styles.title}>Enterprise-Grade Protection for Your Data</h2>
            <p className={styles.desc}>
              CrisisLink is built on a foundation of absolute security. We understand that in an emergency, data integrity and privacy are non-negotiable.
            </p>
            <div className={styles.checklist}>
              <div className={styles.checkItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>ISO 27001 Certified Data Centers</span>
              </div>
              <div className={styles.checkItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>99.99% Guaranteed Uptime SLA</span>
              </div>
              <div className={styles.checkItem}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Automated Daily Security Audits</span>
              </div>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {securityFeatures.map((feat, i) => (
              <div 
                key={i} 
                className={`${styles.card} ${visible ? styles.visible : ''}`}
                style={{ animationDelay: `${(i + 2) * 100}ms` }}
              >
                <div className={styles.icon}>{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
