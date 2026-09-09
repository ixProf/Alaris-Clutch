import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { I18nProvider } from '@/lib/i18n/context';

export const metadata: Metadata = {
  title: 'Alaris — Intelligent Software & Data Infrastructure | Alaris Clutch',
  description:
    'Alaris builds high-performance intelligence tools and autonomous data infrastructure, including Alaris Nexus, Alaris Orbit, Alaris FlowX, and the Alaris Clutch tech job intelligence platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[#0E0F11] text-[#EEEEEE] antialiased selection:bg-[#5E6AD2]/30 selection:text-[#EEEEEE]">
        <I18nProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
