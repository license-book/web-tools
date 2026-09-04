'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { categories } from '@/data/tools';
import ToolSearch from '@/components/search/ToolSearch';

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const initialTop = !scrolled && !open;
  const homeOverlay = pathname === '/' && initialTop;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`siteHeader ${homeOverlay ? 'headerOverlay' : 'headerSolid'} ${initialTop ? 'headerAtTop' : ''}`}>
      <div className="headerInner">
        <Link href="/" className="brand" aria-label="웹툴 홈" onClick={() => setOpen(false)}>
          <span className="brandMark" aria-hidden="true">W</span>
          <span>WEBTOOLS</span>
        </Link>
        <nav className="desktopNav" aria-label="주요 메뉴">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>{category.name}</Link>
          ))}
        </nav>
        <div className="headerSearch"><ToolSearch compact /></div>
        <button className={`menuButton ${open ? 'isOpen' : ''}`} type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open}>
          <span/><span/><span/>
        </button>
      </div>
      <nav className={`mobileNav ${open ? 'isOpen' : ''}`} aria-label="모바일 메뉴">
        <div className="mobileSearch"><ToolSearch onNavigate={() => setOpen(false)} /></div>
        <div className="mobileNavGrid">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} onClick={() => setOpen(false)}>
              <strong>{category.name}</strong><span>{category.description}</span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
