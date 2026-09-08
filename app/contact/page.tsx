import type { Metadata } from 'next';
import Link from 'next/link';

const CONTACT_EMAIL = 'licensebook@gmail.com';

export const metadata: Metadata = {
  title: '문의',
  description: 'WEBTOOLS 사이트 이용, 오류 제보, 기능 제안 및 기타 문의 안내입니다.',
};

export default function ContactPage() {
  return (
    <main className="infoPage">
      <section className="infoPageHero"><div className="infoPageHeroInner"><p className="infoPageEyebrow">CONTACT</p><h1>문의</h1><p>사이트 이용 중 발견한 오류, 기능 제안, 기타 문의사항을 이메일로 보내주세요.</p></div></section>
      <div className="infoPageBody">
        <div className="infoCard">
          <section className="infoBlock">
            <h2>이메일 문의</h2>
            <p>아래 이메일 주소를 누르면 메일 앱을 열 수 있습니다.</p>
            <p style={{ marginTop: 12 }}><a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#315efb', fontWeight: 900, fontSize: 18 }}>{CONTACT_EMAIL}</a></p>
          </section>
          <section className="infoBlock">
            <h2>문의 시 함께 알려주세요</h2>
            <div className="contactOptions">
              <div className="contactOption"><strong>도구 오류 제보</strong><span>도구 이름, 문제가 발생한 브라우저·기기, 재현 과정을 알려주세요.</span></div>
              <div className="contactOption"><strong>기능 제안</strong><span>필요한 도구 이름과 어떤 작업을 해결하고 싶은지 알려주세요.</span></div>
              <div className="contactOption"><strong>결과 이상</strong><span>개인정보나 민감한 원본 파일은 첨부하지 말고 증상 위주로 설명해 주세요.</span></div>
              <div className="contactOption"><strong>기타 문의</strong><span>확인이 필요한 페이지 주소와 문의 내용을 구체적으로 적어주세요.</span></div>
            </div>
            <div className="infoCallout">보내주신 문의는 내용을 확인한 뒤 필요한 경우 이메일로 답변드립니다. 비밀번호, 주민등록번호, 금융정보 등 민감한 개인정보는 보내지 마세요.</div>
          </section>
        </div>
        <div className="infoBack"><Link href="/">← 메인으로 돌아가기</Link></div>
      </div>
    </main>
  );
}
