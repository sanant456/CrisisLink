'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './PricingSection.module.css';

const plans = [
  {
    name: 'Essential',
    price: '99',
    desc: 'Perfect for small venues or individual events.',
    features: ['Real-time SOS Triggering', 'Basic AI Incident Summary', '5 Staff User Seats', 'Standard Email Support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '249',
    desc: 'Advanced features for hospitality chains.',
    features: ['Multi-modal AI Analysis', 'Real-time GPS Tracking', 'Unlimited Staff Seats', '24/7 Priority Support', 'Analytics Dashboard'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'Custom solutions for global enterprises.',
    features: ['Custom AI Training', 'On-Premise Deployment Option', 'Dedicated Crisis Manager', 'White-label Mobile App', 'SLA Guarantees'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingSection() {
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
    <section className={styles.section} id="pricing" ref={ref}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Transparent Pricing for Every Venue</h2>
          <p className={styles.subtitle}>
            Choose the plan that fits your security needs. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className={styles.grid}>
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`${styles.card} ${plan.popular ? styles.popular : ''} ${visible ? styles.visible : ''}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
              <h3 className={styles.planName}>{plan.name}</h3>
              <div className={styles.price}>
                {plan.price !== 'Custom' && <span className={styles.currency}>$</span>}
                <span className={styles.amount}>{plan.price}</span>
                {plan.price !== 'Custom' && <span className={styles.period}>/mo</span>}
              </div>
              <p className={styles.planDesc}>{plan.desc}</p>
              
              <ul className={styles.featureList}>
                {plan.features.map((feat, j) => (
                  <li key={j}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link 
                href="/login" 
                className={`btn btn-lg ${plan.popular ? 'btn-primary' : 'btn-ghost'} ${styles.cta}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
