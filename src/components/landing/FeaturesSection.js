'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './FeaturesSection.module.css';

const features = [
  {
    icon: '🚨',
    title: 'Instant Emergency Reporting',
    description: 'One-tap emergency reporting via QR codes in every room. No app download, no login barrier. Guests can report fires, medical emergencies, or security threats in under 5 seconds.',
    color: '#ef4444',
  },
  {
    icon: '📡',
    title: 'Real-Time Command Dashboard',
    description: 'Unified crisis management hub showing live incidents on interactive floor plans. Monitor staff deployment, track response progress, and coordinate across multiple buildings.',
    color: '#3b82f6',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Analysis',
    description: 'Gemini AI automatically classifies severity, suggests response protocols, detects duplicate reports, and generates situational briefings for incoming first responders.',
    color: '#8b5cf6',
  },
  {
    icon: '📍',
    title: 'Location Intelligence',
    description: 'Interactive venue floor plans with zone-based alert routing. Only notify staff near the incident. Visualize evacuation routes and assembly point tracking.',
    color: '#06b6d4',
  },
  {
    icon: '📢',
    title: 'Multi-Channel Alerts',
    description: 'Push notifications, in-app alerts with audio, and SMS fallback ensure no alert is missed. Auto-dispatch to the right department based on crisis type and proximity.',
    color: '#f97316',
  },
  {
    icon: '📊',
    title: 'Post-Incident Analytics',
    description: 'Detailed response time breakdown, incident timeline reconstruction, staff performance metrics, and compliance reporting. Learn from every incident to improve future responses.',
    color: '#22c55e',
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
          <span className={styles.label}>FEATURES</span>
          <h2 className={styles.title}>Everything you need for crisis response</h2>
          <p className={styles.subtitle}>
            A comprehensive platform that covers the entire emergency lifecycle — from detection to resolution.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, i) => (
            <div
              key={i}
              className={`${styles.card} ${visible ? styles.visible : ''}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={styles.iconWrap} style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
              <div className={styles.cardLine} style={{ background: feature.color }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
