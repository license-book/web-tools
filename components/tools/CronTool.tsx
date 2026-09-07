'use client';

import { useMemo, useState } from 'react';

const presets = [
  ['매 5분','*/5 * * * *'],['매시간 정각','0 * * * *'],['매일 오전 9시','0 9 * * *'],['평일 오전 9시','0 9 * * 1-5'],['매주 월요일 오전 9시','0 9 * * 1'],['매월 1일 오전 9시','0 9 1 * *']
] as const;

function explainField(value: string, unit: string, names?: string[]) {
  if (value === '*') return `매 ${unit}`;
  if (value.startsWith('*/')) return `${value.slice(2)}${unit}마다`;
  if (/^\d+-\d+$/.test(value)) {
    const [a,b] = value.split('-').map(Number);
    return names ? `${names[a] ?? a}~${names[b] ?? b}` : `${a}~${b}${unit}`;
  }
  if (value.includes(',')) return value.split(',').map((v) => names ? (names[Number(v)] ?? v) : `${v}${unit}`).join(', ');
  const num = Number(value);
  if (!Number.isNaN(num)) return names ? (names[num] ?? value) : `${value}${unit}`;
  return value;
}

function explain(expr: string) {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return '표준 5필드 Cron 표현식(분 시 일 월 요일)을 입력해 주세요.';
  const [min,hour,day,month,week] = parts;
  const weekNames = ['일','월','화','수','목','금','토'];
  const pieces = [
    min === '0' ? '' : explainField(min,'분'),
    hour === '*' ? '매시간' : `${explainField(hour,'시')}`,
    day === '*' ? '매일' : `매월 ${explainField(day,'일')}`,
    month === '*' ? '' : `${explainField(month,'월')}`,
    week === '*' ? '' : `${explainField(week,'요일',weekNames)}요일`
  ].filter(Boolean);
  return pieces.join(' · ');
}

export default function CronTool() {
  const [expr, setExpr] = useState('*/5 * * * *');
  const [minute, setMinute] = useState('*/5');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [week, setWeek] = useState('*');
  const description = useMemo(() => explain(expr), [expr]);
  const syncFields = (value: string) => {
    const p = value.trim().split(/\s+/); if (p.length === 5) { setMinute(p[0]); setHour(p[1]); setDay(p[2]); setMonth(p[3]); setWeek(p[4]); }
  };
  const build = () => setExpr(`${minute} ${hour} ${day} ${month} ${week}`);
  const selectPreset = (value: string) => { setExpr(value); syncFields(value); };

  return <div className="workspace">
    <div className="compressorSettings">
      <div className="settingField"><span>Cron 표현식</span><input className="toolInput" value={expr} onChange={(e) => { setExpr(e.target.value); syncFields(e.target.value); }} placeholder="*/5 * * * *" /></div>
      <div className="resultPanel"><div className="workspaceHead"><strong>해석</strong></div><div style={{ padding: '18px', lineHeight: 1.7 }}>{description}</div></div>
      <div className="workspaceAction">{presets.map(([label,value]) => <button key={value} className="textButton" type="button" onClick={() => selectPreset(value)}>{label}</button>)}</div>
    </div>
    <div className="jsonEditorGrid">
      <div className="jsonPane"><div className="settingField"><span>분 (0-59)</span><input className="toolInput" value={minute} onChange={(e) => setMinute(e.target.value)} /></div><div className="settingField" style={{ marginTop: 14 }}><span>시 (0-23)</span><input className="toolInput" value={hour} onChange={(e) => setHour(e.target.value)} /></div><div className="settingField" style={{ marginTop: 14 }}><span>일 (1-31)</span><input className="toolInput" value={day} onChange={(e) => setDay(e.target.value)} /></div></div>
      <div className="jsonPane"><div className="settingField"><span>월 (1-12)</span><input className="toolInput" value={month} onChange={(e) => setMonth(e.target.value)} /></div><div className="settingField" style={{ marginTop: 14 }}><span>요일 (0-6, 일=0)</span><input className="toolInput" value={week} onChange={(e) => setWeek(e.target.value)} /></div><button className="primaryButton" style={{ marginTop: 20 }} type="button" onClick={build}>표현식 만들기</button></div>
    </div>
    <div className="workspaceAction"><button className="primaryButton" type="button" onClick={() => navigator.clipboard.writeText(expr)}>Cron 복사</button></div>
    <p className="settingHint">표준 5필드 Cron 기준입니다. 일부 서비스의 초(second) 필드나 특수 확장 문법은 다를 수 있습니다.</p>
  </div>;
}
