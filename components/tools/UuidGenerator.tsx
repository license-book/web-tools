'use client';

import { useState } from 'react';

function createUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [values, setValues] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const safeCount = Math.min(50, Math.max(1, Number(count) || 1));
    setCount(safeCount);
    setValues(Array.from({ length: safeCount }, createUuid));
    setCopied(false);
  }

  async function copyAll() {
    if (!values.length) return;
    try {
      await navigator.clipboard.writeText(values.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="workspace">
      <label className="settingField">
        <span>생성 개수 (1~50)</span>
        <input className="toolInput" type="number" min={1} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))} />
      </label>

      <div className="workspaceAction">
        <button className="primaryButton" type="button" onClick={generate}>UUID 생성</button>
        <button className="textButton" type="button" onClick={() => setValues([])} disabled={!values.length}>결과 지우기</button>
      </div>

      {values.length > 0 && (
        <div className="resultPanel">
          <div className="resultList">
            {values.map((value, index) => (
              <div className="resultRow" key={`${value}-${index}`}>
                <code>{value}</code>
                <button className="downloadButton" type="button" onClick={() => navigator.clipboard.writeText(value)}>복사</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="workspaceAction">
        <button className="primaryButton" type="button" onClick={copyAll} disabled={!values.length}>{copied ? '전체 복사됨' : '전체 복사'}</button>
        <span>RFC 4122 버전 4 형식 UUID를 브라우저에서 생성합니다.</span>
      </div>
    </div>
  );
}
