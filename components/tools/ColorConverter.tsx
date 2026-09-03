'use client';

import { useMemo, useState } from 'react';

type RGB = { r: number; g: number; b: number };

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const toHex = ({ r, g, b }: RGB) => `#${[r,g,b].map(v => clamp(v).toString(16).padStart(2,'0')).join('').toUpperCase()}`;
const hexToRgb = (hex: string): RGB | null => {
  const clean = hex.trim().replace('#','');
  const full = clean.length === 3 ? clean.split('').map(c => c+c).join('') : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return { r: parseInt(full.slice(0,2),16), g: parseInt(full.slice(2,4),16), b: parseInt(full.slice(4,6),16) };
};
const rgbToHsl = ({r,g,b}:RGB) => {
  let rr=r/255, gg=g/255, bb=b/255; const max=Math.max(rr,gg,bb), min=Math.min(rr,gg,bb); let h=0,s=0; const l=(max+min)/2;
  if(max!==min){const d=max-min; s=l>.5?d/(2-max-min):d/(max+min); switch(max){case rr:h=(gg-bb)/d+(gg<bb?6:0);break;case gg:h=(bb-rr)/d+2;break;default:h=(rr-gg)/d+4;} h/=6;}
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
};

export default function ColorConverter(){
  const [hex,setHex]=useState('#315EFB'); const [rgb,setRgb]=useState<RGB>({r:49,g:94,b:251}); const [copied,setCopied]=useState('');
  const hsl=useMemo(()=>rgbToHsl(rgb),[rgb]); const validHex=hexToRgb(hex);
  const syncHex=(value:string)=>{setHex(value);const next=hexToRgb(value);if(next)setRgb(next);};
  const syncRgb=(key:keyof RGB,value:number)=>{const next={...rgb,[key]:clamp(value)};setRgb(next);setHex(toHex(next));};
  const copy=async(label:string,value:string)=>{try{await navigator.clipboard.writeText(value);setCopied(label);setTimeout(()=>setCopied(''),1200);}catch{setCopied('');}};
  const hexValue=toHex(rgb),rgbValue=`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,hslValue=`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  return <div className="colorWorkspace">
    <div className="colorPreview" style={{background:hexValue}}><div><span>COLOR PREVIEW</span><strong>{hexValue}</strong></div></div>
    <div className="colorControls">
      <label className="settingField"><span>색상 선택</span><input className="qrColorInput" type="color" value={hexValue} onChange={e=>syncHex(e.target.value)}/></label>
      <label className="settingField"><span>HEX</span><input className="toolInput" value={hex} onChange={e=>syncHex(e.target.value)} placeholder="#315EFB"/>{!validHex&&<small className="colorInvalid">올바른 HEX 값을 입력해 주세요.</small>}</label>
      <div className="rgbGrid">{(['r','g','b'] as const).map(k=><label className="settingField" key={k}><span>{k.toUpperCase()}</span><input className="toolInput" type="number" min="0" max="255" value={rgb[k]} onChange={e=>syncRgb(k,Number(e.target.value))}/></label>)}</div>
    </div>
    <div className="colorValues">
      {[['HEX',hexValue],['RGB',rgbValue],['HSL',hslValue]].map(([label,value])=><div className="colorValueRow" key={label}><div><span>{label}</span><strong>{value}</strong></div><button className="textButton" onClick={()=>copy(label,value)}>{copied===label?'복사됨':'복사'}</button></div>)}
    </div>
    <p className="settingHint">색상 선택기, HEX 또는 RGB 값을 바꾸면 다른 색상 코드가 즉시 함께 계산됩니다.</p>
  </div>;
}
