'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './HowItWorksSection.module.css';

const steps = [
  {
    step: '01',
    title: 'Detect & Report',
    description: 'Guest scans QR code in their room or taps the SOS button. Staff can report directly from their mobile interface. IoT sensors auto-detect anomalies.',
    icon: '📱',
    detail: 'No app download needed — works instantly via web browser',
  },
  {
    step: '02',
    title: 'AI Classification',
    description: 'Gemini AI instantly analyzes the report, classifies severity, and identifies the optimal response protocol. Duplicate reports are automatically merged.',
    icon: '🧠',
    detail: 'Sub-second classification with 95%+ accuracy',
  },
  {
    step: '03',
    title: 'Smart Dispatch',
    description: 'The right staff members are auto-alerted based on crisis type, proximity, and availability. Emergency services are notified for critical incidents.',
    icon: '📡',
    detail: 'Zone-based routing ensures nearest staff responds first',
  },
  {
    step: '04',
    title: 'Coordinate & Resolve',
    description: 'Real-time command dashboard enables crisis managers to coordinate response, track progress, manage evacuations, and communicate with all parties.',
    icon: '🎯',
    detail: 'Full incident timeline and post-incident analytics',
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
          <span className={styles.label}>HOW IT WORKS</span>
          <h2 className={styles.title}>From incident to resolution in minutes</h2>
          <p className={styles.subtitle}>
            A streamlined pipeline that eliminates communication gaps and accelerates response times.
          </p>
        </div>

        <div className={styles.timeline}>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`${styles.step} ${visible ? styles.visible : ''}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={styles.stepLeft}>
                <div className={styles.stepNumber}>{step.step}</div>
                {i < steps.length - 1 && <div className={styles.connector} />}
              </div>
              <div className={styles.stepContent}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
                <div className={styles.stepDetail}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
