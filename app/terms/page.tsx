import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관',
  description: 'WEBTOOLS 서비스 이용 조건과 사용자 책임에 대해 안내합니다.',
};

export default function TermsPage() {
  return (
    <main className="infoPage">
      <section className="infoPageHero"><div className="infoPageHeroInner"><p className="infoPageEyebrow">TERMS OF USE</p><h1>이용약관</h1><p>WEBTOOLS를 이용할 때 필요한 기본 조건과 서비스 제공 범위를 안내합니다.</p></div></section>
      <div className="infoPageBody">
        <div className="infoCard">
          <section className="infoBlock"><h2>1. 목적</h2><p>본 약관은 WEBTOOLS가 제공하는 웹 기반 도구 서비스의 이용 조건과 사용자 및 서비스 운영자 간의 기본적인 권리와 책임을 정하는 것을 목적으로 합니다.</p></section>
          <section className="infoBlock"><h2>2. 서비스 이용</h2><p>WEBTOOLS는 회원가입 없이 무료로 사용할 수 있는 도구를 중심으로 제공합니다. 일부 기능은 브라우저 성능, 파일 크기, 파일 형식 또는 기기 환경에 따라 제한될 수 있습니다.</p></section>
          <section className="infoBlock"><h2>3. 사용자 책임</h2><ul><li>사용자는 자신이 처리할 권한이 있는 파일과 데이터만 이용해야 합니다.</li><li>불법적인 목적, 타인의 권리 침해, 시스템 장애 유발을 위한 이용은 허용되지 않습니다.</li><li>중요한 파일은 도구 사용 전 원본을 별도로 보관하는 것을 권장합니다.</li></ul></section>
          <section className="infoBlock"><h2>4. 결과의 확인</h2><p>도구가 생성한 결과는 입력값과 브라우저 환경에 따라 달라질 수 있습니다. 업무 제출, 계약, 인쇄, 개발 배포 등 중요한 용도로 사용하기 전에는 결과를 직접 확인해야 합니다.</p></section>
          <section className="infoBlock"><h2>5. 서비스 변경 및 중단</h2><p>기능 개선, 오류 수정, 보안, 기술적 사유 등에 따라 일부 도구가 변경되거나 일시적으로 제공되지 않을 수 있습니다.</p></section>
          <section className="infoBlock"><h2>6. 지식재산권</h2><p>WEBTOOLS의 사이트 구성, 디자인, 자체 작성 콘텐츠와 프로그램 요소에 대한 권리는 관련 법령의 보호를 받습니다. 사용자가 업로드하거나 입력한 원본 콘텐츠의 권리는 해당 사용자 또는 정당한 권리자에게 있습니다.</p></section>
          <section className="infoBlock"><h2>7. 약관 변경</h2><p>서비스 운영 환경이나 관련 법령 변경에 따라 본 약관은 수정될 수 있으며 변경 내용은 이 페이지를 통해 안내합니다.</p><div className="infoMeta">시행일: 2026년 9월 9일</div></section>
        </div>
        <div className="infoBack"><Link href="/">← 메인으로 돌아가기</Link></div>
      </div>
    </main>
  );
}
