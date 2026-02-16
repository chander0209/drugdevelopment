import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { UserProvider } from './UserContext';

export const metadata: Metadata = {
  title: 'Drug Development Portfolio Dashboard',
  description: 'Manage and track drug development programs and clinical studies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock current user - in production, this would come from authentication
  const currentUser = {
    name: 'chan',
    role: 'edit',
  };

  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
        <UserProvider currentUser={currentUser}>
          <Header currentUser={currentUser} />
          <main id="main-content" role="main" className="min-h-screen bg-gray-50">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
