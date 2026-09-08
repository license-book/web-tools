import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '웹툴 소개',
  description: 'WEBTOOLS가 제공하는 무료 웹 도구와 서비스 운영 원칙을 소개합니다.',
};

export default function AboutPage() {
  return (
    <main className="infoPage">
      <section className="infoPageHero">
        <div className="infoPageHeroInner">
          <p className="infoPageEyebrow">ABOUT WEBTOOLS</p>
          <h1>웹툴 소개</h1>
          <p>복잡한 설치나 회원가입 없이, 필요한 작업을 브라우저에서 바로 처리할 수 있는 무료 웹 도구 모음입니다.</p>
        </div>
      </section>
      <div className="infoPageBody">
        <div className="infoCard">
          <section className="infoBlock">
            <h2>WEBTOOLS가 하는 일</h2>
            <p>이미지 압축·변환, PDF 편집, 텍스트 정리, 개발 보조, 디자인 변환 등 자주 필요한 작업을 한곳에서 빠르게 처리할 수 있도록 도구를 제공합니다.</p>
          </section>
          <section className="infoBlock">
            <h2>서비스 원칙</h2>
            <ul>
              <li>회원가입 없이 바로 사용할 수 있는 기능을 우선합니다.</li>
              <li>가능한 작업은 브라우저 안에서 처리해 불필요한 파일 전송을 줄입니다.</li>
              <li>사용법과 결과 의미를 함께 안내해 처음 쓰는 사용자도 쉽게 이해할 수 있도록 합니다.</li>
              <li>PC와 모바일에서 모두 편하게 사용할 수 있도록 반응형으로 구성합니다.</li>
            </ul>
          </section>
          <section className="infoBlock">
            <h2>앞으로의 방향</h2>
            <p>실제 사용 빈도가 높은 도구부터 지속적으로 추가하고, 같은 공통 구조를 활용해 더 빠르고 안정적으로 기능을 확장합니다.</p>
            <div className="infoCallout">일부 도구는 파일 형식이나 브라우저 환경에 따라 처리 결과가 달라질 수 있으므로 중요한 원본은 별도로 보관해 주세요.</div>
          </section>
        </div>
        <div className="infoBack"><Link href="/">← 메인으로 돌아가기</Link></div>
      </div>
    </main>
  );
}
