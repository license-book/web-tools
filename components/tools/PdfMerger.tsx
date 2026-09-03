'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';

type PdfItem = { id: string; file: File };
type MergeResult = { url: string; blob: Blob; pageCount: number };
const formatBytes = (bytes: number) => bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

export default function PdfMerger() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PdfItem[]>([]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<MergeResult | null>(null);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);
  const clearResult = () => setResult(current => { if (current) URL.revokeObjectURL(current.url); return null; });
  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const pdfs = Array.from(list).filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    if (!pdfs.length) { setError('PDF 파일을 선택해주세요.'); return; }
    setItems(current => [...current, ...pdfs.map(file => ({ id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`, file }))]); setError(''); clearResult();
  };
  const moveItem = (index: number, direction: -1 | 1) => { setItems(current => { const target=index+direction;if(target<0||target>=current.length)return current;const next=[...current];[next[index],next[target]]=[next[target],next[index]];return next;});clearResult(); };
  const removeItem = (id: string) => { setItems(current => current.filter(item => item.id !== id)); clearResult(); };
  const merge = async () => {
    if (items.length < 2) { setError('병합하려면 PDF 파일을 2개 이상 추가해주세요.'); return; }
    setWorking(true); setError(''); clearResult();
    try {
      const merged = await PDFDocument.create(); let pageCount=0;
      for (const item of items) { const source=await PDFDocument.load(await item.file.arrayBuffer(),{ignoreEncryption:false});const indices=source.getPageIndices();const pages=await merged.copyPages(source,indices);pages.forEach(page=>merged.addPage(page));pageCount+=indices.length; }
      const output=await merged.save(); const blob=new Blob([output as BlobPart],{type:'application/pdf'}); const url=URL.createObjectURL(blob); setResult({url,blob,pageCount});
    } catch (err) { const message=err instanceof Error?err.message:'';setError(/encrypt/i.test(message)?'암호로 보호된 PDF는 병합할 수 없습니다. 암호를 해제한 뒤 다시 시도해주세요.':'PDF 병합 중 오류가 발생했습니다. 손상되지 않은 PDF인지 확인해주세요.'); }
    finally { setWorking(false); }
  };
  const totalSize=items.reduce((sum,item)=>sum+item.file.size,0);
  return <div className="compressorWorkspace pdfWorkspace">
    <div className="compressorIntro"><div><span className="engineBadge">브라우저 처리</span><h2>여러 PDF를 원하는 순서로 하나로 합치세요</h2><p>파일은 서버로 업로드하지 않고 현재 브라우저에서 직접 병합합니다.</p></div></div>
    <div className="dropzone" role="button" tabIndex={0} onClick={()=>inputRef.current?.click()} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')inputRef.current?.click();}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();addFiles(e.dataTransfer.files);}}><input ref={inputRef} hidden multiple type="file" accept="application/pdf,.pdf" onChange={e=>{addFiles(e.target.files);e.currentTarget.value='';}}/><span className="dropIcon">PDF</span><strong>병합할 PDF를 추가하세요</strong><p>PDF 2개 이상 · 여러 번 추가 가능</p><span className="primaryButton fakeButton">PDF 선택</span></div>
    {items.length>0&&<div className="fileList pdfFileList"><div className="workspaceHead"><div><strong>병합 순서 · {items.length}개</strong><small>{formatBytes(totalSize)}</small></div><button className="textButton" type="button" onClick={()=>{setItems([]);clearResult();setError('');}}>전체 삭제</button></div>{items.map((item,index)=><div className="pdfFileRow" key={item.id}><span className="pdfOrder">{index+1}</span><div className="pdfFileInfo"><strong>{item.file.name}</strong><small>{formatBytes(item.file.size)}</small></div><div className="pdfRowActions"><button type="button" className="pdfMiniButton" disabled={index===0} onClick={()=>moveItem(index,-1)}>↑</button><button type="button" className="pdfMiniButton" disabled={index===items.length-1} onClick={()=>moveItem(index,1)}>↓</button><button type="button" className="pdfMiniButton remove" onClick={()=>removeItem(item.id)}>삭제</button></div></div>)}</div>}
    <div className="workspaceAction pdfMergeAction"><button className="primaryButton" type="button" disabled={working||items.length<2} onClick={merge}>{working?'PDF 병합 중…':'PDF 병합하기'}</button><span>목록의 위에서 아래 순서대로 병합됩니다.</span></div>
    {error&&<div className="engineError" role="alert">{error}</div>}
    {result&&<section className="resultPanel"><div className="resultSummary pdfResultSummary"><div><span>병합 완료</span><strong>{items.length}개 PDF</strong></div><div><span>총 페이지</span><strong>{result.pageCount}쪽</strong></div><div><span>결과 용량</span><strong>{formatBytes(result.blob.size)}</strong></div><a className="downloadButton" href={result.url} download="merged.pdf">병합 PDF 다운로드</a></div></section>}
    <p className="settingHint">암호로 보호된 PDF나 일부 특수 형식 PDF는 브라우저 병합이 제한될 수 있습니다.</p>
  </div>;
}
