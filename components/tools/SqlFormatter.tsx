'use client';

import { useState } from 'react';

const KEYWORDS = ['SELECT','FROM','WHERE','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','LEFT JOIN','RIGHT JOIN','INNER JOIN','FULL JOIN','JOIN','ON','AND','OR','UNION ALL','UNION','CASE','WHEN','THEN','ELSE','END','AS','DISTINCT'];

function formatSql(input: string) {
  let sql = input.trim().replace(/\s+/g, ' ');
  if (!sql) return '';
  const multi = [...KEYWORDS].sort((a, b) => b.length - a.length);
  for (const keyword of multi) {
    const pattern = new RegExp(`\\b${keyword.replace(/ /g, '\\s+')}\\b`, 'gi');
    sql = sql.replace(pattern, keyword);
  }
  const newlineBefore = ['SELECT','FROM','WHERE','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','LEFT JOIN','RIGHT JOIN','INNER JOIN','FULL JOIN','JOIN','UNION ALL','UNION'];
  for (const keyword of newlineBefore.sort((a, b) => b.length - a.length)) {
    const pattern = new RegExp(`\\s+${keyword.replace(/ /g, '\\s+')}\\s+`, 'g');
    sql = sql.replace(pattern, `\n${keyword} `);
  }
  sql = sql.replace(/\s+(AND|OR)\s+/g, '\n  $1 ');
  sql = sql.replace(/,\s*/g, ',\n  ');
  sql = sql.replace(/\s*;\s*/g, ';\n');
  return sql.split('\n').map((line) => line.trimEnd()).filter(Boolean).join('\n').trim();
}

function minifySql(input: string) { return input.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([(),;=<>+*/-])\s*/g, '$1').trim(); }

export default function SqlFormatter() {
  const [source, setSource] = useState('');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  const run = (mode: 'format' | 'minify') => {
    if (!source.trim()) { setMessage('SQL을 입력해 주세요.'); setResult(''); return; }
    setMessage(''); setResult(mode === 'format' ? formatSql(source) : minifySql(source));
  };
  return <div className="workspace">
    <div className="jsonEditorGrid">
      <div className="jsonPane"><span className="fieldLabel">SQL 입력</span><textarea className="toolTextarea jsonTextarea" value={source} onChange={(e) => setSource(e.target.value)} placeholder="SELECT id,name FROM users WHERE active=1 ORDER BY name;" /></div>
      <div className="jsonPane"><span className="fieldLabel">결과</span><textarea className="toolTextarea jsonTextarea" value={result} readOnly /></div>
    </div>
    {message && <div className="engineError">{message}</div>}
    <div className="workspaceAction"><button className="primaryButton" type="button" onClick={() => run('format')}>SQL 정리</button><button className="primaryButton" type="button" onClick={() => run('minify')}>Minify</button><button className="textButton" type="button" disabled={!result} onClick={() => navigator.clipboard.writeText(result)}>복사</button><button className="textButton" type="button" onClick={() => { setSource(''); setResult(''); setMessage(''); }}>초기화</button></div>
    <p className="settingHint">일반적인 SQL 구문을 빠르게 읽기 좋게 정리하는 브라우저 도구입니다. DB별 방언의 모든 문법을 완전하게 파싱하는 SQL 엔진은 아닙니다.</p>
  </div>;
}
