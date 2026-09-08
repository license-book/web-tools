import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ToolDefinition } from '@/types/tool';
import { getTool } from '@/data/tools';

const categoryGuides: Record<ToolDefinition['category'], { useCases: string[]; tips: string[]; privacy: string }> = {
  image: {
    useCases: ['웹사이트·블로그에 올릴 이미지를 빠르게 정리할 때', 'SNS·문서·업로드 규격에 맞게 이미지를 준비할 때', '별도 프로그램 설치 없이 간단한 이미지 작업이 필요할 때'],
    tips: ['중요한 원본 이미지는 별도로 보관한 뒤 결과 파일을 확인하세요.', '변환이나 압축 후에는 해상도와 화질이 용도에 맞는지 확인하는 것이 좋습니다.'],
    privacy: '이미지 도구는 가능한 작업을 브라우저 안에서 처리하는 방식으로 구성해 불필요한 파일 전송을 줄입니다.',
  },
  pdf: {
    useCases: ['PDF의 페이지 구성이나 순서를 빠르게 정리할 때', '필요한 페이지만 추출하거나 새 문서로 저장할 때', '별도 PDF 편집 프로그램 없이 간단한 문서 작업이 필요할 때'],
    tips: ['중요 문서는 원본을 보관한 뒤 새로 저장된 PDF를 확인하세요.', '암호화되거나 특수한 구조의 PDF는 브라우저 처리에 제한이 있을 수 있습니다.'],
    privacy: 'PDF 도구는 가능한 작업을 브라우저 안에서 처리해 문서가 외부로 전송되는 상황을 줄이는 방향으로 구성합니다.',
  },
  text: {
    useCases: ['문서나 게시물 작성 전에 텍스트를 빠르게 정리할 때', '반복 작업을 줄이고 원하는 형태로 문자열을 가공할 때', '복사한 텍스트의 공백·목록·형식을 손쉽게 다듬을 때'],
    tips: ['중요한 원문은 변환 전에 복사해 두면 결과를 비교하기 쉽습니다.', '자동 변환 결과는 최종 사용 전에 한 번 확인하는 것을 권장합니다.'],
    privacy: '텍스트 도구는 입력 내용을 가능한 브라우저에서 직접 처리하도록 구성합니다.',
  },
  developer: {
    useCases: ['개발 중 데이터 형식이나 값을 빠르게 확인할 때', '반복적인 인코딩·변환·포맷 작업을 줄이고 싶을 때', '간단한 검사 때문에 별도 개발 환경을 열 필요가 없을 때'],
    tips: ['운영 환경의 비밀키·토큰·개인정보는 테스트 입력값으로 사용하지 마세요.', '생성·변환 결과는 실제 시스템에 적용하기 전에 요구 형식과 다시 대조하세요.'],
    privacy: '개발 도구는 가능한 계산과 변환을 브라우저에서 수행하지만 민감한 운영 정보는 입력하지 않는 것을 권장합니다.',
  },
  design: {
    useCases: ['웹·앱 디자인 값을 빠르게 계산하거나 비교할 때', 'CSS 값을 만들면서 결과를 즉시 확인하고 싶을 때', '색상·비율·간격 등 반복 계산을 줄이고 싶을 때'],
    tips: ['생성된 값은 프로젝트의 디자인 시스템과 함께 검토하세요.', '접근성이 중요한 색상 조합은 실제 화면에서도 대비와 가독성을 확인하세요.'],
    privacy: '디자인 계산과 값 생성은 가능한 브라우저 안에서 처리하도록 구성합니다.',
  },
  utility: {
    useCases: ['일상에서 자주 필요한 계산이나 생성을 빠르게 처리할 때', '회원가입이나 프로그램 설치 없이 바로 결과가 필요할 때', 'PC와 모바일에서 간단한 작업을 즉시 해결하고 싶을 때'],
    tips: ['결과가 중요한 의사결정에 사용된다면 원자료와 조건을 다시 확인하세요.', '도구의 결과는 입력한 값과 브라우저 환경에 따라 달라질 수 있습니다.'],
    privacy: '일반 유틸리티는 가능한 계산과 생성을 브라우저에서 처리하는 방향으로 구성합니다.',
  },
};

