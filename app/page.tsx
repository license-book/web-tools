import Link from 'next/link';
import { categories, tools } from '@/data/tools';
import ToolCard from '@/components/tools/ToolCard';
import ToolSearch from '@/components/search/ToolSearch';

const categoryIcons: Record<string, string> = {
  image: 'IMG', pdf: 'PDF', text: 'TXT', developer: '</>', design: 'UI', utility: '＋',
};

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="heroGlow heroGlowOne" aria-hidden="true" />
        <div className="heroGlow heroGlowTwo" aria-hidden="true" />
        <div className="container heroInner">
          <span className="eyebrow heroEyebrow">FREE WEB TOOLS</span>
          <h1>필요한 웹 작업을<br /><span>빠르고 간단하게</span></h1>
          <p>이미지, PDF, 텍스트, 개발, 디자인 작업을 회원가입과 설치 없이 바로 처리하세요.</p>
          <div className="heroSearch"><ToolSearch /></div>
          <div className="trustRow"><span>✓ 무료</span><span>✓ 회원가입 없음</span><span>✓ 설치 없음</span><span>✓ 모바일 지원</span></div>
        </div>
      </section>

      <section className="section categorySection">
        <div className="container">
          <div className="sectionHead"><div><span className="eyebrow darkEyebrow">CATEGORIES</span><h2>카테고리별 도구</h2><p>작업 목적에 맞는 도구를 빠르게 찾아보세요.</p></div></div>
          <div className="categoryGrid">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} className="categoryCard" key={category.slug}>
                <span className={`categoryIcon categoryIcon-${category.slug}`}>{categoryIcons[category.slug]}</span>
                <div><strong>{category.name}</strong><p>{category.description}</p></div>
                <span className="cardArrow">전체 보기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section altSection">
        <div className="container">
          <div className="sectionHead"><div><span className="eyebrow darkEyebrow">POPULAR TOOLS</span><h2>주요 웹 도구</h2><p>공통엔진에 연결되는 도구는 같은 구조로 빠르게 확장됩니다.</p></div></div>
          <div className="toolGrid">{tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
        </div>
      </section>

      <section className="promiseSection">
        <div className="container promiseGrid">
          <div><strong>01</strong><h3>바로 사용</h3><p>로그인이나 복잡한 설정 없이 필요한 기능부터 실행합니다.</p></div>
          <div><strong>02</strong><h3>브라우저 중심 처리</h3><p>가능한 도구는 사용자 기기 안에서 처리하는 방향으로 설계합니다.</p></div>
          <div><strong>03</strong><h3>반응형 웹</h3><p>PC와 모바일 모두 같은 기능을 편하게 사용할 수 있게 만듭니다.</p></div>
        </div>
      </section>
    </main>
  );
}
