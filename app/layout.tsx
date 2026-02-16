import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { UserProvider } from './UserContext';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <UserProvider currentUser={currentUser}>
          <Header currentUser={currentUser} />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