export default function ToolShell({ tool, children }: { tool: ToolDefinition; children: ReactNode }) {
  const guide = categoryGuides[tool.category];
  const useCases = tool.useCases?.length ? tool.useCases : guide.useCases;
  const steps = tool.steps?.length ? tool.steps : ['필요한 파일이나 값을 입력합니다.', `${tool.title} 기능을 실행합니다.`, '화면에 표시된 결과를 확인하고 필요한 경우 저장하거나 복사합니다.'];
  const tips = tool.tips?.length ? tool.tips : guide.tips;
  const limitations = tool.limitations ?? [];
  const privacyNote = tool.privacyNote ?? guide.privacy;
  const faq = tool.faq?.length ? tool.faq : [
    { question: '회원가입이 필요한가요?', answer: '아니요. 별도의 회원가입 없이 바로 사용할 수 있습니다.' },
    { question: '모바일에서도 사용할 수 있나요?', answer: '네. PC와 모바일 브라우저에서 사용할 수 있도록 구성되어 있습니다.' },
    { question: '결과를 사용할 때 확인할 점이 있나요?', answer: '중요한 작업이라면 원본을 보관하고 최종 결과가 원하는 조건과 일치하는지 한 번 확인하는 것을 권장합니다.' },
  ];
  const related = (tool.relatedSlugs ?? []).map(getTool).filter((item): item is ToolDefinition => Boolean(item));

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

      <section className="infoSection toolGuideSection">
        <div className="container">
          <div className="toolGuideIntro">
            <span className="eyebrow darkEyebrow">GUIDE</span>
            <h2>{tool.title}, 이렇게 활용해보세요</h2>
            <p>{tool.shortDescription} 필요한 작업만 빠르게 처리하고 결과를 바로 확인할 수 있도록 구성한 무료 웹 도구입니다.</p>
          </div>

          <div className="infoGrid toolInfoGrid">
            <article>
              <h2>이럴 때 유용해요</h2>
              <ul>{useCases.map(item => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <h2>사용 방법</h2>
              <ol>{steps.map((item, index) => <li key={item}><strong>{index + 1}</strong><span>{item}</span></li>)}</ol>
            </article>
            <article>
              <h2>사용 팁</h2>
              <ul>{tips.map(item => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>

          <div className="toolNoticeGrid">
            <article className="toolNoticeCard">
              <h2>개인정보·파일 처리 안내</h2>
              <p>{privacyNote}</p>
            </article>
            <article className="toolNoticeCard">
              <h2>사용 전 확인하세요</h2>
              {limitations.length ? <ul>{limitations.map(item => <li key={item}>{item}</li>)}</ul> : <p>브라우저 환경, 파일 구조, 입력값에 따라 처리 결과가 달라질 수 있습니다. 중요한 원본은 별도로 보관하고 결과를 확인한 뒤 사용하세요.</p>}
            </article>
          </div>

          <div className="toolFaqSection">
            <div className="toolSectionHeading"><span className="eyebrow darkEyebrow">FAQ</span><h2>자주 묻는 질문</h2></div>
            <div className="toolFaqList">
              {faq.map(item => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}
            </div>
          </div>

          {related.length > 0 && <div className="toolRelatedSection">
            <div className="toolSectionHeading"><span className="eyebrow darkEyebrow">RELATED TOOLS</span><h2>함께 사용하면 좋은 도구</h2></div>
            <div className="toolRelatedGrid">
              {related.map(item => <Link key={item.slug} href={`/tools/${item.slug}`}><strong>{item.title}</strong><span>{item.shortDescription}</span></Link>)}
            </div>
          </div>}
        </div>
      </section>
    </main>
  );
}
