'use client';

import { useState } from 'react';

const scalar = (value: unknown) => {
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  const text = String(value);
  if (!text || /[:#\-{}\[\],&*!?|>'"%@`\n]|^\s|\s$|^(true|false|null|~|[-+]?\d+(\.\d+)?)$/i.test(text)) return JSON.stringify(text);
  return text;
};

function toYaml(value: unknown, depth = 0): string {
  const pad = '  '.repeat(depth);
  if (Array.isArray(value)) {
    if (!value.length) return `${pad}[]`;
    return value.map((item) => {
      if (item && typeof item === 'object') return `${pad}-\n${toYaml(item, depth + 1)}`;
      return `${pad}- ${scalar(item)}`;
    }).join('\n');
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (!entries.length) return `${pad}{}`;
    return entries.map(([key, item]) => {
      const safeKey = /^[A-Za-z0-9_.-]+$/.test(key) ? key : JSON.stringify(key);
      if (item && typeof item === 'object') return `${pad}${safeKey}:\n${toYaml(item, depth + 1)}`;
      return `${pad}${safeKey}: ${scalar(item)}`;
    }).join('\n');
  }
  return `${pad}${scalar(value)}`;
}

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (value === '' || value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    if (value.startsWith('"')) return JSON.parse(value);
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value === '[]') return [];
  if (value === '{}') return {};
  return value;
}

function parseSimpleYaml(text: string): unknown {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() && !line.trimStart().startsWith('#'));
  if (!lines.length) return {};
  type Frame = { indent: number; value: Record<string, unknown> | unknown[] };
  const firstArray = lines[0].trimStart().startsWith('-');
  const root: Record<string, unknown> | unknown[] = firstArray ? [] : {};
  const stack: Frame[] = [{ indent: -1, value: root }];

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const indent = line.match(/^ */)?.[0].length ?? 0;
    const content = line.trim();
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].value;
    const next = lines[index + 1];
    const nextIndent = next ? (next.match(/^ */)?.[0].length ?? 0) : -1;
    const nextIsArray = !!next && nextIndent > indent && next.trimStart().startsWith('-');

    if (content.startsWith('-')) {
      if (!Array.isArray(parent)) throw new Error('배열 들여쓰기를 확인해 주세요.');
      const rest = content.slice(1).trim();
      if (!rest) {
        const child: Record<string, unknown> = {};
        parent.push(child);
        stack.push({ indent, value: child });
      } else if (rest.includes(':')) {
        const split = rest.indexOf(':');
        const key = rest.slice(0, split).trim().replace(/^['"]|['"]$/g, '');
        const raw = rest.slice(split + 1).trim();
        const child: Record<string, unknown> = {};
        child[key] = raw ? parseScalar(raw) : (nextIsArray ? [] : {});
        parent.push(child);
        stack.push({ indent, value: raw ? child : child[key] as Record<string, unknown> | unknown[] });
      } else parent.push(parseScalar(rest));
      continue;
    }

    const split = content.indexOf(':');
    if (split < 1 || Array.isArray(parent)) throw new Error('키: 값 형식과 들여쓰기를 확인해 주세요.');
    const key = content.slice(0, split).trim().replace(/^['"]|['"]$/g, '');
    const raw = content.slice(split + 1).trim();
    if (raw) parent[key] = parseScalar(raw);
    else {
      const child: Record<string, unknown> | unknown[] = nextIsArray ? [] : {};
      parent[key] = child;
      stack.push({ indent, value: child });
    }
  }
  return root;
}

export default function JsonYamlConverter() {
  const [source, setSource] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'json-yaml' | 'yaml-json'>('json-yaml');

  const convert = () => {
    setError('');
    try {
      if (!source.trim()) throw new Error('변환할 내용을 입력해 주세요.');
      if (mode === 'json-yaml') setResult(toYaml(JSON.parse(source)));
      else setResult(JSON.stringify(parseSimpleYaml(source), null, 2));
    } catch (e) { setResult(''); setError(e instanceof Error ? e.message : '변환할 수 없습니다.'); }
  };

  const copy = async () => { if (result) await navigator.clipboard.writeText(result); };

  return <div className="workspace">
    <div className="workspaceAction">
      <button className="primaryButton" type="button" onClick={() => setMode('json-yaml')} disabled={mode === 'json-yaml'}>JSON → YAML</button>
      <button className="primaryButton" type="button" onClick={() => setMode('yaml-json')} disabled={mode === 'yaml-json'}>YAML → JSON</button>
    </div>
    <div className="jsonEditorGrid">
      <div className="jsonPane"><span className="fieldLabel">입력</span><textarea className="toolTextarea jsonTextarea" value={source} onChange={(e) => setSource(e.target.value)} placeholder={mode === 'json-yaml' ? '{\n  "name": "WEBTOOLS"\n}' : 'name: WEBTOOLS\nenabled: true'} /></div>
      <div className="jsonPane"><span className="fieldLabel">변환 결과</span><textarea className="toolTextarea jsonTextarea" value={result} readOnly placeholder="결과가 여기에 표시됩니다." /></div>
    </div>
    {error && <div className="engineError">{error}</div>}
    <div className="workspaceAction"><button className="primaryButton" type="button" onClick={convert}>변환하기</button><button className="textButton" type="button" onClick={copy} disabled={!result}>결과 복사</button><button className="textButton" type="button" onClick={() => { setSource(''); setResult(''); setError(''); }}>초기화</button></div>
    <p className="settingHint">브라우저에서 변환합니다. YAML → JSON은 일반적인 객체·배열·스칼라 구조를 지원하며 앵커·태그 같은 고급 YAML 문법은 지원하지 않습니다.</p>
  </div>;
}
