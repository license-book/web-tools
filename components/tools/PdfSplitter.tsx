'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

type Result = { name: string; url: string; size: number; pages: number };

const formatBytes = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

function parsePages(value: string, total: number) {
  const pages = new Set<number>();
  for (const part of value.split(',').map((v) => v.trim()).filter(Boolean)) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number);
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a || b > total) throw new Error(`페이지 범위를 확인해 주세요. 1~${total} 사이로 입력할 수 있습니다.`);
      for (let i = a; i <= b; i++) pages.add(i - 1);
    } else {
      const page = Number(part);
      if (!Number.isInteger(page) || page < 1 || page > total) throw new Error(`페이지 번호를 확인해 주세요. 1~${total} 사이로 입력할 수 있습니다.`);
      pages.add(page - 1);
    }
  }
  if (!pages.size) throw new Error('추출할 페이지를 입력해 주세요. 예: 1-3, 5, 8');
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

  useEffect(() => () => results.forEach((r) => URL.revokeObjectURL(r.url)), [results]);

  const clearResults = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
  };

  const loadFile = async (next: File) => {
    if (next.type !== 'application/pdf' && !next.name.toLowerCase().endsWith('.pdf')) return setError('PDF 파일만 선택할 수 있습니다.');
    setError(''); clearResults();
    try {
      const doc = await PDFDocument.load(await next.arrayBuffer());
      setFile(next); setTotalPages(doc.getPageCount()); setRange(`1-${doc.getPageCount()}`);
    } catch { setError('PDF를 열 수 없습니다. 암호가 설정된 파일인지 확인해 주세요.'); }
  };

  const split = async () => {
    if (!file) return;
    setWorking(true); setError(''); clearResults();
    try {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const base = file.name.replace(/\.pdf$/i, '');
      const next: Result[] = [];
      if (mode === 'each') {
        for (let i = 0; i < source.getPageCount(); i++) {
          const doc = await PDFDocument.create();
          const [page] = await doc.copyPages(source, [i]); doc.addPage(page);
          const bytes = await doc.save(); const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
          next.push({ name: `${base}-page-${i + 1}.pdf`, url: URL.createObjectURL(blob), size: blob.size, pages: 1 });
        }
      } else {
        const indexes = parsePages(range, source.getPageCount());
        const doc = await PDFDocument.create();
        const pages = await doc.copyPages(source, indexes); pages.forEach((page) => doc.addPage(page));
        const bytes = await doc.save(); const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
        next.push({ name: `${base}-pages.pdf`, url: URL.createObjectURL(blob), size: blob.size, pages: indexes.length });
      }
      setResults(next);
    } catch (e) { setError(e instanceof Error ? e.message : 'PDF 분할 중 오류가 발생했습니다.'); }
    finally { setWorking(false); }
  };

  const downloadAll = () => results.forEach((r, i) => setTimeout(() => { const a = document.createElement('a'); a.href = r.url; a.download = r.name; a.click(); }, i * 140));

  return <div className="compressorWorkspace">
    <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])} />
    {!file ? <div className="dropzone" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && loadFile(e.dataTransfer.files[0]); }}>
      <span className="dropIcon">+</span><strong>분할할 PDF를 선택하세요</strong><p>파일을 끌어 놓거나 눌러서 선택할 수 있습니다.</p><span className="primaryButton fakeButton">PDF 선택</span>
    </div> : <>
      <div className="fileList"><div className="workspaceHead"><strong>선택한 PDF</strong><button className="textButton" onClick={() => { setFile(null); setTotalPages(0); clearResults(); }}>다른 파일 선택</button></div><div className="fileRow"><span>{file.name}</span><small>{totalPages}페이지 · {formatBytes(file.size)}</small></div></div>
      <div className="pdfSplitSettings">
        <div className="settingField"><span>분할 방식</span><select value={mode} onChange={(e) => setMode(e.target.value as 'range' | 'each')}><option value="range">원하는 페이지만 추출</option><option value="each">모든 페이지를 각각 분할</option></select></div>
        {mode === 'range' && <label className="settingField"><span>페이지 범위</span><input className="toolInput" value={range} onChange={(e) => setRange(e.target.value)} placeholder="예: 1-3, 5, 8" /><p className="settingHint">쉼표와 하이픈으로 페이지를 지정하세요. 전체 {totalPages}페이지입니다.</p></label>}
        <button className="primaryButton" disabled={working} onClick={split}>{working ? 'PDF 처리 중...' : mode === 'each' ? '페이지별로 분할' : '선택 페이지 추출'}</button>
      </div>
    </>}
    {error && <div className="engineError">{error}</div>}
    {!!results.length && <div className="resultPanel"><div className="workspaceHead"><strong>분할 완료 · {results.length}개 파일</strong>{results.length > 1 && <button className="primaryButton" onClick={downloadAll}>모두 다운로드</button>}</div><div className="resultList">{results.map((r) => <div className="resultRow" key={r.name}><div><strong>{r.name}</strong><small>{r.pages}페이지 · {formatBytes(r.size)}</small></div><a className="downloadButton" href={r.url} download={r.name}>다운로드</a></div>)}</div></div>}
  </div>;
}
