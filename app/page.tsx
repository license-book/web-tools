import Link from 'next/link';
import { categories, tools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container heroInner">
          <span className="eyebrow">FREE WEB TOOLS</span>
          <h1>필요한 웹 작업을<br />빠르고 간단하게</h1>
          <p>이미지, PDF, 텍스트, 개발, 디자인 도구를 회원가입 없이 바로 사용하세요.</p>
          <div className="searchMock">도구를 검색하세요 <span>⌕</span></div>
          <div className="trustRow"><span>✓ 무료</span><span>✓ 회원가입 없음</span><span>✓ 설치 없음</span><span>✓ 모바일 지원</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sectionHead"><div><span className="eyebrow">CATEGORIES</span><h2>카테고리별 도구</h2></div></div>
          <div className="categoryGrid">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} className="categoryCard" key={category.slug}>
                <strong>{category.name}</strong><p>{category.description}</p><span>도구 보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section altSection">
        <div className="container">
          <div className="sectionHead"><div><span className="eyebrow">POPULAR TOOLS</span><h2>주요 웹 도구</h2></div></div>
          <div className="toolGrid">{tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
        </div>
      </section>
    </main>
  );
}
