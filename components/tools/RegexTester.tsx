'use client';

import { useMemo, useState } from 'react';

export default function RegexTester(){
  const [pattern,setPattern]=useState('');
  const [flags,setFlags]=useState('g');
  const [text,setText]=useState('');
  const [replacement,setReplacement]=useState('');
  const result=useMemo(()=>{
    if(!pattern) return {error:'',matches:[] as string[],replaced:text};
    try{
      const safeFlags=Array.from(new Set(flags.split('').filter(f=>'gimsuy'.includes(f)))).join('');
      const re=new RegExp(pattern,safeFlags);
      const matches:string[]=[];
      const scan=new RegExp(pattern,safeFlags);
      if(safeFlags.includes('g')){
        let m:RegExpExecArray|null;
        while((m=scan.exec(text))!==null){matches.push(m[0]);if(m[0]==='') scan.lastIndex++;if(matches.length>=200) break;}
      }else{
        const m=scan.exec(text);if(m) matches.push(m[0]);
      }
      return {error:'',matches,replaced:text.replace(re,replacement)};
    }catch(e){return {error:e instanceof Error?e.message:'정규식을 해석할 수 없습니다.',matches:[] as string[],replaced:''};}
  },[pattern,flags,text,replacement]);
  return <div className="workspace">
    <div className="jsonEditorGrid">
      <label className="settingField"><span>정규식 패턴</span><input className="toolInput" value={pattern} onChange={e=>setPattern(e.target.value)} placeholder="예: \\b[A-Z]+\\b" /></label>
      <label className="settingField"><span>플래그</span><input className="toolInput" value={flags} onChange={e=>setFlags(e.target.value)} placeholder="gim" /></label>
    </div>
    <label className="fieldLabel">테스트 텍스트</label>
    <textarea className="toolTextarea" value={text} onChange={e=>setText(e.target.value)} placeholder="정규식을 테스트할 텍스트를 입력하세요." />
    <label className="settingField"><span>치환 문자열</span><input className="toolInput" value={replacement} onChange={e=>setReplacement(e.target.value)} placeholder="예: [$&] 또는 $1" /><small>$&, $1 같은 JavaScript replace 치환 문법을 사용할 수 있습니다.</small></label>
    {result.error&&<div className="engineError">{result.error}</div>}
    <div className="resultPanel"><div className="workspaceHead"><strong>일치 결과</strong><span>{result.matches.length}개</span></div><div className="resultList">{result.matches.length?result.matches.map((m,i)=><div className="resultRow" key={`${m}-${i}`}><span>#{i+1}</span><code>{m||'(빈 문자열)'}</code></div>):<div className="resultRow"><span>일치하는 항목이 없습니다.</span></div>}</div></div>
    <div className="resultPanel"><div className="workspaceHead"><strong>치환 미리보기</strong><button className="textButton" type="button" onClick={()=>navigator.clipboard.writeText(result.replaced).catch(()=>undefined)}>복사</button></div><textarea className="toolTextarea" value={result.error?'':result.replaced} readOnly /></div>
    <p className="settingHint">브라우저 JavaScript의 RegExp 문법을 기준으로 검사합니다. 일치 결과는 최대 200개까지 표시합니다.</p>
  </div>;
}
