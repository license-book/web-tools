'use client';

import { useState } from 'react';

type Mode = 'html' | 'css' | 'js';

function beautifyHtml(input: string) {
  const tokens = input.replace(/>\s*</g, '><').split(/(?=<)|(?<=>)/g).filter(Boolean);
  let depth = 0;
  const out: string[] = [];
  const voidTags = /^(<\/?(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b)/i;
  for (const raw of tokens) {
    const token = raw.trim();
    if (!token) continue;
    if (/^<\//.test(token)) depth = Math.max(0, depth - 1);
    out.push(`${'  '.repeat(depth)}${token}`);
    if (/^<[^!/][^>]*>$/.test(token) && !/^<\//.test(token) && !/\/>$/.test(token) && !voidTags.test(token) && !/<[^>]+>.*<\//.test(token)) depth++;
  }
  return out.join('\n');
}

function beautifyBraces(input: string) {
  const compact = input.replace(/\s+/g, ' ').trim();
  let depth = 0;
  let out = '';
  for (let i = 0; i < compact.length; i++) {
    const ch = compact[i];
    if (ch === '{') { depth++; out += ` {\n${'  '.repeat(depth)}`; }
    else if (ch === '}') { depth = Math.max(0, depth - 1); out = out.trimEnd() + `\n${'  '.repeat(depth)}}`; if (compact[i + 1] && compact[i + 1] !== ';' && compact[i + 1] !== ',') out += `\n${'  '.repeat(depth)}`; }
    else if (ch === ';') out += `;\n${'  '.repeat(depth)}`;
    else out += ch;
  }
  return out.replace(/\n\s*\n/g, '\n').trim();
}

function minify(input: string, mode: Mode) {
  let value = input;
  if (mode !== 'js') value = value.replace(/\/\*[\s\S]*?\*\//g, '');
  if (mode === 'html') return value.replace(/<!--([\s\S]*?)-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
  return value.replace(/\s+/g, ' ').replace(/\s*([{}:;,=()+<>])\s*/g, '$1').trim();
}

export default function CodeFormatter() {
  const [mode, setMode] = useState<Mode>('html');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const run = (kind: 'beautify' | 'minify') => {
    if (!input.trim()) { setOutput(''); return; }
    if (kind === 'minify') setOutput(minify(input, mode));
    else setOutput(mode === 'html' ? beautifyHtml(input) : beautifyBraces(input));
  };
  const copy = async () => { if (output) await navigator.clipboard.writeText(output); };

  return <div className="workspace">
    <div className="workspaceAction">
      <label className="settingField" style={{ minWidth: 180 }}><span>언어</span><select value={mode} onChange={(e) => setMode(e.target.value as Mode)}><option value="html">HTML</option><option value="css">CSS</option><option value="js">JavaScript</option></select></label>
      <button className="primaryButton" type="button" onClick={() => run('beautify')}>보기 좋게 정리</button>
      <button className="textButton" type="button" onClick={() => run('minify')}>한 줄로 압축</button>
    </div>
    <div className="jsonEditorGrid">
      <div className="jsonPane"><span className="fieldLabel">입력</span><textarea className="toolTextarea jsonTextarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="HTML, CSS 또는 JavaScript 코드를 입력하세요." /></div>
      <div className="jsonPane"><div className="workspaceHead" style={{ padding: 0, background: 'transparent', border: 0 }}><span className="fieldLabel">결과</span><button className="textButton" type="button" disabled={!output} onClick={copy}>복사</button></div><textarea className="toolTextarea jsonTextarea" value={output} readOnly placeholder="결과가 여기에 표시됩니다." /></div>
    </div>
    <p className="settingHint">빠른 정리·압축용 경량 도구입니다. 복잡한 템플릿이나 정규식·문자열 리터럴이 많은 코드는 전용 포매터 결과와 차이가 있을 수 있습니다.</p>
  </div>;
}
