'use client';

import { useMemo, useState } from 'react';

type PathToken = string | number | '*';

function parsePath(path: string): PathToken[] {
  const source = path.trim();
  if (!source || source === '$') return [];
  if (!source.startsWith('$')) throw new Error('JSON Path는 $로 시작해야 합니다.');
  const tokens: PathToken[] = [];
  let i = 1;
  while (i < source.length) {
    if (source[i] === '.') {
      i++;
      if (source[i] === '*') { tokens.push('*'); i++; continue; }
      const match = source.slice(i).match(/^[A-Za-z_$][\w$-]*/);
      if (!match) throw new Error(`경로 ${i + 1}번째 위치를 해석할 수 없습니다.`);
      tokens.push(match[0]); i += match[0].length; continue;
    }
    if (source[i] === '[') {
      const end = source.indexOf(']', i);
      if (end < 0) throw new Error('닫는 ]가 필요합니다.');
      const inside = source.slice(i + 1, end).trim();
      if (inside === '*') tokens.push('*');
      else if (/^\d+$/.test(inside)) tokens.push(Number(inside));
      else {
        const quoted = inside.match(/^(['"])(.*)\1$/);
        if (!quoted) throw new Error(`지원하지 않는 대괄호 표현식: [${inside}]`);
        tokens.push(quoted[2]);
      }
      i = end + 1; continue;
    }
    throw new Error(`경로 ${i + 1}번째 위치를 해석할 수 없습니다.`);
  }
  return tokens;
}

function applyToken(values: unknown[], token: PathToken): unknown[] {
  const next: unknown[] = [];
  for (const value of values) {
    if (token === '*') {
      if (Array.isArray(value)) next.push(...value);
      else if (value && typeof value === 'object') next.push(...Object.values(value as Record<string, unknown>));
      continue;
    }
    if (typeof token === 'number') {
      if (Array.isArray(value) && token < value.length) next.push(value[token]);
      continue;
    }
    if (value && typeof value === 'object' && token in (value as Record<string, unknown>)) next.push((value as Record<string, unknown>)[token]);
  }
  return next;
}

export default function JsonPathTester() {
  const [json, setJson] = useState('{\n  "users": [\n    {"name": "Kim", "age": 31},\n    {"name": "Lee", "age": 28}\n  ]\n}');
  const [path, setPath] = useState('$.users[*].name');
  const result = useMemo(() => {
    try {
      const data = JSON.parse(json) as unknown;
      const tokens = parsePath(path);
      const values = tokens.reduce((acc, token) => applyToken(acc, token), [data] as unknown[]);
      return { error: '', values };
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'JSON Path를 처리할 수 없습니다.', values: [] as unknown[] };
    }
  }, [json, path]);

  const output = result.values.length === 1 ? result.values[0] : result.values;
  return <div className="workspace">
    <label className="settingField"><span>JSON Path</span><input className="toolInput" value={path} onChange={(e) => setPath(e.target.value)} placeholder="$.users[*].name" /><small>지원: 점 표기, 배열 인덱스, [\"key\"], 와일드카드 *</small></label>
    <div className="jsonEditorGrid">
      <div className="jsonPane"><span className="fieldLabel">JSON 입력</span><textarea className="toolTextarea jsonTextarea" value={json} onChange={(e) => setJson(e.target.value)} /></div>
      <div className="jsonPane"><span className="fieldLabel">결과</span><textarea className="toolTextarea jsonTextarea" value={result.error ? '' : JSON.stringify(output, null, 2)} readOnly /></div>
    </div>
    {result.error && <div className="engineError">{result.error}</div>}
    {!result.error && <div className="workspaceAction"><span>일치 결과 {result.values.length}개</span><button className="textButton" type="button" onClick={() => navigator.clipboard.writeText(JSON.stringify(output, null, 2)).catch(() => undefined)}>결과 복사</button></div>}
  </div>;
}
