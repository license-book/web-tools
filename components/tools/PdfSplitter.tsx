'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

type Result = { name: string; url: string; size: number; pages: number };

const formatBytes = (bytes: number) => bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

function toBlob(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: 'application/pdf' });
}

function parsePages(value: string, total: number) {
  const pages = new Set<number>();
  for (const part of value.split(',').map(v => v.trim()).filter(Boolean)) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > total) throw new Error(`페이지 범위는 1~${total} 사이로 입력해주세요.`);
      for (let i = start; i <= end; i++) pages.add(i - 1);
    } else {
      const page = Number(part);
      if (!Number.isInteger(page) || page < 1 || page > total) throw new Error(`페이지 번호는 1~${total} 사이로 입력해주세요.`);
      pages.add(page - 1);
    }
  }
  if (!pages.size) throw new Error('추출할 페이지를 입력해주세요. 예: 1-3, 5, 8');
  return [...pages].sort((a, b) => a - b);
}

export default function PdfSplitter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [range, setRange] = useState('');
  const [mode, setMode] = useState<'range' | 'each'>('range');
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => () => { results.forEach(result => URL.revokeObjectURL(result.url)); }, [results]);

  const clearResults = () => setResults(current => {
    current.forEach(result => URL.revokeObjectURL(result.url));
    return [];
  });

  const loadFile = async (next: File) => {
    if (next.type !== 'application/pdf' && !next.name.toLowerCase().endsWith('.pdf')) { setError('PDF 파일만 선택할 수 있습니다.'); return; }
    setError(''); clearResults();
    try {
      const doc = await PDFDocument.load(await next.arrayBuffer());
      const pages = doc.getPageCount();
      setFile(next); setTotalPages(pages); setRange(`1-${pages}`);
    } catch { setError('PDF를 열 수 없습니다. 암호가 설정되었거나 손상된 파일인지 확인해주세요.'); }
  };

  const split = async () => {
    if (!file) return;
    setWorking(true); setError(''); clearResults();
    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const baseName = file.name.replace(/\.pdf$/i, '');
      const next: Result[] = [];
      if (mode === 'each') {
        for (let index = 0; index < source.getPageCount(); index++) {
          const output = await PDFDocument.create();
          const [page] = await output.copyPages(source, [index]);
          output.addPage(page);
          const blob = toBlob(await output.save());
          next.push({ name: `${baseName}-page-${index + 1}.pdf`, url: URL.createObjectURL(blob), size: blob.size, pages: 1 });
        }
      } else {
        const indexes = parsePages(range, source.getPageCount());
        const output = await PDFDocument.create();
        const pages = await output.copyPages(source, indexes);
        pages.forEach(page => output.addPage(page));
        const blob = toBlob(await output.save());
        next.push({ name: `${baseName}-pages.pdf`, url: URL.createObjectURL(blob), size: blob.size, pages: indexes.length });
      }
      setResults(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'PDF 분할 중 오류가 발생했습니다.');
    } finally { setWorking(false); }
  };

  const downloadAll = () => results.forEach((result, index) => setTimeout(() => {
    const link = document.createElement('a');
    link.href = result.url; link.download = result.name; link.click();
  }, index * 150));

  return <div className="compressorWorkspace pdfWorkspace">
    <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={e => { const next = e.target.files?.[0]; if (next) loadFile(next); e.currentTarget.value = ''; }} />
    {!file ? <div className="dropzone" role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const next = e.dataTransfer.files[0]; if (next) loadFile(next); }}>
      <span className="dropIcon">PDF</span><strong>분할할 PDF를 선택하세요</strong><p>원하는 페이지만 추출하거나 모든 페이지를 각각 나눌 수 있습니다.</p><span className="primaryButton fakeButton">PDF 선택</span>
    </div> : <>
      <div className="fileList"><div className="workspaceHead"><div><strong>선택한 PDF</strong><small>{totalPages}페이지 · {formatBytes(file.size)}</small></div><button className="textButton" onClick={() => { setFile(null); setTotalPages(0); clearResults(); }}>다른 파일 선택</button></div><div className="fileRow"><span>{file.name}</span></div></div>
      <div className="pdfSplitSettings">
        <label className="settingField"><span>분할 방식</span><select value={mode} onChange={e => { setMode(e.target.value as 'range' | 'each'); clearResults(); }}><option value="range">원하는 페이지만 추출</option><option value="each">모든 페이지를 각각 분할</option></select></label>
        {mode === 'range' && <label className="settingField"><span>페이지 범위</span><input className="toolInput" value={range} onChange={e => setRange(e.target.value)} placeholder="예: 1-3, 5, 8" /><p className="settingHint">쉼표와 하이픈으로 지정 · 전체 {totalPages}페이지</p></label>}
        <button className="primaryButton" disabled={working} onClick={split}>{working ? 'PDF 처리 중…' : mode === 'each' ? '페이지별로 분할' : '선택 페이지 추출'}</button>
      </div>
    </>}
    {error && <div className="engineError" role="alert">{error}</div>}
    {!!results.length && <div className="resultPanel"><div className="workspaceHead"><strong>분할 완료 · {results.length}개 파일</strong>{results.length > 1 && <button className="primaryButton" onClick={downloadAll}>모두 다운로드</button>}</div><div className="resultList">{results.map(result => <div className="resultRow" key={result.name}><div><strong>{result.name}</strong><small>{result.pages}페이지 · {formatBytes(result.size)}</small></div><a className="downloadButton" href={result.url} download={result.name}>다운로드</a></div>)}</div></div>}
  </div>;
}
