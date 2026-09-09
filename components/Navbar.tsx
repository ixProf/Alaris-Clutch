'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Download, Layers } from 'lucide-react';
import { Button } from './Button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#0E0F11]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Alaris Space context */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1F2024] border border-[rgba(255,255,255,0.08)]">
            <Layers className="h-4 w-4 text-[#EEEEEE]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-[#EEEEEE]">
              Alaris Clutch
            </span>
            <span className="text-[11px] tracking-normal text-[#8A8F98]">
              by Alaris Space
            </span>
          </div>
        </Link>

        {/* Center Live Indicator (Flat, No Pulse/Ping) */}
        <div className="hidden md:flex items-center gap-2 rounded-md border border-[rgba(255,255,255,0.08)] bg-[#151619] px-3 py-1 text-xs text-[#8A8F98]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#5E6AD2]"></span>
          <span>Continuous Indexing • Live Feed</span>
        </div>

        {/* Right Navigation & CTAs */}
        <div className="flex items-center gap-2.5">
          <Link href="/status">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <Activity className="h-3.5 w-3.5 text-[#8A8F98]" />
              <span>Status</span>
            </Button>
          </Link>

          <a href="/api/export?format=xlsx">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
