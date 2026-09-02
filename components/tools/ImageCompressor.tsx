'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type OutputFormat = 'original' | 'image/webp' | 'image/jpeg';
type ResultItem = { name: string; originalSize: number; blob: Blob; url: string; width: number; height: number };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function extensionFor(type: string) {
  if (type === 'image/webp') return 'webp';
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  return 'img';
}

async function loadImage(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'));
      image.src = url;
    });
    return image;
  } finally {
    // The Image keeps decoded pixels after load, so the temporary source URL can be released.
    URL.revokeObjectURL(url);
  }
}

async function compressFile(file: File, quality: number, format: OutputFormat, maxWidth: number): Promise<ResultItem> {
  const image = await loadImage(file);
  const scale = maxWidth > 0 && image.naturalWidth > maxWidth ? maxWidth / image.naturalWidth : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('브라우저에서 이미지 처리를 시작할 수 없습니다.');

  const outputType = format === 'original'
    ? (file.type === 'image/jpeg' || file.type === 'image/webp' || file.type === 'image/png' ? file.type : 'image/webp')
    : format;

  if (outputType === 'image/jpeg') {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => value ? resolve(value) : reject(new Error('압축 결과를 만들지 못했습니다.')), outputType, quality / 100);
  });

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return {
    name: `${baseName}-compressed.${extensionFor(outputType)}`,
    originalSize: file.size,
    blob,
    url: URL.createObjectURL(blob),
    width,
    height,
  };
}

export default function ImageCompressor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState(78);
  const [format, setFormat] = useState<OutputFormat>('original');
  const [maxWidth, setMaxWidth] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);

  useEffect(() => () => { results.forEach((item) => URL.revokeObjectURL(item.url)); }, [results]);

  const totalOriginal = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);
  const totalCompressed = useMemo(() => results.reduce((sum, item) => sum + item.blob.size, 0), [results]);
  const savedPercent = totalOriginal > 0 && results.length > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).filter((file) => file.type.startsWith('image/'));
    setFiles(next);
    setError(next.length ? '' : '지원되는 이미지 파일을 선택해주세요.');
    setResults([]);
  };

  const run = async () => {
    if (!files.length) return;
    setWorking(true);
    setError('');
    setResults([]);
    try {
      const next: ResultItem[] = [];
      for (const file of files) next.push(await compressFile(file, quality, format, maxWidth));
      setResults(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 압축 중 오류가 발생했습니다.');
    } finally {
      setWorking(false);
    }
  };

  const downloadAll = () => {
    results.forEach((item, index) => {
      window.setTimeout(() => {
        const link = document.createElement('a');
        link.href = item.url;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, index * 120);
    });
  };

  return (
    <div className="compressorWorkspace">
      <div className="compressorIntro">
        <div><span className="engineBadge">브라우저 처리</span><h2>이미지를 선택하고 용량을 줄이세요</h2><p>파일은 서버로 전송하지 않고 현재 브라우저에서 바로 처리합니다.</p></div>
      </div>

      <div className="compressorGrid">
        <div className="compressorMain">
          <div
            className={`dropzone${dragging ? ' isDragging' : ''}`}
            role="button" tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}
            onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
          >
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(event) => addFiles(event.target.files)} />
            <span className="dropIcon" aria-hidden="true">＋</span>
            <strong>이미지를 여기에 놓거나 선택하세요</strong>
            <p>JPG, PNG, WebP · 여러 장 선택 가능</p>
            <span className="primaryButton fakeButton">이미지 선택</span>
          </div>

          {files.length > 0 && <div className="fileList">
            <div className="workspaceHead"><strong>선택한 이미지 {files.length}개</strong><button className="textButton" type="button" onClick={() => { setFiles([]); setResults([]); }}>전체 삭제</button></div>
            {files.map((file) => <div className="fileRow" key={`${file.name}-${file.lastModified}`}><span>{file.name}</span><small>{formatBytes(file.size)}</small></div>)}
          </div>}
        </div>

        <aside className="compressorSettings" aria-label="압축 설정">
          <h3>압축 설정</h3>
          <label className="settingField"><span>품질 <b>{quality}%</b></span><input type="range" min="20" max="95" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label>
          <label className="settingField"><span>출력 형식</span><select value={format} onChange={(event) => setFormat(event.target.value as OutputFormat)}><option value="original">원본 형식 유지</option><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option></select></label>
          <label className="settingField"><span>최대 가로폭</span><select value={maxWidth} onChange={(event) => setMaxWidth(Number(event.target.value))}><option value={0}>원본 크기 유지</option><option value={1920}>1920px</option><option value={1600}>1600px</option><option value={1280}>1280px</option><option value={960}>960px</option></select></label>
          <button type="button" className="primaryButton compressorRun" disabled={!files.length || working} onClick={run}>{working ? '압축 중…' : '이미지 압축하기'}</button>
          <p className="settingHint">PNG는 원본 형식을 유지하면 품질 슬라이더 효과가 제한적일 수 있습니다. 더 작은 용량이 필요하면 WebP를 선택하세요.</p>
        </aside>
      </div>

      {error && <div className="engineError" role="alert">{error}</div>}

      {results.length > 0 && <section className="resultPanel" aria-live="polite">
        <div className="resultSummary"><div><span>원본</span><strong>{formatBytes(totalOriginal)}</strong></div><div><span>압축 후</span><strong>{formatBytes(totalCompressed)}</strong></div><div><span>절감</span><strong>{savedPercent >= 0 ? `${savedPercent}%` : `+${Math.abs(savedPercent)}%`}</strong></div><button type="button" className="primaryButton" onClick={downloadAll}>모두 다운로드</button></div>
        <div className="resultList">{results.map((item) => {
          const saved = Math.round((1 - item.blob.size / item.originalSize) * 100);
          return <div className="resultRow" key={item.url}><div><strong>{item.name}</strong><small>{item.width} × {item.height}px</small></div><div className="resultSizes"><span>{formatBytes(item.originalSize)} → <b>{formatBytes(item.blob.size)}</b></span><small>{saved >= 0 ? `${saved}% 절감` : `${Math.abs(saved)}% 증가`}</small></div><a className="downloadButton" href={item.url} download={item.name}>다운로드</a></div>;
        })}</div>
      </section>}
    </div>
  );
}
