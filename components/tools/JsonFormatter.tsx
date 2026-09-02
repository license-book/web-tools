'use client';

import { useMemo, useState } from 'react';

const SAMPLE = `{
  "name": "WEBTOOLS",
  "category": "developer",
  "free": true,
  "features": ["format", "validate", "minify"]
}`;

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const inputSize = useMemo(() => new Blob([input]).size, [input]);
  const outputSize = useMemo(() => new Blob([output]).size, [output]);

  const parse = () => {
    try {
      const parsed = JSON.parse(input);
      setStatus('valid');
      setMessage('유효한 JSON입니다.');
      return parsed;
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'JSON 문법을 확인해주세요.';
      setStatus('invalid');
      setMessage(detail);
      setOutput('');
      return null;
    }
  };

  const format = () => {
    const parsed = parse();
    if (parsed === null) return;
    setOutput(JSON.stringify(parsed, null, indent));
  };

  const minify = () => {
    const parsed = parse();
    if (parsed === null) return;
    setOutput(JSON.stringify(parsed));
  };

  const validate = () => {
    const parsed = parse();
    if (parsed !== null) setOutput('');
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInput('');
    setOutput('');
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="workspace jsonWorkspace">
      <div className="workspaceHead jsonHead">
        <div>
          <span className="engineBadge">브라우저 처리</span>
          <h2>JSON을 정리하고 문법 오류를 확인하세요</h2>
          <p>입력한 JSON은 서버로 전송하지 않고 현재 브라우저에서 처리합니다.</p>
        </div>
        <button className="textButton" type="button" onClick={() => { setInput(SAMPLE); setStatus('idle'); setMessage(''); setOutput(''); }}>예제 넣기</button>
      </div>

      <div className="jsonToolbar">
        <label className="settingField jsonIndent"><span>들여쓰기</span><select value={indent} onChange={(event) => setIndent(Number(event.target.value))}><option value={2}>2칸</option><option value={4}>4칸</option></select></label>
        <div className="jsonActions">
          <button className="primaryButton" type="button" disabled={!input.trim()} onClick={format}>정리하기</button>
          <button className="downloadButton" type="button" disabled={!input.trim()} onClick={minify}>한 줄로 압축</button>
          <button className="downloadButton" type="button" disabled={!input.trim()} onClick={validate}>문법 검사</button>
          <button className="textButton" type="button" disabled={!input && !output} onClick={reset}>초기화</button>
        </div>
      </div>

      <div className="jsonEditorGrid">
        <section className="jsonPane">
          <div className="jsonPaneHead"><strong>입력</strong><small>{input.length.toLocaleString()}자 · {inputSize.toLocaleString()} bytes</small></div>
          <textarea className="toolTextarea jsonTextarea" spellCheck={false} value={input} onChange={(event) => { setInput(event.target.value); setStatus('idle'); setMessage(''); }} placeholder={'{\n  "name": "WEBTOOLS"\n}'} />
        </section>
        <section className="jsonPane">
          <div className="jsonPaneHead"><strong>결과</strong><div><small>{output ? `${output.length.toLocaleString()}자 · ${outputSize.toLocaleString()} bytes` : '아직 결과 없음'}</small>{output && <><button className="textButton" type="button" onClick={copyOutput}>{copied ? '복사됨' : '복사'}</button><button className="textButton" type="button" onClick={download}>JSON 저장</button></>}</div></div>
          <textarea className="toolTextarea jsonTextarea" readOnly value={output} placeholder="정리 또는 압축한 결과가 여기에 표시됩니다." />
        </section>
      </div>

      {status !== 'idle' && <div className={status === 'valid' ? 'engineSuccess' : 'engineError'} role="status"><strong>{status === 'valid' ? '✓ 정상' : '문법 오류'}</strong><span>{message}</span></div>}
    </div>
  );
}
