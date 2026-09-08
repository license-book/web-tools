import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: 'WEBTOOLS의 개인정보 처리 원칙과 파일 처리 방식에 대해 안내합니다.',
};

export default function PrivacyPage() {
  return (
    <main className="infoPage">
      <section className="infoPageHero"><div className="infoPageHeroInner"><p className="infoPageEyebrow">PRIVACY POLICY</p><h1>개인정보처리방침</h1><p>WEBTOOLS는 필요한 정보만 최소한으로 처리하고, 브라우저 내 처리가 가능한 기능은 로컬 처리를 우선합니다.</p></div></section>
      <div className="infoPageBody">
        <div className="infoCard">
          <section className="infoBlock">
            <h2>1. 기본 원칙</h2>
            <p>WEBTOOLS는 회원가입을 요구하지 않으며, 일반적인 도구 이용 과정에서 이름·주소·전화번호와 같은 직접 식별 정보를 별도로 수집하도록 설계하지 않습니다.</p>
          </section>
          <section className="infoBlock">
            <h2>2. 파일 및 입력 데이터 처리</h2>
            <p>별도 안내가 없는 파일 처리형 도구는 브라우저에서 동작하도록 구성됩니다. 이러한 경우 사용자가 선택한 파일이나 입력 내용은 도구 실행을 위해 사용자의 기기 안에서 처리됩니다.</p>
            <p>향후 서버 처리가 필요한 기능이 추가되는 경우에는 해당 도구 화면에서 처리 방식과 필요한 범위를 별도로 안내합니다.</p>
          </section>
          <section className="infoBlock">
            <h2>3. 자동 수집 정보</h2>
            <p>서비스 안정성 확인, 방문 통계, 광고 제공 등을 위해 브라우저 정보, 접속 일시, 페이지 이용 기록, 쿠키와 유사한 기술이 사용될 수 있습니다. 실제 적용되는 외부 서비스가 있는 경우 해당 사업자의 정책이 함께 적용될 수 있습니다.</p>
          </section>
          <section className="infoBlock">
            <h2>4. 쿠키와 광고</h2>
            <p>향후 광고 또는 분석 서비스가 적용될 경우 쿠키를 통해 맞춤형 또는 비맞춤형 광고가 제공될 수 있습니다. 사용자는 브라우저 설정에서 쿠키 저장을 제한하거나 삭제할 수 있습니다.</p>
          </section>
          <section className="infoBlock">
            <h2>5. 외부 링크</h2>
            <p>WEBTOOLS에서 외부 사이트로 이동한 이후의 개인정보 처리는 해당 외부 서비스의 정책을 따릅니다.</p>
          </section>
          <section className="infoBlock">
            <h2>6. 방침 변경</h2>
            <p>서비스 기능이나 관련 법령 변경에 따라 본 방침이 수정될 수 있으며, 중요한 변경 사항은 이 페이지를 통해 안내합니다.</p>
            <div className="infoMeta">시행일: 2026년 9월 9일</div>
          </section>
        </div>
        <div className="infoBack"><Link href="/">← 메인으로 돌아가기</Link></div>
      </div>
    </main>
  );
}
