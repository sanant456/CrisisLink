'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './StatsSection.module.css';

const stats = [
  { value: '< 2min', label: 'Average Response Time', icon: '⚡' },
  { value: '99.9%', label: 'System Uptime', icon: '🛡️' },
  { value: '360°', label: 'Situational Awareness', icon: '📡' },
  { value: '24/7', label: 'Active Monitoring', icon: '👁️' },
];

export default function StatsSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={ref}>
      <div className={`container ${styles.grid}`}>
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`${styles.card} ${visible ? styles.visible : ''}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span className={styles.icon}>{stat.icon}</span>
            <div className={styles.value}>{stat.value}</div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
