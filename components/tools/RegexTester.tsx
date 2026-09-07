'use client';

import { useMemo, useState } from 'react';

export default function RegexTester(){
  const [pattern,setPattern]=useState('');
  const [flags,setFlags]=useState('g');
  const [text,setText]=useState('');
  const result=useMemo(()=>{
    if(!pattern) return {error:'',matches:[] as string[]};
    try{
      const safeFlags=Array.from(new Set(flags.split('').filter(f=>'gimsuy'.includes(f)))).join('');
      const re=new RegExp(pattern,safeFlags);
      const matches:string[]=[];
      if(safeFlags.includes('g')){
        let m:RegExpExecArray|null;
        while((m=re.exec(text))!==null){matches.push(m[0]);if(m[0]==='') re.lastIndex++;if(matches.length>=200) break;}
      }else{
        const m=re.exec(text);if(m) matches.push(m[0]);
      }
      return {error:'',matches};
    }catch(e){return {error:e instanceof Error?e.message:'정규식을 해석할 수 없습니다.',matches:[] as string[]};}
  },[pattern,flags,text]);
  return <div className="workspace">
    <div className="jsonEditorGrid">
      <label className="settingField"><span>정규식 패턴</span><input className="toolInput" value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="예: \\b[A-Z]+\\b" /></label>
      <label className="settingField"><span>플래그</span><input className="toolInput" value={flags} onChange={e=>setFlags(e.target.value)} placeholder="gim" /></label>
    </div>
    <label className="fieldLabel">테스트 텍스트</label>
    <textarea className="toolTextarea" value={text} onChange={e=>setText(e.target.value)} placeholder="정규식을 테스트할 텍스트를 입력하세요." />
    {result.error&&<div className="engineError">{result.error}</div>}
    <div className="resultPanel"><div className="workspaceHead"><strong>일치 결과</strong><span>{result.matches.length}개</span></div><div className="resultList">{result.matches.length?result.matches.map((m,i)=><div className="resultRow" key={`${m}-${i}`}><span>#{i+1}</span><code>{m||'(빈 문자열)'}</code></div>):<div className="resultRow"><span>일치하는 항목이 없습니다.</span></div>}</div></div>
    <p className="settingHint">브라우저 JavaScript의 RegExp 문법을 기준으로 검사합니다. 결과는 최대 200개까지 표시합니다.</p>
  </div>;
}
