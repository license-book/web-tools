'use client';

import { useMemo, useState } from 'react';

const rows = [
  ['html','text/html'],['css','text/css'],['js','text/javascript'],['json','application/json'],['xml','application/xml'],['txt','text/plain'],['csv','text/csv'],['pdf','application/pdf'],['zip','application/zip'],['png','image/png'],['jpg','image/jpeg'],['jpeg','image/jpeg'],['gif','image/gif'],['webp','image/webp'],['svg','image/svg+xml'],['ico','image/x-icon'],['mp3','audio/mpeg'],['wav','audio/wav'],['mp4','video/mp4'],['webm','video/webm'],['woff','font/woff'],['woff2','font/woff2'],['ttf','font/ttf'],['otf','font/otf'],['wasm','application/wasm'],['yaml','application/yaml'],['yml','application/yaml'],['md','text/markdown']
] as const;

export default function MimeTypeLookup() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\./, '');
    if (!q) return rows;
    return rows.filter(([ext, mime]) => ext.includes(q) || mime.toLowerCase().includes(q));
  }, [query]);
  const copy = async (value: string) => { try { await navigator.clipboard.writeText(value); } catch {} };
  return <div className="workspace">
    <input className="toolInput" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="확장자(.json) 또는 MIME Type을 검색하세요." />
    <div className="resultPanel">
      <div className="workspaceHead"><strong>MIME Type 목록</strong><span>{filtered.length}개 결과</span></div>
      <div className="resultList">{filtered.map(([ext, mime]) => <div className="resultRow" key={ext}><div><strong>.{ext}</strong><div style={{ color:'#64748b', fontSize:13, marginTop:4 }}>{mime}</div></div><button className="textButton" type="button" onClick={() => copy(mime)}>복사</button></div>)}</div>
    </div>
    <p className="settingHint">대표적으로 자주 쓰이는 확장자 기준의 빠른 조회표입니다.</p>
  </div>;
}
