'use client';

import { useMemo, useState } from 'react';

function formatDate(ms:number){
  const d=new Date(ms);
  if(Number.isNaN(d.getTime())) return null;
  return {local:d.toLocaleString(),iso:d.toISOString(),unixSec:Math.floor(d.getTime()/1000),unixMs:d.getTime()};
}

export default function TimestampConverter(){
  const [timestamp,setTimestamp]=useState(()=>String(Math.floor(Date.now()/1000)));
  const [dateInput,setDateInput]=useState('');
  const parsed=useMemo(()=>{
    const n=Number(timestamp.trim());
    if(!Number.isFinite(n)) return null;
    const ms=timestamp.trim().length<=10?n*1000:n;
    return formatDate(ms);
  },[timestamp]);
  const fromDate=()=>{const ms=new Date(dateInput).getTime();if(!Number.isNaN(ms)) setTimestamp(String(Math.floor(ms/1000)));};
  const now=()=>setTimestamp(String(Math.floor(Date.now()/1000)));
  const copy=async(value:string|number)=>navigator.clipboard.writeText(String(value));
  return <div className="workspace">
    <label className="fieldLabel">Unix Timestamp</label>
    <input className="toolInput" value={timestamp} onChange={e=>setTimestamp(e.target.value)} placeholder="예: 1760000000" />
    <div className="workspaceAction"><button className="primaryButton" onClick={now}>현재 시간 넣기</button></div>
    {parsed?<div className="resultPanel"><div className="resultRow"><span>로컬 시간<br/><small>{parsed.local}</small></span><button className="downloadButton" onClick={()=>copy(parsed.local)}>복사</button></div><div className="resultRow"><span>ISO 8601<br/><small>{parsed.iso}</small></span><button className="downloadButton" onClick={()=>copy(parsed.iso)}>복사</button></div><div className="resultRow"><span>Unix 초<br/><small>{parsed.unixSec}</small></span><button className="downloadButton" onClick={()=>copy(parsed.unixSec)}>복사</button></div><div className="resultRow"><span>Unix 밀리초<br/><small>{parsed.unixMs}</small></span><button className="downloadButton" onClick={()=>copy(parsed.unixMs)}>복사</button></div></div>:<div className="engineError">올바른 숫자 Timestamp를 입력하세요.</div>}
    <label className="fieldLabel">날짜 → Timestamp</label>
    <input className="toolInput" type="datetime-local" value={dateInput} onChange={e=>setDateInput(e.target.value)} />
    <div className="workspaceAction"><button className="primaryButton" onClick={fromDate} disabled={!dateInput}>Timestamp로 변환</button></div>
  </div>;
}
