'use client';

import { useState } from 'react';

export default function UrlCodec(){
  const [input,setInput]=useState('');
  const [output,setOutput]=useState('');
  const [error,setError]=useState('');
  const run=(mode:'encode'|'decode')=>{
    try{setError('');setOutput(mode==='encode'?encodeURIComponent(input):decodeURIComponent(input));}
    catch{setError('유효하지 않은 URL 인코딩 문자열입니다.');setOutput('');}
  };
  const copy=async()=>{if(output) await navigator.clipboard.writeText(output);};
  return <div className="workspace">
    <label className="fieldLabel">입력</label>
    <textarea className="toolTextarea" value={input} onChange={e=>setInput(e.target.value)} placeholder="URL 또는 변환할 텍스트를 입력하세요." />
    <div className="workspaceAction"><button className="primaryButton" onClick={()=>run('encode')}>URL 인코딩</button><button className="primaryButton" onClick={()=>run('decode')}>URL 디코딩</button><button className="textButton" onClick={()=>{setInput('');setOutput('');setError('')}}>초기화</button></div>
    {error&&<div className="engineError">{error}</div>}
    <label className="fieldLabel">결과</label>
    <textarea className="toolTextarea" readOnly value={output} placeholder="결과가 여기에 표시됩니다." />
    <div className="workspaceAction"><button className="downloadButton" onClick={copy} disabled={!output}>결과 복사</button></div>
  </div>;
}
