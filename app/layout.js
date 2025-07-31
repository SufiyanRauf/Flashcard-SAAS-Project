import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Providers from '../components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SparkCards',
  description: 'AI-Powered Flashcard Generator',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <Header />
            <main style={{ paddingTop: '64px' }}>{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}