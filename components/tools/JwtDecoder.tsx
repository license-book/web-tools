'use client';

import { useMemo, useState } from 'react';

function decodePart(part:string){
  const base64=part.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(part.length/4)*4,'=');
  const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
  const text=new TextDecoder().decode(bytes);
  return JSON.parse(text);
}

export default function JwtDecoder(){
  const [token,setToken]=useState('');
  const decoded=useMemo(()=>{
    if(!token.trim()) return {header:'',payload:'',error:''};
    try{
      const parts=token.trim().split('.');
      if(parts.length<2) throw new Error('JWT 형식이 아닙니다.');
      return {header:JSON.stringify(decodePart(parts[0]),null,2),payload:JSON.stringify(decodePart(parts[1]),null,2),error:''};
    }catch(e){return {header:'',payload:'',error:e instanceof Error?e.message:'JWT를 해석할 수 없습니다.'};}
  },[token]);
  const copy=async(text:string)=>{if(text) await navigator.clipboard.writeText(text);};
  return <div className="workspace">
    <label className="fieldLabel">JWT 토큰</label>
    <textarea className="toolTextarea" value={token} onChange={e=>setToken(e.target.value)} placeholder="eyJhbGciOi..." />
    {decoded.error&&<div className="engineError">{decoded.error}</div>}
    <div className="jsonEditorGrid">
      <section className="jsonPane"><div className="workspaceHead"><strong>Header</strong><button className="textButton" onClick={()=>copy(decoded.header)}>복사</button></div><pre>{decoded.header||'토큰을 입력하면 Header가 표시됩니다.'}</pre></section>
      <section className="jsonPane"><div className="workspaceHead"><strong>Payload</strong><button className="textButton" onClick={()=>copy(decoded.payload)}>복사</button></div><pre>{decoded.payload||'토큰을 입력하면 Payload가 표시됩니다.'}</pre></section>
    </div>
    <p className="settingHint">서명 검증은 하지 않고 Header와 Payload만 브라우저에서 해석합니다.</p>
  </div>;
}
