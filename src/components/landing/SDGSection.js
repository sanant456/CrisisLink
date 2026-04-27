'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './SDGSection.module.css';

const sdgs = [
  {
    number: 3,
    title: 'Good Health & Well-Being',
    description: 'Faster medical emergency response with AI triage and instant staff dispatch. Reduces time-to-treatment in hospitality settings.',
    color: '#4c9f38',
    icon: '💚',
  },
  {
    number: 11,
    title: 'Sustainable Cities & Communities',
    description: 'Building safer, more resilient hospitality infrastructure. Creating emergency-prepared communities that protect both residents and visitors.',
    color: '#f99d26',
    icon: '🏙️',
  },
  {
    number: 16,
    title: 'Peace, Justice & Strong Institutions',
    description: 'Better security incident coordination, transparent incident tracking, and accountability through comprehensive analytics.',
    color: '#00689d',
    icon: '⚖️',
  },
];

export default function SDGSection() {
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
    <section className={styles.section} id="sdg" ref={ref}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.label}>GLOBAL IMPACT</span>
          <h2 className={styles.title}>Aligned with UN Sustainable Development Goals</h2>
          <p className={styles.subtitle}>
            CrisisLink contributes to three key SDGs, advancing global safety and resilience.
          </p>
        </div>

        <div className={styles.grid}>
          {sdgs.map((sdg, i) => (
            <div
              key={i}
              className={`${styles.card} ${visible ? styles.visible : ''}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={styles.sdgBadge} style={{ background: sdg.color }}>
                SDG {sdg.number}
              </div>
              <span className={styles.icon}>{sdg.icon}</span>
              <h3 className={styles.cardTitle}>{sdg.title}</h3>
              <p className={styles.cardDesc}>{sdg.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
