'use client';

import { useState } from 'react';

const esc = (value: unknown) => {
  const text = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

function jsonToCsv(text: string) {
  const parsed = JSON.parse(text);
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  if (!rows.length || rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row))) throw new Error('객체 또는 객체 배열 형식의 JSON을 입력해 주세요.');
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  return [headers.map(esc).join(','), ...rows.map((row) => headers.map((key) => esc(row[key])).join(','))].join('\n');
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (quoted) throw new Error('닫히지 않은 따옴표가 있습니다.');
  if (field || row.length) { row.push(field.replace(/\r$/, '')); rows.push(row); }
  return rows.filter((r) => r.some((v) => v !== ''));
}

function csvToJson(text: string) {
  const rows = parseCsv(text);
  if (rows.length < 2) throw new Error('헤더와 최소 1개 데이터 행이 필요합니다.');
  const headers = rows[0].map((h) => h.trim());
  if (headers.some((h) => !h)) throw new Error('빈 헤더 이름이 있습니다.');
  const data = rows.slice(1).map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])));
  return JSON.stringify(data, null, 2);
}

export default function JsonCsvConverter() {
  const [mode, setMode] = useState<'json-csv' | 'csv-json'>('json-csv');
  const [source, setSource] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const convert = () => {
    setError('');
    try {
      if (!source.trim()) throw new Error('변환할 내용을 입력해 주세요.');
      setResult(mode === 'json-csv' ? jsonToCsv(source) : csvToJson(source));
    } catch (e) { setResult(''); setError(e instanceof Error ? e.message : '변환할 수 없습니다.'); }
  };
  const download = () => {
    if (!result) return;
    const ext = mode === 'json-csv' ? 'csv' : 'json';
    const blob = new Blob([mode === 'json-csv' ? '\uFEFF' + result : result], { type: mode === 'json-csv' ? 'text/csv;charset=utf-8' : 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `converted.${ext}`; a.click(); URL.revokeObjectURL(url);
  };
  return <div className="workspace">
    <div className="workspaceAction"><button className="primaryButton" type="button" onClick={() => setMode('json-csv')} disabled={mode === 'json-csv'}>JSON → CSV</button><button className="primaryButton" type="button" onClick={() => setMode('csv-json')} disabled={mode === 'csv-json'}>CSV → JSON</button></div>
    <div className="jsonEditorGrid"><div className="jsonPane"><span className="fieldLabel">입력</span><textarea className="toolTextarea jsonTextarea" value={source} onChange={(e) => setSource(e.target.value)} placeholder={mode === 'json-csv' ? '[{"name":"Kim","age":30}]' : 'name,age\nKim,30'} /></div><div className="jsonPane"><span className="fieldLabel">변환 결과</span><textarea className="toolTextarea jsonTextarea" value={result} readOnly /></div></div>
    {error && <div className="engineError">{error}</div>}
    <div className="workspaceAction"><button className="primaryButton" type="button" onClick={convert}>변환하기</button><button className="textButton" type="button" disabled={!result} onClick={() => navigator.clipboard.writeText(result)}>복사</button><button className="textButton" type="button" disabled={!result} onClick={download}>파일 저장</button></div>
  </div>;
}
