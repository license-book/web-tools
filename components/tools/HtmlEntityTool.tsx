'use client';

import { useState } from 'react';

function encodeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodeHtml(value: string) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

export default function HtmlEntityTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return <div className="workspace">
    <div className="jsonEditorGrid">
      <div className="jsonPane">
        <span className="fieldLabel">입력</span>
        <textarea className="toolTextarea jsonTextarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder={'예: <div class="card">Hello & welcome</div>'} />
      </div>
      <div className="jsonPane">
        <span className="fieldLabel">결과</span>
        <textarea className="toolTextarea jsonTextarea" value={output} readOnly placeholder="변환 결과가 여기에 표시됩니다." />
      </div>
    </div>
    <div className="workspaceAction">
      <button className="primaryButton" type="button" onClick={() => setOutput(encodeHtml(input))}>HTML Entity 인코딩</button>
      <button className="primaryButton" type="button" onClick={() => setOutput(decodeHtml(input))}>디코딩</button>
      <button className="textButton" type="button" onClick={copy} disabled={!output}>{copied ? '복사됨' : '결과 복사'}</button>
      <button className="textButton" type="button" onClick={() => { setInput(''); setOutput(''); }}>초기화</button>
    </div>
    <p className="settingHint">&, &lt;, &gt;, 따옴표 등 HTML에서 의미가 있는 문자를 안전한 Entity 표현으로 바꾸거나 원문으로 복원합니다.</p>
  </div>;
}
