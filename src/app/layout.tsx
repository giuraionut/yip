import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeWrapper from './themeWrapper';

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
    <ThemeWrapper>
       <html lang='en'>
        <body className={inter.className}>{children}</body>
      </html>
    </ThemeWrapper>
  );
}
