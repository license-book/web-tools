import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div className="footerGrid">
          <div className="footerBrandBlock">
            <Link href="/" className="footerBrand" aria-label="WEBTOOLS 홈">
              <span className="footerBrandKo">웹툴</span>
              <span className="footerBrandEn">WEBTOOLS</span>
            </Link>

            <p className="footerDescription">
              이미지, PDF, 텍스트, 개발·디자인 작업에 필요한 웹 도구를
              회원가입 없이 쉽고 빠르게 사용할 수 있도록 제공합니다.
            </p>

            <p className="footerNotice">
              파일 처리형 도구는 별도 안내가 없는 한 브라우저에서 처리되며,
              중요한 파일은 사용 전 원본을 별도로 보관해 주세요.
            </p>
          </div>

          <div className="footerColumn">
            <h3>웹 도구</h3>
            <nav className="footerNav" aria-label="웹 도구">
              <Link href="/category/image">이미지 도구</Link>
              <Link href="/category/pdf">PDF 도구</Link>
              <Link href="/category/text">텍스트 도구</Link>
              <Link href="/category/developer">개발 도구</Link>
              <Link href="/category/design">디자인 도구</Link>
              <Link href="/category/utility">기타 도구</Link>
            </nav>
          </div>

          <div className="footerColumn">
            <h3>사이트 안내</h3>
            <nav className="footerNav" aria-label="사이트 안내">
              <Link href="/about">웹툴 소개</Link>
              <Link href="/privacy">개인정보처리방침</Link>
              <Link href="/terms">이용약관</Link>
              <Link href="/disclaimer">정보 이용 안내</Link>
              <Link href="/site-map">사이트맵</Link>
              <Link href="/contact">문의</Link>
            </nav>
          </div>
        </div>

        <div className="footerBottom">
          <p className="footerCaution">
            웹 도구의 처리 결과는 입력 파일과 브라우저 환경에 따라 달라질 수 있습니다.
            중요한 작업에는 결과를 한 번 더 확인해 주세요.
          </p>

          <div className="footerCopyright">
            <span>© 2026 WEBTOOLS. All rights reserved.</span>
            <span>무료 웹 도구 서비스 · 대한민국</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
