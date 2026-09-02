'use client';

import { useMemo, useRef, useState } from 'react';
import type { ToolDefinition } from '@/types/tool';

type WorkspaceMode = 'file' | 'text' | 'value';

function getMode(tool: ToolDefinition): WorkspaceMode {
  if (tool.category === 'image' || tool.category === 'pdf') return 'file';
  if (tool.category === 'text' || tool.category === 'developer') return 'text';
  return 'value';
}

export default function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  const mode = getMode(tool);
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [value, setValue] = useState('');
  const [dragging, setDragging] = useState(false);

  const accept = useMemo(() => {
    if (tool.category === 'image') return 'image/*';
    if (tool.category === 'pdf') return 'application/pdf';
    return undefined;
  }, [tool.category]);

  if (mode === 'file') {
    const addFiles = (list: FileList | null) => {
      if (!list) return;
      setFiles(Array.from(list));
    };

    return (
      <div className="workspace">
        <div
          className={`dropzone${dragging ? ' isDragging' : ''}`}
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}
        >
          <input ref={inputRef} type="file" accept={accept} multiple hidden onChange={(event) => addFiles(event.target.files)} />
          <span className="dropIcon" aria-hidden="true">＋</span>
          <strong>파일을 여기에 놓거나 선택하세요</strong>
          <p>{tool.category === 'image' ? 'JPG, PNG, WebP 등 이미지 파일을 선택할 수 있습니다.' : 'PDF 파일을 선택할 수 있습니다.'}</p>
          <button type="button" className="primaryButton">파일 선택</button>
        </div>
        {files.length > 0 && (
          <div className="fileList" aria-live="polite">
            <div className="workspaceHead"><strong>선택한 파일 {files.length}개</strong><button type="button" className="textButton" onClick={() => setFiles([])}>전체 삭제</button></div>
            {files.map((file) => <div className="fileRow" key={`${file.name}-${file.lastModified}`}><span>{file.name}</span><small>{(file.size / 1024).toFixed(1)} KB</small></div>)}
          </div>
        )}
        <div className="workspaceAction"><button type="button" className="primaryButton" disabled={files.length === 0}>실행 엔진 연결 예정</button><span>공통 파일 입력·선택·목록 엔진까지 연결되었습니다.</span></div>
      </div>
    );
  }

  if (mode === 'text') {
    return (
      <div className="workspace">
        <label className="fieldLabel" htmlFor="tool-text-input">내용 입력</label>
        <textarea id="tool-text-input" className="toolTextarea" value={text} onChange={(event) => setText(event.target.value)} placeholder={`${tool.title}에 사용할 내용을 입력하세요.`} />
        <div className="workspaceAction"><button type="button" className="primaryButton" disabled={!text.trim()}>실행 엔진 연결 예정</button><span>{text.length.toLocaleString()}자 입력</span></div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <label className="fieldLabel" htmlFor="tool-value-input">값 입력</label>
      <input id="tool-value-input" className="toolInput" value={value} onChange={(event) => setValue(event.target.value)} placeholder={`${tool.title}에 사용할 값을 입력하세요.`} />
      <div className="workspaceAction"><button type="button" className="primaryButton" disabled={!value.trim()}>실행 엔진 연결 예정</button><span>도구별 실행 로직만 교체할 수 있는 공통 입력 구조입니다.</span></div>
    </div>
  );
}
