import type { ReactNode } from 'react';
import type { ToolDefinition } from '@/types/tool';

export default function ToolShell({ tool, children }: { tool: ToolDefinition; children: ReactNode }) {
  return (
    <main>
      <section className="toolHero">
        <div className="container">
          <span className="eyebrow">무료 웹 도구</span>
          <h1>{tool.title}</h1>
          <p>{tool.description}</p>
          <div className="trustRow"><span>✓ 무료</span><span>✓ 회원가입 없음</span><span>✓ 빠른 처리</span><span>✓ 모바일 지원</span></div>
        </div>
      </section>
      <section className="toolBody"><div className="container">{children}</div></section>
      <section className="infoSection">
        <div className="container infoGrid">
          <article><h2>사용 방법</h2><p>파일이나 값을 입력한 뒤 실행 버튼을 누르면 결과를 바로 확인할 수 있도록 구성됩니다.</p></article>
          <article><h2>개인정보 안내</h2><p>가능한 도구는 브라우저 내부에서 처리해 업로드 부담을 줄이는 방향으로 개발합니다.</p></article>
          <article><h2>FAQ</h2><p>도구별 지원 형식, 제한, 결과 저장 방법을 상세페이지에서 안내합니다.</p></article>
        </div>
      </section>
    </main>
  );
}
