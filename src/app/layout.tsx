import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeWrapper from './themeWrapper';
import { NextAuthProvider } from './api/authProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Year in pixels',
  description: 'Year in pixels app',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <ThemeWrapper>
        <div className={inter.className}>{children}</div>
      </ThemeWrapper>
    </NextAuthProvider>
  );
}
