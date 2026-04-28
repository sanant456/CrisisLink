'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './CTASection.module.css';

export default function CTASection() {
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
    <section className={styles.section} ref={ref}>
      <div className="container">
        {/* Compliance Bar */}
        <div className={`${styles.complianceWrap} ${visible ? styles.visible : ''}`}>
          <div className={styles.complianceHeader}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Enterprise-Grade Compliance & Trust
          </div>
          <div className={styles.complianceLogos}>
            <div className={styles.complianceBadge}>SOC 2 Type II</div>
            <div className={styles.complianceBadge}>GDPR Compliant</div>
            <div className={styles.complianceBadge}>HIPAA Ready</div>
            <div className={styles.complianceBadge}>ISO 27001</div>
            <div className={styles.complianceBadge}>CCPA</div>
          </div>
        </div>

        {/* Final CTA */}
        <div className={`${styles.ctaBox} ${visible ? styles.visible : ''}`}>
          <div className={styles.ctaBg}></div>
          <div className={styles.ctaContent}>
            <h2>Protect Your Guests and Staff Today.</h2>
            <p>Deploy the world's most advanced crisis response platform in your venues within 48 hours.</p>
            <div className={styles.actions}>
              <Link href="/report" className="btn btn-danger btn-lg">
                Schedule a Demo
              </Link>
              <Link href="/login" className="btn btn-ghost btn-lg">
                Download Brochure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
