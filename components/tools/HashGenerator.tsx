'use client';

import { useState } from 'react';

type Algorithm='SHA-1'|'SHA-256'|'SHA-384'|'SHA-512';

export default function HashGenerator(){
  const [input,setInput]=useState('');
  const [algorithm,setAlgorithm]=useState<Algorithm>('SHA-256');
  const [output,setOutput]=useState('');
  const [error,setError]=useState('');
  const generate=async()=>{
    try{
      setError('');
      const data=new TextEncoder().encode(input);
      const digest=await crypto.subtle.digest(algorithm,data);
      const hex=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
      setOutput(hex);
    }catch{setError('해시를 생성하지 못했습니다.');setOutput('');}
  };
  const copy=async()=>{if(output) await navigator.clipboard.writeText(output);};
  return <div className="workspace">
    <label className="fieldLabel">원문</label>
    <textarea className="toolTextarea" value={input} onChange={e=>setInput(e.target.value)} placeholder="해시를 생성할 텍스트를 입력하세요." />
    <label className="settingField"><span>알고리즘</span><select value={algorithm} onChange={e=>setAlgorithm(e.target.value as Algorithm)}><option>SHA-1</option><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select></label>
    <div className="workspaceAction"><button className="primaryButton" onClick={generate}>해시 생성</button><button className="textButton" onClick={()=>{setInput('');setOutput('');setError('')}}>초기화</button></div>
    {error&&<div className="engineError">{error}</div>}
    <label className="fieldLabel">결과</label>
    <textarea className="toolTextarea" readOnly value={output} placeholder="해시 결과가 여기에 표시됩니다." />
    <div className="workspaceAction"><button className="downloadButton" onClick={copy} disabled={!output}>결과 복사</button></div>
    <p className="settingHint">보안상 비밀번호 저장용으로는 단순 SHA 해시보다 전용 비밀번호 해싱 알고리즘을 사용하는 것이 적절합니다.</p>
  </div>;
}
