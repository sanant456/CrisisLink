'use client';
import { useRouter } from 'next/navigation';
import styles from './FloatingSOS.module.css';

export default function FloatingSOS() {
  const router = useRouter();

  return (
    <button 
      className={styles.sosButton}
      onClick={() => router.push('/report')}
      aria-label="Trigger SOS"
    >
      <div className={styles.pulse} />
      <span className={styles.icon}>🚨</span>
      <span className={styles.text}>SOS</span>
    </button>
  );
}
