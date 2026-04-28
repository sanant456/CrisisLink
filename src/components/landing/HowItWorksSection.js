'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './HowItWorksSection.module.css';

const steps = [
  {
    step: '01',
    title: 'Trigger SOS',
    description: 'Press panic button or use mobile app to instantly trigger emergency alert with one tap.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Capture Location',
    description: 'System automatically captures precise GPS coordinates and indoor positioning data.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Alert Responders',
    description: 'All relevant staff, security, and emergency services receive instant notifications with full context.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 19v2"></path>
        <path d="M12 3v2"></path>
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Resolve Incident',
    description: 'Track response in real-time, coordinate actions, and automatically document the entire incident.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
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
    <section className={styles.section} id="how-it-works" ref={ref}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.label}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px', verticalAlign: 'middle'}}>
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
            Seamless workflow
          </span>
          <h2 className={styles.title}>How It Works</h2>
          <p className={styles.subtitle}>
            From SOS to resolution in four seamless steps — designed for speed and simplicity.
          </p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`${styles.stepCard} ${visible ? styles.visible : ''}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={styles.stepBadge}>{step.step}</div>
              <div className={styles.stepIconWrap}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
              {i < steps.length - 1 && (
                <div className={styles.connectorArrow}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
