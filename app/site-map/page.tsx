import type { Metadata } from 'next';
import Link from 'next/link';
import { categories, tools } from '@/data/tools';

export const metadata: Metadata = {
  title: '사이트맵',
  description: 'WEBTOOLS의 주요 카테고리, 도구, 사이트 안내 페이지를 한눈에 확인합니다.',
};

const infoLinks = [
  ['/about', '웹툴 소개'],
  ['/privacy', '개인정보처리방침'],
  ['/terms', '이용약관'],
  ['/disclaimer', '정보 이용 안내'],
  ['/contact', '문의'],
] as const;

export default function SiteMapPage() {
  return (
    <main className="infoPage">
      <section className="infoPageHero"><div className="infoPageHeroInner"><p className="infoPageEyebrow">SITE MAP</p><h1>사이트맵</h1><p>WEBTOOLS의 모든 주요 메뉴와 사용 가능한 도구를 빠르게 찾아볼 수 있습니다.</p></div></section>
      <div className="infoPageBody">
        <div className="infoCard">
          <section className="infoBlock siteMapGroup">
            <h2>도구 카테고리</h2>
            <div className="infoLinkGrid">
              {categories.map((category) => (
                <Link key={category.slug} className="infoLinkCard" href={`/category/${category.slug}`}>
                  <strong>{category.name}</strong><span>{category.description}</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="infoBlock siteMapGroup">
            <h2>전체 도구</h2>
            <div className="infoLinkGrid">
              {tools.map((tool) => (
                <Link key={tool.slug} className="infoLinkCard" href={`/tools/${tool.slug}`}>
                  <strong>{tool.title}</strong><span>{tool.shortDescription}</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="infoBlock siteMapGroup">
            <h2>사이트 안내</h2>
            <div className="infoLinkGrid">
              {infoLinks.map(([href, label]) => <Link key={href} className="infoLinkCard" href={href}><strong>{label}</strong><span>WEBTOOLS 운영 및 이용 안내</span></Link>)}
            </div>
          </section>
        </div>
        <div className="infoBack"><Link href="/">← 메인으로 돌아가기</Link></div>
      </div>
    </main>
  );
}
