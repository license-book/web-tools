'use client';

import { useMemo, useState } from 'react';

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(text: string) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function renderMarkdown(source: string) {
  const safe = escapeHtml(source);
  const lines = safe.split(/\r?\n/);
  const out: string[] = [];
  let inUl = false;
  let inOl = false;
  for (const line of lines) {
    if (/^[-*] /.test(line)) {
      if (!inUl) { if (inOl) { out.push('</ol>'); inOl = false; } out.push('<ul>'); inUl = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`); continue;
    }
    if (/^\d+\. /.test(line)) {
      if (!inOl) { if (inUl) { out.push('</ul>'); inUl = false; } out.push('<ol>'); inOl = true; }
      out.push(`<li>${inline(line.replace(/^\d+\. /, ''))}</li>`); continue;
    }
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
    if (!line.trim()) { out.push('<br />'); continue; }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) { const n = heading[1].length; out.push(`<h${n}>${inline(heading[2])}</h${n}>`); continue; }
    if (/^>\s?/.test(line)) { out.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); continue; }
    out.push(`<p>${inline(line)}</p>`);
  }
  if (inUl) out.push('</ul>');
  if (inOl) out.push('</ol>');
  return out.join('');
}

export default function MarkdownPreview() {
  const [value, setValue] = useState('# Markdown 미리보기\n\n**굵게**, *기울임*, `코드`, 목록과 링크를 확인하세요.');
  const html = useMemo(() => renderMarkdown(value), [value]);
  return <div className="workspace">
    <div className="jsonEditorGrid">
      <div className="jsonPane"><span className="fieldLabel">Markdown</span><textarea className="toolTextarea jsonTextarea" value={value} onChange={(e) => setValue(e.target.value)} /></div>
      <div className="jsonPane"><span className="fieldLabel">미리보기</span><div style={{ minHeight: 380, padding: 16, lineHeight: 1.7, overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: html }} /></div>
    </div>
    <p className="settingHint">기본 Markdown 문법을 브라우저에서 빠르게 미리보는 용도입니다. 원본 HTML은 실행하지 않고 이스케이프합니다.</p>
  </div>;
}
