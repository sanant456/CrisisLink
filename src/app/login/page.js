'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, signInWithGithub, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, { name, role });
      }
      navigateByRole(role);
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigateByRole(role);
    } catch (err) {
      console.error("Google auth error:", err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGithub();
      navigateByRole(role);
    } catch (err) {
      console.error("Github auth error:", err);
      setError(err.message || 'GitHub sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const navigateByRole = (selectedRole) => {
    if (selectedRole === 'staff') {
      router.push('/staff');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brandContent}>
          <Link href="/" className={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L2 8v12l12 6 12-6V8L14 2z" stroke="url(#login-grad)" strokeWidth="2" fill="none"/>
              <circle cx="14" cy="14" r="3" fill="url(#login-grad)"/>
              <defs>
                <linearGradient id="login-grad" x1="2" y1="2" x2="26" y2="26">
                  <stop stopColor="#3b82f6"/>
                  <stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <span>CrisisLink</span>
          </Link>
          <h1 className={styles.brandTitle}>Protecting lives through coordinated response</h1>
          <p className={styles.brandDesc}>
            Access the crisis management platform to monitor incidents, coordinate staff, and protect guests in real time.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span>📊</span>
              <div><strong>Real-time Dashboard</strong><p>Monitor all incidents across your venue</p></div>
            </div>
            <div className={styles.feature}>
              <span>🤖</span>
              <div><strong>AI-Powered Insights</strong><p>Gemini AI classification and suggestions</p></div>
            </div>
            <div className={styles.feature}>
              <span>📍</span>
              <div><strong>Location Intelligence</strong><p>Interactive floor plans and zone routing</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>{isLogin ? 'Welcome back' : 'Create an Account'}</h2>
          <p className={styles.formSubtitle}>
            {isLogin ? 'Sign in to your CrisisLink account' : 'Join the CrisisLink platform'}
          </p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required={!isLogin} 
                />
              </div>
            )}
            
            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="staff">Staff Member</option>
                <option value="crisis_manager">Crisis Manager</option>
                <option value="admin">Administrator</option>
                <option value="responder">First Responder</option>
              </select>
            </div>
            
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input 
                type="email" 
                className="input" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input 
                type="password" 
                className="input" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg" style={{width: '100%'}} disabled={loading}>
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : (isLogin ? 'Sign In' : 'Sign Up')}
              {!loading && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
            </button>
            
            <div className={styles.toggleText} style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>

            <div className={styles.divider}><span>or continue with</span></div>
            <button type="button" className={`btn btn-ghost btn-lg ${styles.googleBtn}`} onClick={handleGoogleSignIn} disabled={loading} style={{marginBottom: '12px'}}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            <button type="button" className={`btn btn-ghost btn-lg ${styles.googleBtn}`} onClick={handleGithubSignIn} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Sign in with GitHub
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
