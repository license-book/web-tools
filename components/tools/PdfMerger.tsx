'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

type Item = { id: string; file: File };
type Result = { url: string; size: number; pages: number };

const formatBytes = (bytes: number) => bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

export default function PdfMerger() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  const clearResult = () => setResult(current => {
    if (current) URL.revokeObjectURL(current.url);
    return null;
  });

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const pdfs = Array.from(list).filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    if (!pdfs.length) { setError('PDF 파일을 선택해주세요.'); return; }
    clearResult();
    setError('');
    setItems(current => [...current, ...pdfs.map(file => ({ id: crypto.randomUUID(), file }))]);
  };

  const move = (index: number, direction: -1 | 1) => {
    clearResult();
    setItems(current => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const merge = async () => {
    if (items.length < 2) { setError('PDF 파일을 2개 이상 추가해주세요.'); return; }
    setWorking(true); setError(''); clearResult();
    try {
      const outputDoc = await PDFDocument.create();
      let pages = 0;
      for (const item of items) {
        const source = await PDFDocument.load(await item.file.arrayBuffer());
        const indices = source.getPageIndices();
        const copied = await outputDoc.copyPages(source, indices);
        copied.forEach(page => outputDoc.addPage(page));
        pages += indices.length;
      }
      const bytes = await outputDoc.save();
      const buffer = new ArrayBuffer(bytes.byteLength);
      new Uint8Array(buffer).set(bytes);
      const blob = new Blob([buffer], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, pages });
    } catch {
      setError('PDF 병합에 실패했습니다. 암호가 설정되었거나 손상된 파일인지 확인해주세요.');
    } finally { setWorking(false); }
  };

  return <div className="compressorWorkspace pdfWorkspace">
    <div className="compressorIntro"><div><span className="engineBadge">브라우저 처리</span><h2>여러 PDF를 하나로 합치세요</h2><p>파일은 서버에 저장하지 않고 현재 브라우저에서 직접 병합합니다.</p></div></div>
    <div className="dropzone" role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
      <input ref={inputRef} hidden multiple type="file" accept="application/pdf,.pdf" onChange={e => { addFiles(e.target.files); e.currentTarget.value = ''; }} />
      <span className="dropIcon">PDF</span><strong>병합할 PDF를 추가하세요</strong><p>2개 이상의 PDF를 원하는 순서로 합칠 수 있습니다.</p><span className="primaryButton fakeButton">PDF 선택</span>
    </div>
    {!!items.length && <div className="fileList"><div className="workspaceHead"><div><strong>병합 순서 · {items.length}개</strong><small>{formatBytes(items.reduce((sum, item) => sum + item.file.size, 0))}</small></div><button className="textButton" type="button" onClick={() => { setItems([]); clearResult(); }}>전체 삭제</button></div>{items.map((item, index) => <div className="fileRow" key={item.id}><span>{index + 1}. {item.file.name}</span><small>{formatBytes(item.file.size)}</small><div><button className="textButton" disabled={index === 0} onClick={() => move(index, -1)}>위</button><button className="textButton" disabled={index === items.length - 1} onClick={() => move(index, 1)}>아래</button><button className="textButton" onClick={() => { clearResult(); setItems(current => current.filter(x => x.id !== item.id)); }}>삭제</button></div></div>)}</div>}
    <div className="workspaceAction"><button className="primaryButton" disabled={working || items.length < 2} onClick={merge}>{working ? 'PDF 병합 중…' : 'PDF 병합하기'}</button></div>
    {error && <div className="engineError" role="alert">{error}</div>}
    {result && <div className="resultPanel"><div className="resultSummary"><div><span>총 페이지</span><strong>{result.pages}쪽</strong></div><div><span>결과 용량</span><strong>{formatBytes(result.size)}</strong></div><a className="downloadButton" href={result.url} download="merged.pdf">병합 PDF 다운로드</a></div></div>}
  </div>;
}
