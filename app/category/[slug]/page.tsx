import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { categories, getCategoryTools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};
  return { title: `${category.name} 도구`, description: category.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const categoryTools = getCategoryTools(slug);

  return (
    <main>
      <section className="categoryHero">
        <div className="container categoryHeroInner">
          <div>
            <nav className="breadcrumb" aria-label="현재 위치"><Link href="/">홈</Link><span>›</span><strong>{category.name}</strong></nav>
            <span className="eyebrow">TOOL CATEGORY</span>
            <h1>{category.name} 도구</h1>
            <p>{category.description}</p>
            <div className="trustRow"><span>✓ 무료</span><span>✓ 회원가입 없음</span><span>✓ 설치 없음</span><span>✓ 모바일 지원</span></div>
          </div>
          <div className="categoryStat"><strong>{categoryTools.length}</strong><span>현재 등록 도구</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHead">
            <div><span className="eyebrow darkEyebrow">AVAILABLE TOOLS</span><h2>{category.name} 전체 도구</h2></div>
            <span className="sectionCount">{categoryTools.length}개</span>
          </div>
          {categoryTools.length > 0 ? <div className="toolGrid">{categoryTools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div> : <div className="emptyState"><strong>도구를 준비하고 있습니다.</strong><p>공통엔진에 연결할 새 도구를 순차적으로 추가합니다.</p></div>}
        </div>
      </section>

      <section className="section altSection">
        <div className="container">
          <div className="sectionHead"><div><span className="eyebrow darkEyebrow">OTHER CATEGORIES</span><h2>다른 카테고리 둘러보기</h2></div></div>
          <div className="categoryLinks">{categories.filter((item) => item.slug !== slug).map((item) => <Link key={item.slug} href={`/category/${item.slug}`}><strong>{item.name}</strong><span>{item.description}</span></Link>)}</div>
        </div>
      </section>
    </main>
  );
}
