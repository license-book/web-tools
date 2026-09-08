import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '정보 이용 안내',
  description: 'WEBTOOLS의 도구 결과와 정보 이용 시 확인해야 할 사항을 안내합니다.',
};

export default function DisclaimerPage() {
  return (
    <main className="infoPage">
      <section className="infoPageHero"><div className="infoPageHeroInner"><p className="infoPageEyebrow">INFORMATION GUIDE</p><h1>정보 이용 안내</h1><p>웹 도구의 처리 결과를 안전하게 활용하기 위해 확인해야 할 기본 사항입니다.</p></div></section>
      <div className="infoPageBody">
        <div className="infoCard">
          <section className="infoBlock"><h2>도구 결과는 확인이 필요합니다</h2><p>WEBTOOLS는 사용 편의를 위한 보조 도구를 제공합니다. 변환, 압축, 병합, 정리 등의 결과는 입력 파일의 상태와 브라우저 환경에 따라 달라질 수 있으므로 중요한 작업에는 최종 확인이 필요합니다.</p></section>
          <section className="infoBlock"><h2>전문적 판단을 대신하지 않습니다</h2><p>사이트의 설명과 결과는 법률, 세무, 의료, 보안, 전문 개발 검수 등 전문적인 자문이나 공식 인증을 대신하지 않습니다.</p></section>
          <section className="infoBlock"><h2>파일 보관과 백업</h2><p>변환이나 편집 전 원본 파일을 별도로 보관해 주세요. 특히 업무 문서, 계약 자료, 원본 이미지처럼 복구가 중요한 파일은 반드시 백업 후 사용하는 것을 권장합니다.</p></section>
          <section className="infoBlock"><h2>브라우저 및 기기 차이</h2><p>같은 기능이라도 브라우저 버전, 메모리, 파일 크기, 운영체제에 따라 속도나 지원 범위가 달라질 수 있습니다. 문제가 발생하면 최신 브라우저에서 다시 시도해 주세요.</p></section>
          <section className="infoBlock"><h2>외부 서비스</h2><p>외부 사이트 또는 제3자 서비스로 연결되는 경우 해당 서비스의 이용조건과 개인정보처리방침이 적용됩니다. 외부 서비스의 운영 내용은 WEBTOOLS가 직접 관리하지 않습니다.</p></section>
        </div>
        <div className="infoBack"><Link href="/">← 메인으로 돌아가기</Link></div>
      </div>
    </main>
  );
}
