'use client';

import { useMemo, useState } from 'react';

export default function CharacterCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const noSpaces = text.replace(/\s/g, '');
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const bytes = new TextEncoder().encode(text).length;
    return { chars: text.length, noSpaces: noSpaces.length, words, lines, bytes };
  }, [text]);

  async function copyText() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="workspace">
      <label className="settingField">
        <span>텍스트 입력</span>
        <textarea
          className="toolTextarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="글자 수를 확인할 텍스트를 입력하거나 붙여넣으세요."
        />
      </label>

      <div className="resultPanel">
        <div className="resultList">
          <div className="resultRow"><strong>공백 포함 글자 수</strong><span>{stats.chars.toLocaleString()}자</span></div>
          <div className="resultRow"><strong>공백 제외 글자 수</strong><span>{stats.noSpaces.toLocaleString()}자</span></div>
          <div className="resultRow"><strong>단어 수</strong><span>{stats.words.toLocaleString()}개</span></div>
          <div className="resultRow"><strong>줄 수</strong><span>{stats.lines.toLocaleString()}줄</span></div>
          <div className="resultRow"><strong>UTF-8 용량</strong><span>{stats.bytes.toLocaleString()} bytes</span></div>
        </div>
      </div>

      <div className="workspaceAction">
        <button className="primaryButton" type="button" onClick={copyText} disabled={!text}>{copied ? '복사됨' : '텍스트 복사'}</button>
        <button className="textButton" type="button" onClick={() => setText('')} disabled={!text}>전체 지우기</button>
        <span>입력 내용은 브라우저에서만 계산됩니다.</span>
      </div>
    </div>
  );
}
