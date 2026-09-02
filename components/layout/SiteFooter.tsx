import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div>
          <strong>WEBTOOLS</strong>
          <p>회원가입 없이 바로 쓰는 무료 웹 도구 모음</p>
        </div>
        <div className="footerLinks">
          <Link href="/about">소개</Link>
          <Link href="/privacy">개인정보처리방침</Link>
          <Link href="/contact">문의</Link>
        </div>
      </div>
    </footer>
  );
}
