import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTool, tools } from '@/data/tools';
import ToolShell from '@/components/tools/ToolShell';

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return { title: tool.title, description: tool.description, keywords: tool.keywords };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <ToolShell tool={tool}>
      <div className="toolPanel">
        <div className="placeholderBox">
          <div>
            <strong>{tool.title} 실행 영역</strong>
            <p>V1 공통엔진 연결 완료. 다음 단계에서 실제 처리 엔진을 이 영역에 장착합니다.</p>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
