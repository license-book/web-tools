'use client';

import { useMemo, useState } from 'react';

type Unit = 'px' | 'rem' | 'em' | '%';

export default function CssUnitConverter() {
  const [value, setValue] = useState('16');
  const [from, setFrom] = useState<Unit>('px');
  const [to, setTo] = useState<Unit>('rem');
  const [root, setRoot] = useState('16');
  const [emBase, setEmBase] = useState('16');
  const [percentBase, setPercentBase] = useState('320');

  const result = useMemo(() => {
    const n = Number(value), rootN = Number(root), emN = Number(emBase), percentN = Number(percentBase);
    if (![n, rootN, emN, percentN].every(Number.isFinite) || rootN <= 0 || emN <= 0 || percentN <= 0) return null;
    const toPx = (v: number, unit: Unit) => unit === 'px' ? v : unit === 'rem' ? v * rootN : unit === 'em' ? v * emN : v * percentN / 100;
    const fromPx = (px: number, unit: Unit) => unit === 'px' ? px : unit === 'rem' ? px / rootN : unit === 'em' ? px / emN : px / percentN * 100;
    return fromPx(toPx(n, from), to);
  }, [value, from, to, root, emBase, percentBase]);

  return <div className="workspace">
    <div className="jsonEditorGrid">
      <div className="jsonPane">
        <label className="settingField"><span>변환할 값</span><input className="toolInput" type="number" value={value} onChange={(e) => setValue(e.target.value)} /></label>
        <label className="settingField"><span>현재 단위</span><select value={from} onChange={(e) => setFrom(e.target.value as Unit)}><option>px</option><option>rem</option><option>em</option><option>%</option></select></label>
      </div>
      <div className="jsonPane">
        <label className="settingField"><span>변환 단위</span><select value={to} onChange={(e) => setTo(e.target.value as Unit)}><option>px</option><option>rem</option><option>em</option><option>%</option></select></label>
        <label className="settingField"><span>결과</span><input className="toolInput" readOnly value={result === null ? '입력값을 확인하세요' : `${Number(result.toFixed(6))}${to}`} /></label>
      </div>
    </div>
    <div className="compressorSettings">
      <strong>기준값</strong>
      <label className="settingField"><span>Root font-size (rem 기준, px)</span><input className="toolInput" type="number" value={root} onChange={(e) => setRoot(e.target.value)} /></label>
      <label className="settingField"><span>현재 font-size (em 기준, px)</span><input className="toolInput" type="number" value={emBase} onChange={(e) => setEmBase(e.target.value)} /></label>
      <label className="settingField"><span>부모/컨테이너 크기 (% 기준, px)</span><input className="toolInput" type="number" value={percentBase} onChange={(e) => setPercentBase(e.target.value)} /></label>
    </div>
    <div className="workspaceAction"><button className="textButton" type="button" disabled={result === null} onClick={() => result !== null && navigator.clipboard.writeText(`${Number(result.toFixed(6))}${to}`)}>결과 복사</button></div>
  </div>;
}
