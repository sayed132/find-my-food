import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import AuthProvider from '@/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Find My Food - Share & Care',
  description: 'A platform to share excess food with those in need',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" />
          <Navbar />
          <main className="min-h-screen pt-16 bg-gray-50">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
