'use client';

import { useEffect, useRef, useState } from 'react';

type Result = { name: string; url: string; blob: Blob; width: number; height: number; originalWidth: number; originalHeight: number };

const formatBytes = (bytes: number) => bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(2)} MB`;

function extension(type: string) {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/png') return 'png';
  return 'png';
}

async function resizeImage(file: File, targetWidth: number, targetHeight: number, keepRatio: boolean, quality: number): Promise<Result> {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'));
      image.src = sourceUrl;
    });

    let width = Math.max(1, Math.round(targetWidth));
    let height = Math.max(1, Math.round(targetHeight));
    if (keepRatio) {
      const ratio = image.naturalWidth / image.naturalHeight;
      if (targetWidth > 0) {
        width = Math.max(1, Math.round(targetWidth));
        height = Math.max(1, Math.round(width / ratio));
      } else {
        height = Math.max(1, Math.round(targetHeight));
        width = Math.max(1, Math.round(height * ratio));
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('브라우저에서 이미지 크기 조정을 시작할 수 없습니다.');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, 0, 0, width, height);

    const outputType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' ? file.type : 'image/png';
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(value => value ? resolve(value) : reject(new Error('리사이즈 결과를 만들지 못했습니다.')), outputType, quality / 100);
    });
    const base = file.name.replace(/\.[^.]+$/, '') || 'image';
    return {
      name: `${base}-${width}x${height}.${extension(outputType)}`,
      url: URL.createObjectURL(blob),
      blob,
      width,
      height,
      originalWidth: image.naturalWidth,
      originalHeight: image.naturalHeight,
    };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export default function ImageResizer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [keepRatio, setKeepRatio] = useState(true);
  const [quality, setQuality] = useState(90);
  const [results, setResults] = useState<Result[]>([]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => results.forEach(result => URL.revokeObjectURL(result.url)), [results]);

  const addFiles = (list: FileList | null) => {
    const next = list ? Array.from(list).filter(file => file.type.startsWith('image/')) : [];
    setFiles(next);
    setResults([]);
    setError(next.length ? '' : '이미지 파일을 선택해주세요.');
  };

  const run = async () => {
    if (!files.length || width < 1 || (!keepRatio && height < 1)) return;
    setWorking(true);
    setError('');
    setResults([]);
    try {
      const next: Result[] = [];
      for (const file of files) next.push(await resizeImage(file, width, height, keepRatio, quality));
      setResults(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 크기 조정 중 오류가 발생했습니다.');
    } finally {
      setWorking(false);
    }
  };

  const downloadAll = () => results.forEach((result, index) => {
    window.setTimeout(() => {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }, index * 120);
  });

  return (
    <div className="compressorWorkspace">
      <div className="compressorIntro"><div><span className="engineBadge">브라우저 처리</span><h2>이미지 크기를 원하는 픽셀로 바꾸세요</h2><p>원본 비율 유지 여부를 선택하고 여러 이미지를 한 번에 리사이즈할 수 있습니다.</p></div></div>
      <div className="compressorGrid">
        <div className="compressorMain">
          <div className="dropzone" role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); addFiles(event.dataTransfer.files); }}>
            <input ref={inputRef} hidden multiple type="file" accept="image/jpeg,image/png,image/webp" onChange={event => addFiles(event.target.files)} />
            <span className="dropIcon">↔</span><strong>크기를 바꿀 이미지를 선택하세요</strong><p>JPG, PNG, WebP · 여러 장 선택 가능</p><span className="primaryButton fakeButton">이미지 선택</span>
          </div>
          {files.length > 0 && <div className="fileList"><div className="workspaceHead"><strong>선택한 이미지 {files.length}개</strong><button className="textButton" type="button" onClick={() => { setFiles([]); setResults([]); }}>전체 삭제</button></div>{files.map(file => <div className="fileRow" key={`${file.name}-${file.lastModified}`}><span>{file.name}</span><small>{formatBytes(file.size)}</small></div>)}</div>}
        </div>
        <aside className="compressorSettings" aria-label="리사이즈 설정">
          <h3>크기 설정</h3>
          <label className="settingField"><span>가로폭</span><input className="toolInput" type="number" min="1" value={width} onChange={event => setWidth(Number(event.target.value))} /></label>
          <label className="settingField"><span>세로폭</span><input className="toolInput" type="number" min="1" value={height} disabled={keepRatio} onChange={event => setHeight(Number(event.target.value))} /></label>
          <label className="settingField settingCheck"><span>원본 비율 유지</span><input type="checkbox" checked={keepRatio} onChange={event => setKeepRatio(event.target.checked)} /></label>
          <label className="settingField"><span>출력 품질 <b>{quality}%</b></span><input type="range" min="40" max="100" value={quality} onChange={event => setQuality(Number(event.target.value))} /></label>
          <button className="primaryButton compressorRun" type="button" disabled={!files.length || working || width < 1 || (!keepRatio && height < 1)} onClick={run}>{working ? '크기 조정 중…' : '이미지 크기 조정'}</button>
          <p className="settingHint">비율 유지를 켜면 입력한 가로폭을 기준으로 세로폭을 자동 계산합니다.</p>
        </aside>
      </div>
      {error && <div className="engineError" role="alert">{error}</div>}
      {results.length > 0 && <section className="resultPanel" aria-live="polite"><div className="resultSummary"><div><span>완료</span><strong>{results.length}개</strong></div><div><span>목표 가로폭</span><strong>{width}px</strong></div><button className="primaryButton" type="button" onClick={downloadAll}>모두 다운로드</button></div><div className="resultList">{results.map(result => <div className="resultRow" key={result.url}><div><strong>{result.name}</strong><small>{result.originalWidth} × {result.originalHeight}px → {result.width} × {result.height}px</small></div><div className="resultSizes"><b>{formatBytes(result.blob.size)}</b></div><a className="downloadButton" href={result.url} download={result.name}>다운로드</a></div>)}</div></section>}
    </div>
  );
}
