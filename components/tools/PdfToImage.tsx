'use client';

import { useEffect, useRef, useState } from 'react';

type OutputFormat = 'image/png' | 'image/jpeg';
type Result = { page: number; url: string; size: number; name: string };

const formatBytes = (bytes: number) => bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

export default function PdfToImage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>('image/png');
  const [scale, setScale] = useState(1.5);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<Result[]>([]);

  const clearResults = () => setResults(current => {
    current.forEach(item => URL.revokeObjectURL(item.url));
    return [];
  });

  useEffect(() => () => results.forEach(item => URL.revokeObjectURL(item.url)), [results]);

  const chooseFile = (candidate?: File) => {
    if (!candidate) return;
    if (!(candidate.type === 'application/pdf' || candidate.name.toLowerCase().endsWith('.pdf'))) {
      setError('PDF 파일을 선택해주세요.');
      return;
    }
    clearResults();
    setFile(candidate);
    setError('');
    setProgress('');
  };

  const convert = async () => {
    if (!file) { setError('PDF 파일을 먼저 선택해주세요.'); return; }
    setWorking(true); setError(''); setProgress('PDF를 불러오는 중…'); clearResults();
    try {
      const pdfjs = await import('pdfjs-dist');
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.mjs';
      }
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data }).promise;
      const converted: Result[] = [];
      const extension = format === 'image/png' ? 'png' : 'jpg';

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        setProgress(`${pageNumber} / ${pdf.numPages} 페이지 변환 중…`);
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas unavailable');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: context, viewport, canvas }).promise;
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(value => value ? resolve(value) : reject(new Error('Image conversion failed')), format, format === 'image/jpeg' ? 0.92 : undefined);
        });
        converted.push({ page: pageNumber, url: URL.createObjectURL(blob), size: blob.size, name: `${file.name.replace(/\.pdf$/i, '')}-${pageNumber}.${extension}` });
        page.cleanup();
      }
      setResults(converted);
      setProgress(`${converted.length}페이지 변환 완료`);
      await pdf.destroy();
    } catch {
      setProgress('');
      setError('PDF를 이미지로 변환하지 못했습니다. 암호가 설정되었거나 손상된 PDF인지 확인해주세요.');
    } finally { setWorking(false); }
  };

  const downloadAll = () => {
    results.forEach((item, index) => {
      window.setTimeout(() => {
        const anchor = document.createElement('a');
        anchor.href = item.url;
        anchor.download = item.name;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      }, index * 150);
    });
  };

  return <div className="compressorWorkspace pdfWorkspace">
    <div className="compressorIntro"><div><span className="engineBadge">브라우저 처리</span><h2>PDF 페이지를 이미지로 변환하세요</h2><p>PDF 파일은 서버에 업로드하지 않고 현재 브라우저에서 직접 처리합니다.</p></div></div>
    <div className="dropzone" role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); chooseFile(e.dataTransfer.files[0]); }}>
      <input ref={inputRef} hidden type="file" accept="application/pdf,.pdf" onChange={e => { chooseFile(e.target.files?.[0]); e.currentTarget.value = ''; }} />
      <span className="dropIcon">PDF</span><strong>{file ? file.name : 'PDF 파일을 선택하세요'}</strong><p>{file ? formatBytes(file.size) : '각 페이지를 PNG 또는 JPG 이미지로 변환합니다.'}</p><span className="primaryButton fakeButton">PDF 선택</span>
    </div>
    <div className="workspaceControls">
      <label><span>이미지 형식</span><select value={format} onChange={e => { clearResults(); setFormat(e.target.value as OutputFormat); }}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option></select></label>
      <label><span>해상도</span><select value={scale} onChange={e => { clearResults(); setScale(Number(e.target.value)); }}><option value={1}>기본</option><option value={1.5}>선명</option><option value={2}>고해상도</option></select></label>
    </div>
    <div className="workspaceAction"><button className="primaryButton" disabled={!file || working} onClick={convert}>{working ? '변환 중…' : 'PDF 이미지 변환'}</button></div>
    {progress && <div className="engineStatus">{progress}</div>}
    {error && <div className="engineError" role="alert">{error}</div>}
    {!!results.length && <div className="resultPanel"><div className="workspaceHead"><div><strong>변환 결과 · {results.length}개</strong><small>{format === 'image/png' ? 'PNG' : 'JPG'} 이미지</small></div><button className="downloadButton" type="button" onClick={downloadAll}>전체 다운로드</button></div><div className="fileList">{results.map(item => <div className="fileRow" key={item.page}><span>{item.page}페이지 · {item.name}</span><small>{formatBytes(item.size)}</small><a className="textButton" href={item.url} download={item.name}>다운로드</a></div>)}</div></div>}
  </div>;
}
