'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './FeaturesSection.module.css';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    ),
    title: 'Instant Detection & Alerts',
    description: 'AI-powered sensors and panic buttons trigger immediate alerts across all connected devices and personnel.',
    colorClass: 'featureRed',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 19v2"></path>
        <path d="M12 3v2"></path>
      </svg>
    ),
    title: 'Unified Communication Hub',
    description: 'Real-time bidirectional communication between guests, staff, security, and emergency responders on a single platform.',
    colorClass: 'featureBlue',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    title: 'Precise Location Tracking',
    description: 'GPS and indoor positioning systems pinpoint exact emergency locations within seconds for faster response.',
    colorClass: 'featureGreen',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
      </svg>
    ),
    title: 'Centralized Crisis Database',
    description: 'All emergency data, protocols, and contact information accessible instantly from any authorized device.',
    colorClass: 'featureOrange',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    title: 'Multi-Layer Security',
    description: 'Enterprise-grade encryption and authentication ensure sensitive crisis information remains protected.',
    colorClass: 'featurePurple',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    title: 'Automated Escalation',
    description: 'Smart routing automatically escalates to appropriate personnel and emergency services based on crisis severity.',
    colorClass: 'featureGold',
  },
];

export default function FeaturesSection() {
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
    <section className={styles.section} id="features" ref={ref}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Comprehensive Crisis Solution</h2>
          <p className={styles.subtitle}>
            A robust, reliable platform designed to eliminate communication barriers and accelerate emergency response across your hospitality ecosystem.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, i) => (
            <div
              key={i}
              className={`${styles.card} ${styles[feature.colorClass]} ${visible ? styles.visible : ''}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={styles.iconWrap}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
