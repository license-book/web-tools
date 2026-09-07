import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTool, tools } from '@/data/tools';
import ToolShell from '@/components/tools/ToolShell';
import ToolWorkspace from '@/components/tools/ToolWorkspace';
import ImageCompressor from '@/components/tools/ImageCompressor';
import ImageConverter from '@/components/tools/ImageConverter';
import ImageResizer from '@/components/tools/ImageResizer';
import ImageToPdf from '@/components/tools/ImageToPdf';
import JsonFormatter from '@/components/tools/JsonFormatter';
import QrGenerator from '@/components/tools/QrGenerator';
import TextCleaner from '@/components/tools/TextCleaner';
import ColorConverter from '@/components/tools/ColorConverter';
import PdfMerger from '@/components/tools/PdfMerger';
import PdfSplitter from '@/components/tools/PdfSplitter';
import PdfToImage from '@/components/tools/PdfToImage';
import CharacterCounter from '@/components/tools/CharacterCounter';
import Base64Tool from '@/components/tools/Base64Tool';
import UuidGenerator from '@/components/tools/UuidGenerator';
import JwtDecoder from '@/components/tools/JwtDecoder';
import UrlCodec from '@/components/tools/UrlCodec';
import TimestampConverter from '@/components/tools/TimestampConverter';
import HashGenerator from '@/components/tools/HashGenerator';
import RegexTester from '@/components/tools/RegexTester';
import JsonYamlConverter from '@/components/tools/JsonYamlConverter';
import JsonCsvConverter from '@/components/tools/JsonCsvConverter';
import DiffChecker from '@/components/tools/DiffChecker';
import SqlFormatter from '@/components/tools/SqlFormatter';
import CronTool from '@/components/tools/CronTool';

export function generateStaticParams() { return tools.map((tool) => ({ slug: tool.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const tool = getTool(slug); if (!tool) return {}; return { title: tool.title, description: tool.description, keywords: tool.keywords }; }
export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const tool = getTool(slug); if (!tool) notFound();
  const workspaces: Record<string, React.ReactNode> = {
    'image-compressor': <ImageCompressor />,
    'image-converter': <ImageConverter />,
    'image-resizer': <ImageResizer />,
    'image-to-pdf': <ImageToPdf />,
    'json-formatter': <JsonFormatter />,
    'qr-generator': <QrGenerator />,
    'text-cleaner': <TextCleaner />,
    'color-converter': <ColorConverter />,
    'pdf-merge': <PdfMerger />,
    'pdf-split': <PdfSplitter />,
    'pdf-to-image': <PdfToImage />,
    'character-counter': <CharacterCounter />,
    'base64-tool': <Base64Tool />,
    'uuid-generator': <UuidGenerator />,
    'jwt-decoder': <JwtDecoder />,
    'url-codec': <UrlCodec />,
    'timestamp-converter': <TimestampConverter />,
    'hash-generator': <HashGenerator />,
    'regex-tester': <RegexTester />,
    'json-yaml-converter': <JsonYamlConverter />,
    'json-csv-converter': <JsonCsvConverter />,
    'diff-checker': <DiffChecker />,
    'sql-formatter': <SqlFormatter />,
    'cron-tool': <CronTool />,
  };
  const workspace = workspaces[tool.slug] ?? <ToolWorkspace tool={tool} />;
  return <ToolShell tool={tool}><div className="toolPanel"><div className="toolPanelHead"><div><span className="eyebrow darkEyebrow">TOOL WORKSPACE</span><h2>{tool.title}</h2></div><span className="privacyChip">브라우저 중심 처리</span></div>{workspace}</div></ToolShell>;
}
