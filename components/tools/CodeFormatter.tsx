'use client';

import { useState } from 'react';

type Mode = 'html' | 'css' | 'js' | 'jquery';

function beautifyHtml(input: string) {
  const normalized = input.replace(/>\s*</g, '><').trim();
  const tokens = normalized.split(/(?=<)|(?<=>)/g).filter(Boolean);
  let depth = 0;
  const out: string[] = [];
  const voidTags = /^(<\/?(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b)/i;
  const inlineClosing = /^<\/(?:a|abbr|b|bdi|bdo|cite|code|em|i|label|mark|q|s|small|span|strong|sub|sup|time|u)>$/i;

  for (const raw of tokens) {
    const token = raw.trim();
    if (!token) continue;
    if (/^<\//.test(token)) depth = Math.max(0, depth - 1);
    if (inlineClosing.test(token) && out.length) out[out.length - 1] += token;
    else out.push(`${'  '.repeat(depth)}${token}`);
    if (/^<[^!/][^>]*>$/.test(token) && !/^<\//.test(token) && !/\/>$/.test(token) && !voidTags.test(token) && !/<[^>]+>.*<\//.test(token)) depth++;
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n');
}

function beautifyBraces(input: string) {
  const compact = input.replace(/\r\n/g, '\n').trim();
  let depth = 0;
  let out = '';
  let quote = '';
  let escaped = false;
  for (let i = 0; i < compact.length; i++) {
    const ch = compact[i];
    if (quote) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = '';
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; out += ch; continue; }
    if (ch === '{') { depth++; out = out.trimEnd() + ` {\n${'  '.repeat(depth)}`; }
    else if (ch === '}') { depth = Math.max(0, depth - 1); out = out.trimEnd() + `\n${'  '.repeat(depth)}}`; if (compact[i + 1] && compact[i + 1] !== ';' && compact[i + 1] !== ',' && compact[i + 1] !== ')') out += `\n${'  '.repeat(depth)}`; }
    else if (ch === ';') out += `;\n${'  '.repeat(depth)}`;
    else if (ch === '\n') { if (!out.endsWith('\n')) out += `\n${'  '.repeat(depth)}`; }
    else out += ch;
  }
  return out.replace(/[ \t]+\n/g, '\n').replace(/\n\s*\n\s*\n/g, '\n\n').trim();
}

function minify(input: string, mode: Mode) {
  let value = input;
  if (mode === 'html') return value.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
  if (mode === 'css') value = value.replace(/\/\*[\s\S]*?\*\//g, '');
  return value.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').replace(/\s*([{}:;,=()+<>])\s*/g, '$1').trim();
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
  const reset = () => { setInput(''); setOutput(''); };

  return <div className="workspace">
    <div className="workspaceAction">
      <label className="settingField" style={{ minWidth: 210 }}><span>코드 종류</span><select value={mode} onChange={(e) => setMode(e.target.value as Mode)}><option value="html">HTML</option><option value="css">CSS</option><option value="js">JavaScript</option><option value="jquery">jQuery</option></select></label>
      <button className="primaryButton" type="button" onClick={() => run('beautify')}>깔끔하게 정리</button>
      <button className="textButton" type="button" onClick={() => run('minify')}>Minify 압축</button>
      <button className="textButton" type="button" onClick={reset}>초기화</button>
    </div>
    <div className="jsonEditorGrid">
      <div className="jsonPane"><span className="fieldLabel">원본 코드</span><textarea className="toolTextarea jsonTextarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="지저분한 HTML, CSS, JavaScript 또는 jQuery 코드를 붙여넣으세요." /></div>
      <div className="jsonPane"><div className="workspaceHead" style={{ padding: 0, background: 'transparent', border: 0 }}><span className="fieldLabel">변환 결과</span><button className="textButton" type="button" disabled={!output} onClick={copy}>복사</button></div><textarea className="toolTextarea jsonTextarea" value={output} readOnly placeholder="정리하거나 압축한 코드가 여기에 표시됩니다." /></div>
    </div>
    <p className="settingHint">HTML 정리, CSS·JavaScript·jQuery 코드 정리와 Minify 압축을 한 화면에서 처리합니다. 원본 코드는 서버에 저장하지 않습니다.</p>
  </div>;
}
