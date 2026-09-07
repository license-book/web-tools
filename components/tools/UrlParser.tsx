'use client';

import { useMemo, useState } from 'react';

export default function UrlParser() {
  const [value, setValue] = useState('https://example.com:8080/path/page?foo=bar&lang=ko#section');
  const parsed = useMemo(() => {
    try {
      const url = new URL(value);
      return { url, error: '' };
    } catch {
      return { url: null, error: '올바른 전체 URL을 입력하세요. 예: https://example.com/path?key=value' };
    }
  }, [value]);

  const rows = parsed.url ? [
    ['프로토콜', parsed.url.protocol],
    ['호스트', parsed.url.host],
    ['호스트명', parsed.url.hostname],
    ['포트', parsed.url.port || '(기본 포트)'],
    ['경로', parsed.url.pathname],
    ['쿼리', parsed.url.search || '(없음)'],
    ['해시', parsed.url.hash || '(없음)'],
    ['Origin', parsed.url.origin],
  ] : [];

  return <div className="workspace">
    <label className="settingField"><span>URL</span><input className="toolInput" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://example.com/path?foo=bar" /></label>
    {parsed.error && <div className="engineError">{parsed.error}</div>}
    {parsed.url && <>
      <div className="resultPanel">
        <div className="workspaceHead"><strong>URL 구성요소</strong><span>{parsed.url.hostname}</span></div>
        <div className="resultList">{rows.map(([label, data]) => <div className="resultRow" key={label}><div><strong>{label}</strong><div style={{ marginTop: 5, color: '#64748b', wordBreak: 'break-all' }}>{data}</div></div><button className="textButton" type="button" onClick={() => navigator.clipboard.writeText(data)}>복사</button></div>)}</div>
      </div>
      <div className="resultPanel">
        <div className="workspaceHead"><strong>Query Parameters</strong><span>{Array.from(parsed.url.searchParams.keys()).length}개</span></div>
        <div className="resultList">{Array.from(parsed.url.searchParams.entries()).length ? Array.from(parsed.url.searchParams.entries()).map(([key, data], i) => <div className="resultRow" key={`${key}-${i}`}><div><strong>{key}</strong><div style={{ marginTop: 5, color: '#64748b', wordBreak: 'break-all' }}>{data}</div></div><button className="textButton" type="button" onClick={() => navigator.clipboard.writeText(data)}>값 복사</button></div>) : <div style={{ padding: 16, color: '#64748b' }}>쿼리 파라미터가 없습니다.</div>}</div>
      </div>
    </>}
  </div>;
}
