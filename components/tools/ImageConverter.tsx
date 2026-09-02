'use client';

import { useEffect, useRef, useState } from 'react';

type Format = 'image/webp' | 'image/jpeg' | 'image/png';
type Result = { name: string; url: string; blob: Blob; width: number; height: number };

const ext = (type: Format) => type === 'image/webp' ? 'webp' : type === 'image/jpeg' ? 'jpg' : 'png';
const bytes = (n: number) => n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`;

async function convert(file: File, format: Format, quality: number): Promise<Result> {
  const source = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.')); image.src = source; });
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('이미지 변환을 시작할 수 없습니다.');
    if (format === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(image, 0, 0);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(v => v ? resolve(v) : reject(new Error('변환 결과를 만들지 못했습니다.')), format, quality / 100));
    return { name: `${file.name.replace(/\.[^.]+$/, '') || 'image'}.${ext(format)}`, url: URL.createObjectURL(blob), blob, width: canvas.width, height: canvas.height };
  } finally { URL.revokeObjectURL(source); }
}

export default function ImageConverter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]); const [format, setFormat] = useState<Format>('image/webp'); const [quality, setQuality] = useState(88);
  const [results, setResults] = useState<Result[]>([]); const [working, setWorking] = useState(false); const [error, setError] = useState('');
  useEffect(() => () => results.forEach(r => URL.revokeObjectURL(r.url)), [results]);
  const add = (list: FileList | null) => { const next = list ? Array.from(list).filter(f => f.type.startsWith('image/')) : []; setFiles(next); setResults([]); setError(next.length ? '' : '이미지 파일을 선택해주세요.'); };
  const run = async () => { setWorking(true); setError(''); setResults([]); try { const next: Result[] = []; for (const file of files) next.push(await convert(file, format, quality)); setResults(next); } catch(e) { setError(e instanceof Error ? e.message : '변환 중 오류가 발생했습니다.'); } finally { setWorking(false); } };
  const downloadAll = () => results.forEach((r,i) => setTimeout(() => { const a=document.createElement('a'); a.href=r.url; a.download=r.name; document.body.appendChild(a); a.click(); a.remove(); }, i*120));
  return <div className="compressorWorkspace">
    <div className="compressorIntro"><div><span className="engineBadge">브라우저 처리</span><h2>이미지 형식을 바로 변환하세요</h2><p>JPG, PNG, WebP 이미지를 선택해 원하는 형식으로 변환합니다.</p></div></div>
    <div className="compressorGrid"><div className="compressorMain">
      <div className="dropzone" role="button" tabIndex={0} onClick={()=>inputRef.current?.click()} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')inputRef.current?.click();}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();add(e.dataTransfer.files);}}><input ref={inputRef} hidden multiple type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>add(e.target.files)}/><span className="dropIcon">↔</span><strong>변환할 이미지를 선택하세요</strong><p>JPG, PNG, WebP · 여러 장 선택 가능</p><span className="primaryButton fakeButton">이미지 선택</span></div>
      {files.length>0&&<div className="fileList"><div className="workspaceHead"><strong>선택한 이미지 {files.length}개</strong><button className="textButton" type="button" onClick={()=>{setFiles([]);setResults([]);}}>전체 삭제</button></div>{files.map(f=><div className="fileRow" key={`${f.name}-${f.lastModified}`}><span>{f.name}</span><small>{bytes(f.size)}</small></div>)}</div>}
    </div><aside className="compressorSettings"><h3>변환 설정</h3><label className="settingField"><span>출력 형식</span><select value={format} onChange={e=>setFormat(e.target.value as Format)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select></label><label className="settingField"><span>품질 <b>{quality}%</b></span><input type="range" min="30" max="100" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></label><button className="primaryButton compressorRun" type="button" disabled={!files.length||working} onClick={run}>{working?'변환 중…':'이미지 변환하기'}</button><p className="settingHint">PNG 출력에는 품질 값의 영향이 제한적입니다. 용량 절감이 목적이면 WebP를 권장합니다.</p></aside></div>
    {error&&<div className="engineError">{error}</div>}
    {results.length>0&&<section className="resultPanel"><div className="resultSummary"><div><span>완료</span><strong>{results.length}개</strong></div><div><span>출력 형식</span><strong>{ext(format).toUpperCase()}</strong></div><button className="primaryButton" type="button" onClick={downloadAll}>모두 다운로드</button></div><div className="resultList">{results.map(r=><div className="resultRow" key={r.url}><div><strong>{r.name}</strong><small>{r.width} × {r.height}px</small></div><div className="resultSizes"><b>{bytes(r.blob.size)}</b></div><a className="downloadButton" href={r.url} download={r.name}>다운로드</a></div>)}</div></section>}
  </div>;
}
