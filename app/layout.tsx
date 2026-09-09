import './globals.css';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Alaris Clutch — Tech Job Intelligence by Alaris Space',
  description:
    'Part of the Alaris Space product family. A 100% free tech job board continuously indexing LinkedIn, Wuzzuf, Arbeitnow, Remotive, and Indeed with advanced multi-category filters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0E0F11] text-[#EEEEEE] antialiased selection:bg-[#5E6AD2]/30 selection:text-[#EEEEEE]">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#0E0F11] py-8 text-xs text-[#8A8F98]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                <span className="font-semibold text-[#EEEEEE]">Alaris Clutch</span>
                <span className="hidden sm:inline">•</span>
                <span>An Alaris Space product alongside Orbit, Nexus, and FlowX</span>
              </div>
              <div className="flex items-center gap-3 text-[#8A8F98]">
                <span>100% Free & Open</span>
                <span>•</span>
                <span>PostgreSQL + Next.js</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
