'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tools } from '@/data/tools';

export default function ToolSearch({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tools.filter((tool) => [tool.title, tool.shortDescription, ...tool.keywords].join(' ').toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const go = (slug: string) => {
    setQuery('');
    onNavigate?.();
    router.push(`/tools/${slug}`);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (matches[0]) go(matches[0].slug);
  };

  return (
    <div className={`toolSearch ${compact ? 'toolSearchCompact' : ''}`}>
      <form onSubmit={submit} className="toolSearchForm">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="도구를 검색하세요" aria-label="도구 검색" autoComplete="off" />
        <button type="submit" aria-label="검색">⌕</button>
      </form>
      {query.trim() && (
        <div className="searchDropdown">
          {matches.length ? matches.map((tool) => (
            <button type="button" key={tool.slug} onClick={() => go(tool.slug)}>
              <strong>{tool.title}</strong><span>{tool.shortDescription}</span>
            </button>
          )) : <div className="searchEmpty">일치하는 도구가 없습니다.</div>}
        </div>
      )}
    </div>
  );
}
