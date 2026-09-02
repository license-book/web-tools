import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTool, tools } from '@/data/tools';
import ToolShell from '@/components/tools/ToolShell';
import ToolWorkspace from '@/components/tools/ToolWorkspace';
import ImageCompressor from '@/components/tools/ImageCompressor';
import ImageConverter from '@/components/tools/ImageConverter';
import ImageResizer from '@/components/tools/ImageResizer';
import JsonFormatter from '@/components/tools/JsonFormatter';
import QrGenerator from '@/components/tools/QrGenerator';

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

  const workspace = tool.slug === 'image-compressor'
    ? <ImageCompressor />
    : tool.slug === 'image-converter'
      ? <ImageConverter />
      : tool.slug === 'image-resizer'
        ? <ImageResizer />
        : tool.slug === 'json-formatter'
          ? <JsonFormatter />
          : tool.slug === 'qr-generator'
            ? <QrGenerator />
            : <ToolWorkspace tool={tool} />;

  return (
    <ToolShell tool={tool}>
      <div className="toolPanel">
        <div className="toolPanelHead">
          <div>
            <span className="eyebrow darkEyebrow">TOOL WORKSPACE</span>
            <h2>{tool.title}</h2>
          </div>
          <span className="privacyChip">브라우저 중심 처리</span>
        </div>
        {workspace}
      </div>
    </ToolShell>
  );
}
