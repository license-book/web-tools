'use client';

import { useEffect, useRef, useState } from 'react';

type OutputFormat = 'png' | 'jpeg';
type Result = { name: string; url: string; size: number; width: number; height: number; page: number };

const formatBytes = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

function parsePages(value: string, total: number) {
  const pages = new Set<number>();
  for (const part of value.split(',').map((v) => v.trim()).filter(Boolean)) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number);
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a || b > total) throw new Error(`페이지 범위를 확인해 주세요. 1~${total} 사이로 입력할 수 있습니다.`);
      for (let i = a; i <= b; i++) pages.add(i);
    } else {
      const page = Number(part);
      if (!Number.isInteger(page) || page < 1 || page > total) throw new Error(`페이지 번호를 확인해 주세요. 1~${total} 사이로 입력할 수 있습니다.`);
      pages.add(page);
    }
  }
  if (!pages.size) throw new Error('변환할 페이지를 입력해 주세요. 예: 1-3, 5');
  return [...pages].sort((a, b) => a - b);
}

export default function PdfToImage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pages, setPages] = useState('');
  const [format, setFormat] = useState<OutputFormat>('png');
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(90);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => () => results.forEach((r) => URL.revokeObjectURL(r.url)), [results]);

  const clearResults = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);
  };

  const loadPdfJs = async () => {
    const pdfjs = await import('pdfjs-dist');
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    }
    return pdfjs;
  };

  const selectFile = async (next: File) => {
    if (next.type !== 'application/pdf' && !next.name.toLowerCase().endsWith('.pdf')) return setError('PDF 파일만 선택할 수 있습니다.');
    setError(''); clearResults();
    try {
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await next.arrayBuffer()) }).promise;
      setFile(next); setTotalPages(doc.numPages); setPages(`1-${doc.numPages}`);
      await doc.destroy();
    } catch { setError('PDF를 열 수 없습니다. 암호가 설정된 파일인지 확인해 주세요.'); }
  };

  const convert = async () => {
    if (!file) return;
    setWorking(true); setError(''); clearResults();
    try {
      const pageNumbers = parsePages(pages, totalPages);
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const base = file.name.replace(/\.pdf$/i, '');
      const next: Result[] = [];
      for (const pageNumber of pageNumbers) {
        const page = await doc.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('이미지 변환을 위한 Canvas를 사용할 수 없습니다.');
        canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: context, viewport }).promise;
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error('이미지 생성에 실패했습니다.')), mime, format === 'jpeg' ? quality / 100 : undefined));
        next.push({ name: `${base}-page-${pageNumber}.${format === 'jpeg' ? 'jpg' : 'png'}`, url: URL.createObjectURL(blob), size: blob.size, width: canvas.width, height: canvas.height, page: pageNumber });
        page.cleanup();
      }
      await doc.destroy();
      setResults(next);
    } catch (e) { setError(e instanceof Error ? e.message : 'PDF 이미지 변환 중 오류가 발생했습니다.'); }
    finally { setWorking(false); }
  };

  const downloadAll = () => results.forEach((r, i) => setTimeout(() => { const a = document.createElement('a'); a.href = r.url; a.download = r.name; a.click(); }, i * 140));

  return <div className="compressorWorkspace">
    <input ref={inputRef} type="file" accept="application/pdf,.pdf" hidden onChange={(e) => e.target.files?.[0] && selectFile(e.target.files[0])} />
    {!file ? <div className="dropzone" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && selectFile(e.dataTransfer.files[0]); }}>
      <span className="dropIcon">+</span><strong>이미지로 변환할 PDF를 선택하세요</strong><p>PDF 페이지를 PNG 또는 JPG 이미지로 변환합니다.</p><span className="primaryButton fakeButton">PDF 선택</span>
    </div> : <>
      <div className="fileList"><div className="workspaceHead"><strong>선택한 PDF</strong><button className="textButton" onClick={() => { setFile(null); setTotalPages(0); clearResults(); }}>다른 파일 선택</button></div><div className="fileRow"><span>{file.name}</span><small>{totalPages}페이지 · {formatBytes(file.size)}</small></div></div>
      <div className="compressorGrid"><div className="compressorMain"><label className="settingField"><span>변환할 페이지</span><input className="toolInput" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="예: 1-3, 5" /><p className="settingHint">전체 {totalPages}페이지 · 쉼표와 하이픈으로 범위를 지정할 수 있습니다.</p></label></div><div className="compressorSettings">
        <h3>변환 설정</h3>
        <label className="settingField"><span>이미지 형식</span><select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}><option value="png">PNG</option><option value="jpeg">JPG</option></select></label>
        <label className="settingField"><span>해상도 <b>{scale}x</b></span><input type="range" min="1" max="3" step="0.5" value={scale} onChange={(e) => setScale(Number(e.target.value))} /></label>
        {format === 'jpeg' && <label className="settingField"><span>JPG 품질 <b>{quality}%</b></span><input type="range" min="50" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} /></label>}
        <button className="primaryButton compressorRun" disabled={working} onClick={convert}>{working ? '페이지 변환 중...' : '이미지로 변환'}</button>
        <p className="settingHint">높은 해상도는 선명하지만 처리 시간과 파일 용량이 늘어납니다.</p>
      </div></div>
    </>}
    {error && <div className="engineError">{error}</div>}
    {!!results.length && <div className="resultPanel"><div className="workspaceHead"><strong>변환 완료 · {results.length}장</strong>{results.length > 1 && <button className="primaryButton" onClick={downloadAll}>모두 다운로드</button>}</div><div className="resultList">{results.map((r) => <div className="resultRow" key={r.name}><div><strong>{r.name}</strong><small>{r.width}×{r.height}px · {formatBytes(r.size)}</small></div><a className="downloadButton" href={r.url} download={r.name}>다운로드</a></div>)}</div></div>}
  </div>;
}
