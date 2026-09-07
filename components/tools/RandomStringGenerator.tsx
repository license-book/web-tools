'use client';

import { useMemo, useState } from 'react';

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
};

function secureString(length: number, chars: string) {
  if (!chars) return '';
  const out: string[] = [];
  const max = Math.floor(256 / chars.length) * chars.length;
  while (out.length < length) {
    const buf = new Uint8Array(Math.max(16, length - out.length));
    crypto.getRandomValues(buf);
    for (const value of buf) {
      if (value >= max) continue;
      out.push(chars[value % chars.length]);
      if (out.length === length) break;
    }
  }
  return out.join('');
}

export default function RandomStringGenerator() {
  const [length, setLength] = useState(20);
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [nonce, setNonce] = useState(0);
  const chars = useMemo(() => `${upper ? SETS.upper : ''}${lower ? SETS.lower : ''}${numbers ? SETS.numbers : ''}${symbols ? SETS.symbols : ''}`, [upper, lower, numbers, symbols]);
  const values = useMemo(() => {
    if (!chars) return [];
    const safeLength = Math.max(4, Math.min(256, length || 4));
    const safeCount = Math.max(1, Math.min(50, count || 1));
    return Array.from({ length: safeCount }, () => secureString(safeLength, chars));
  }, [chars, length, count, nonce]);

  return <div className="workspace">
    <div className="jsonEditorGrid">
      <label className="settingField"><span>문자열 길이</span><input className="toolInput" type="number" min={4} max={256} value={length} onChange={(e) => setLength(Number(e.target.value))} /></label>
      <label className="settingField"><span>생성 개수</span><input className="toolInput" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} /></label>
    </div>
    <div className="resultPanel" style={{ padding: 16 }}>
      <strong>포함할 문자</strong>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
        <label><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} /> 대문자</label>
        <label><input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} /> 소문자</label>
        <label><input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> 숫자</label>
        <label><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> 특수문자</label>
      </div>
    </div>
    {!chars && <div className="engineError">최소 하나의 문자 종류를 선택하세요.</div>}
    <textarea className="toolTextarea" style={{ minHeight: 260 }} value={values.join('\n')} readOnly />
    <div className="workspaceAction"><span>Web Crypto 보안 난수 사용</span><button className="textButton" type="button" onClick={() => setNonce((n) => n + 1)}>다시 생성</button><button className="primaryButton" type="button" disabled={!values.length} onClick={() => navigator.clipboard.writeText(values.join('\n')).catch(() => undefined)}>전체 복사</button></div>
  </div>;
}
