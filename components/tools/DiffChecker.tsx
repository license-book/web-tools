'use client';

import { useState } from 'react';

type DiffLine = { type: 'same' | 'add' | 'remove'; text: string };

function diffLines(aText: string, bText: string): DiffLine[] {
  const a = aText.split(/\r?\n/), b = bText.split(/\r?\n/);
  if (a.length > 500 || b.length > 500) throw new Error('현재 비교는 각 입력 최대 500줄까지 지원합니다.');
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const result: DiffLine[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { result.push({ type: 'same', text: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) result.push({ type: 'remove', text: a[i++] });
    else result.push({ type: 'add', text: b[j++] });
  }
  while (i < a.length) result.push({ type: 'remove', text: a[i++] });
  while (j < b.length) result.push({ type: 'add', text: b[j++] });
  return result;
}

export default function DiffChecker() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);

  const compare = () => {
    try { setError(''); setDiff(diffLines(left, right)); setHasRun(true); }
    catch (e) { setDiff([]); setHasRun(false); setError(e instanceof Error ? e.message : '비교할 수 없습니다.'); }
  };
  const counts = diff.reduce((acc, line) => { if (line.type === 'add') acc.add++; if (line.type === 'remove') acc.remove++; return acc; }, { add: 0, remove: 0 });

  return <div className="workspace">
    <div className="jsonEditorGrid">
      <div className="jsonPane"><span className="fieldLabel">원본</span><textarea className="toolTextarea jsonTextarea" value={left} onChange={(e) => { setLeft(e.target.value); setHasRun(false); }} placeholder="원본 텍스트 또는 코드를 입력하세요." /></div>
      <div className="jsonPane"><span className="fieldLabel">변경본</span><textarea className="toolTextarea jsonTextarea" value={right} onChange={(e) => { setRight(e.target.value); setHasRun(false); }} placeholder="비교할 텍스트 또는 코드를 입력하세요." /></div>
    </div>
    <div className="workspaceAction"><button className="primaryButton" type="button" onClick={compare}>차이 비교</button><span>추가 {counts.add}줄 · 삭제 {counts.remove}줄</span><button className="textButton" type="button" onClick={() => { setLeft(''); setRight(''); setDiff([]); setError(''); setHasRun(false); }}>초기화</button></div>
    {error && <div className="engineError">{error}</div>}
    {hasRun && !error && <div className="resultPanel"><div className="workspaceHead"><strong>라인 비교 결과</strong><span>+ 추가 · − 삭제</span></div><div style={{ maxHeight: 520, overflow: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13 }}>{diff.map((line, idx) => <div key={idx} style={{ padding: '7px 14px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: line.type === 'add' ? '#ecfdf5' : line.type === 'remove' ? '#fff1f2' : '#fff', color: line.type === 'add' ? '#047857' : line.type === 'remove' ? '#b91c1c' : '#475569', borderBottom: '1px solid #f1f5f9' }}>{line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '} {line.text || ' '}</div>)}</div></div>}
  </div>;
}
