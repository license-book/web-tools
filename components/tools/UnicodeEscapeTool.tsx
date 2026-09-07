'use client';

import { useState } from 'react';

function encodeUnicode(input: string) {
  return Array.from(input).map((ch) => {
    const code = ch.codePointAt(0) ?? 0;
    if (code <= 0x7f) return ch;
    if (code <= 0xffff) return `\\u${code.toString(16).padStart(4,'0')}`;
    const offset = code - 0x10000;
    const high = 0xd800 + (offset >> 10);
    const low = 0xdc00 + (offset & 0x3ff);
    return `\\u${high.toString(16)}\\u${low.toString(16)}`;
  }).join('');
}

function decodeUnicode(input: string) {
  return input.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex,16)));
}

export default function UnicodeEscapeTool() {
  const [input, setInput] = useState('안녕하세요 👋');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const run = (mode: 'encode'|'decode') => {
    setError('');
    try { setOutput(mode === 'encode' ? encodeUnicode(input) : decodeUnicode(input)); }
    catch { setError('변환 중 오류가 발생했습니다.'); }
  };
  const copy = async () => { if (!output) return; try { await navigator.clipboard.writeText(output); } catch {} };
  return <div className="workspace">
    <textarea className="toolTextarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="텍스트 또는 \\uXXXX 형식을 입력하세요." />
    <div className="workspaceAction"><button className="primaryButton" type="button" onClick={() => run('encode')}>Unicode Escape 변환</button><button className="textButton" type="button" onClick={() => run('decode')}>원문으로 복원</button><button className="textButton" type="button" disabled={!output} onClick={copy}>결과 복사</button></div>
    {error && <div className="engineError">{error}</div>}
    <textarea className="toolTextarea" value={output} readOnly placeholder="변환 결과가 표시됩니다." />
    <p className="settingHint">JavaScript·JSON·로그에서 자주 보는 \\uXXXX 형식과 일반 텍스트를 서로 변환합니다.</p>
  </div>;
}
