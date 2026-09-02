import type { Metadata } from 'next';
import './globals.css';
import './tool-engine.css';
import './tool-workspace.css';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: { default: 'WEBTOOLS | 무료 웹 도구', template: '%s | WEBTOOLS' },
  description: '이미지, PDF, 텍스트, 개발, 디자인 작업을 회원가입 없이 빠르게 처리하는 무료 웹 도구 모음',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
