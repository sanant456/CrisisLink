import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'CrisisLink — Rapid Crisis Response for Hospitality',
  description: 'Real-time emergency detection, reporting, and coordination platform for hospitality venues. Bridge communication between guests, staff, and first responders.',
  keywords: ['crisis response', 'emergency management', 'hospitality safety', 'real-time coordination'],
  manifest: '/manifest.json',
  themeColor: '#0a0e17',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CrisisLink',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-grid" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
