'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/data/tools';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="siteHeader">
      <div className="headerInner">
        <Link href="/" className="brand" aria-label="웹툴 홈">WEBTOOLS</Link>
        <nav className="desktopNav" aria-label="주요 메뉴">
          {categories.slice(0, 5).map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>{category.name}</Link>
          ))}
        </nav>
        <button className="menuButton" type="button" onClick={() => setOpen((v) => !v)} aria-label="메뉴 열기">☰</button>
      </div>
      {open && (
        <nav className="mobileNav" aria-label="모바일 메뉴">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setOpen(false)}>{category.name}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
