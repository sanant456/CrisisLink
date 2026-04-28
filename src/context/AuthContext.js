'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Demo user profile for when Firebase isn't configured
  const demoProfile = {
    uid: 'demo-user',
    name: 'Demo Crisis Manager',
    email: 'demo@grandhorizon.com',
    role: 'crisis_manager',
    department: 'management',
    status: 'available',
    venueId: 'grand-horizon',
    avatar: 'CM',
  };

  useEffect(() => {
    // Check if Firebase is properly configured
    const isConfigured = auth.app.options.apiKey && !auth.app.options.apiKey.includes('YOUR_');

    if (!isConfigured) {
      // Run in demo mode
      console.log('🔧 Firebase not configured — running in demo mode');
      setIsDemo(true);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data());
          } else {
            // Create default profile
            const defaultProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email,
              role: 'staff',
              department: 'general',
              status: 'available',
              venueId: 'grand-horizon',
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email/password
  const signIn = async (email, password) => {
    if (isDemo) {
      setUser({ uid: 'demo-user', email });
      setUserProfile(demoProfile);
      return { user: demoProfile };
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (isDemo) {
      setUser({ uid: 'demo-user', email: 'demo@grandhorizon.com' });
      setUserProfile(demoProfile);
      return { user: demoProfile };
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Sign up
  const signUp = async (email, password, profileData) => {
    if (isDemo) {
      setUser({ uid: 'demo-user', email });
      setUserProfile({ ...demoProfile, ...profileData });
      return { user: demoProfile };
    }
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create profile in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email,
      ...profileData,
      createdAt: new Date().toISOString(),
    });
    return result;
  };

  // Sign out
  const signOut = async () => {
    if (isDemo) {
      setUser(null);
      setUserProfile(null);
      return;
    }
    return firebaseSignOut(auth);
  };

  // Demo login (always works)
  const demoLogin = (role = 'crisis_manager') => {
    const profile = {
      ...demoProfile,
      role,
      name: role === 'crisis_manager' ? 'Demo Crisis Manager' :
            role === 'staff' ? 'Demo Staff Member' :
            role === 'admin' ? 'Demo Administrator' : 'Demo Responder',
    };
    setUser({ uid: 'demo-user', email: 'demo@grandhorizon.com' });
    setUserProfile(profile);
    setIsDemo(true);
  };

  // Sign in with Github
  const signInWithGithub = async () => {
    if (isDemo) {
      setUser({ uid: 'demo-user', email: 'demo@grandhorizon.com' });
      setUserProfile(demoProfile);
      return { user: demoProfile };
    }
    const provider = new GithubAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const value = {
    user,
    userProfile,
    loading,
    isDemo,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    signUp,
    signOut,
    demoLogin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
