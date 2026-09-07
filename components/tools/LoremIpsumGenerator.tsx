'use client';

import { useMemo, useState } from 'react';

const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function sentence(wordCount: number, offset: number) {
  const words = Array.from({ length: wordCount }, (_, i) => WORDS[(offset + i) % WORDS.length]);
  const text = words.join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

export default function LoremIpsumGenerator() {
  const [mode, setMode] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const output = useMemo(() => {
    const safe = Math.max(1, Math.min(50, count || 1));
    if (mode === 'words') return Array.from({ length: safe }, (_, i) => WORDS[i % WORDS.length]).join(' ');
    if (mode === 'sentences') return Array.from({ length: safe }, (_, i) => sentence(10 + (i % 5), i * 7)).join(' ');
    return Array.from({ length: safe }, (_, p) => Array.from({ length: 4 }, (_, s) => sentence(11 + ((p + s) % 5), (p * 29) + (s * 9))).join(' ')).join('\n\n');
  }, [mode, count]);

  return <div className="workspace">
    <div className="jsonEditorGrid">
      <label className="settingField"><span>생성 단위</span><select className="toolInput" value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}><option value="paragraphs">문단</option><option value="sentences">문장</option><option value="words">단어</option></select></label>
      <label className="settingField"><span>개수</span><input className="toolInput" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} /></label>
    </div>
    <textarea className="toolTextarea" style={{ minHeight: 320 }} value={output} readOnly />
    <div className="workspaceAction"><span>{output.length.toLocaleString()}자</span><button className="primaryButton" type="button" onClick={() => navigator.clipboard.writeText(output).catch(() => undefined)}>전체 복사</button></div>
  </div>;
}
