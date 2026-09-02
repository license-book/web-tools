import Link from 'next/link';
import type { ToolDefinition } from '@/types/tool';

export default function ToolCard({ tool }: { tool: ToolDefinition }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="toolCard">
      <div className="toolCardTop">
        <span className="toolIcon" aria-hidden>⌘</span>
        {tool.badge && <span className="badge">{tool.badge}</span>}
      </div>
      <h3>{tool.title}</h3>
      <p>{tool.shortDescription}</p>
    </Link>
  );
}
