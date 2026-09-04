'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

type PageSize = 'fit' | 'a4' | 'letter';
type Orientation = 'auto' | 'portrait' | 'landscape';
type Result = { url: string; size: number; pages: number };

const ACCEPTED = ['image/jpeg', 'image/png'];
const formatBytes = (bytes: number) => bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

export default function ImageToPdf() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('fit');
  const [orientation, setOrientation] = useState<Orientation>('auto');
  const [margin, setMargin] = useState(24);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  const clearResult = () => setResult(current => {
    if (current) URL.revokeObjectURL(current.url);
    return null;
  });

  const addFiles = (incoming: FileList | File[]) => {
    const next = Array.from(incoming).filter(file => ACCEPTED.includes(file.type));
    if (!next.length) { setError('JPG 또는 PNG 이미지만 선택할 수 있습니다.'); return; }
    clearResult();
    setError('');
    setFiles(prev => [...prev, ...next]);
  };

  const move = (index: number, direction: -1 | 1) => {
    clearResult();
    setFiles(prev => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const createPdf = async () => {
    if (!files.length) return;
    setWorking(true); setError(''); clearResult();
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const image = file.type === 'image/png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        let pageW = image.width;
        let pageH = image.height;

        if (pageSize !== 'fit') {
          const standard: [number, number] = pageSize === 'a4' ? [595.28, 841.89] : [612, 792];
          const landscape = orientation === 'landscape' || (orientation === 'auto' && image.width > image.height);
          [pageW, pageH] = landscape ? [standard[1], standard[0]] : standard;
        } else if (orientation !== 'auto') {
          const shouldLandscape = orientation === 'landscape';
          if ((shouldLandscape && pageW < pageH) || (!shouldLandscape && pageW > pageH)) [pageW, pageH] = [pageH, pageW];
        }

        const page = pdf.addPage([pageW, pageH]);
        const maxW = Math.max(1, pageW - margin * 2);
        const maxH = Math.max(1, pageH - margin * 2);
        const scale = Math.min(maxW / image.width, maxH / image.height, 1);
        const width = image.width * scale;
        const height = image.height * scale;
        page.drawImage(image, { x: (pageW - width) / 2, y: (pageH - height) / 2, width, height });
      }

      const bytes = await pdf.save();
      const buffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buffer).set(bytes);
      const blob = new Blob([buffer], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, pages: files.length });
    } catch {
      setError('PDF 변환 중 오류가 발생했습니다. 이미지 파일을 다시 확인해주세요.');
    } finally { setWorking(false); }
  };

  return <div className="compressorWorkspace">
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png" multiple hidden onChange={e => { if (e.target.files) addFiles(e.target.files); e.currentTarget.value = ''; }} />
    <div className="dropzone" role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
      <span className="dropIcon">+</span><strong>JPG·PNG 이미지를 추가하세요</strong><p>여러 이미지를 원하는 순서로 하나의 PDF로 만들 수 있습니다.</p><span className="primaryButton fakeButton">이미지 선택</span>
    </div>
    {!!files.length && <div className="fileList"><div className="workspaceHead"><strong>PDF 페이지 순서 · {files.length}장</strong><button className="textButton" onClick={() => { setFiles([]); clearResult(); }}>전체 삭제</button></div>{files.map((file, i) => <div className="fileRow" key={`${file.name}-${file.lastModified}-${i}`}><span>{i + 1}. {file.name}</span><small>{formatBytes(file.size)}</small><div><button className="textButton" disabled={i === 0} onClick={() => move(i, -1)}>위</button><button className="textButton" disabled={i === files.length - 1} onClick={() => move(i, 1)}>아래</button><button className="textButton" onClick={() => { clearResult(); setFiles(prev => prev.filter((_, index) => index !== i)); }}>삭제</button></div></div>)}</div>}
    {!!files.length && <div className="pdfSplitSettings"><div className="qrSettingGrid">
      <label className="settingField"><span>페이지 크기</span><select value={pageSize} onChange={e => { clearResult(); setPageSize(e.target.value as PageSize); }}><option value="fit">이미지 크기에 맞춤</option><option value="a4">A4</option><option value="letter">Letter</option></select></label>
      <label className="settingField"><span>방향</span><select value={orientation} onChange={e => { clearResult(); setOrientation(e.target.value as Orientation); }}><option value="auto">자동</option><option value="portrait">세로</option><option value="landscape">가로</option></select></label>
      <label className="settingField"><span>여백 <b>{margin}</b></span><input type="range" min="0" max="80" step="4" value={margin} onChange={e => { clearResult(); setMargin(Number(e.target.value)); }} /></label>
    </div><button className="primaryButton" disabled={working} onClick={createPdf}>{working ? 'PDF 만드는 중…' : '이미지를 PDF로 변환'}</button></div>}
    {error && <div className="engineError" role="alert">{error}</div>}
    {result && <div className="resultPanel"><div className="resultSummary"><div><span>페이지</span><strong>{result.pages}</strong></div><div><span>결과 용량</span><strong>{formatBytes(result.size)}</strong></div><a className="downloadButton" href={result.url} download="images-to-pdf.pdf">PDF 다운로드</a></div></div>}
  </div>;
}
