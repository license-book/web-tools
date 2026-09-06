'use client';

import { useState } from 'react';

type Mode = 'encode' | 'decode';

function utf8ToBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToUtf8(value: string) {
  const normalized = value.replace(/\s+/g, '');
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function run(nextMode = mode) {
    setError('');
    if (!input) {
      setOutput('');
      return;
    }
    try {
      setOutput(nextMode === 'encode' ? utf8ToBase64(input) : base64ToUtf8(input));
    } catch {
      setOutput('');
      setError(nextMode === 'decode' ? '올바른 Base64 문자열인지 확인해 주세요.' : '변환할 수 없는 입력입니다.');
    }
  }

  function changeMode(next: Mode) {
    setMode(next);
    setInput('');
    setOutput('');
    setError('');
  }

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="workspace">
      <div className="workspaceAction">
        <button className={mode === 'encode' ? 'primaryButton' : 'pdfMiniButton'} type="button" onClick={() => changeMode('encode')}>인코딩</button>
        <button className={mode === 'decode' ? 'primaryButton' : 'pdfMiniButton'} type="button" onClick={() => changeMode('decode')}>디코딩</button>
      </div>

      <label className="settingField">
        <span>{mode === 'encode' ? '원본 텍스트' : 'Base64 문자열'}</span>
        <textarea className="toolTextarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'encode' ? '인코딩할 텍스트를 입력하세요.' : '디코딩할 Base64 문자열을 입력하세요.'} />
      </label>

      <div className="workspaceAction">
        <button className="primaryButton" type="button" onClick={() => run()} disabled={!input}>{mode === 'encode' ? 'Base64 인코딩' : 'Base64 디코딩'}</button>
        <button className="textButton" type="button" onClick={() => { setInput(''); setOutput(''); setError(''); }} disabled={!input && !output}>초기화</button>
      </div>

      {error && <div className="engineError">{error}</div>}

      <label className="settingField">
        <span>결과</span>
        <textarea className="toolTextarea" value={output} readOnly placeholder="변환 결과가 여기에 표시됩니다." />
      </label>

      <div className="workspaceAction">
        <button className="primaryButton" type="button" onClick={copyOutput} disabled={!output}>{copied ? '복사됨' : '결과 복사'}</button>
        <span>한글과 이모지를 포함한 UTF-8 텍스트를 지원합니다.</span>
      </div>
    </div>
  );
}
