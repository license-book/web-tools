'use client';

import { useMemo, useRef, useState } from 'react';

type Area={id:number;shape:'rect'|'circle';coords:number[];href:string;alt:string;target:boolean};

export default function ImageMapGenerator(){
 const [src,setSrc]=useState(''); const [name,setName]=useState('image-map'); const [areas,setAreas]=useState<Area[]>([]); const [shape,setShape]=useState<'rect'|'circle'>('rect'); const [start,setStart]=useState<{x:number;y:number}|null>(null); const img=useRef<HTMLImageElement>(null);
 const point=(e:React.MouseEvent<HTMLImageElement>)=>{const r=e.currentTarget.getBoundingClientRect();return {x:Math.round((e.clientX-r.left)*e.currentTarget.naturalWidth/r.width),y:Math.round((e.clientY-r.top)*e.currentTarget.naturalHeight/r.height)}};
 const down=(e:React.MouseEvent<HTMLImageElement>)=>setStart(point(e));
 const up=(e:React.MouseEvent<HTMLImageElement>)=>{if(!start)return;const p=point(e);let coords:number[];if(shape==='rect')coords=[Math.min(start.x,p.x),Math.min(start.y,p.y),Math.max(start.x,p.x),Math.max(start.y,p.y)];else coords=[start.x,start.y,Math.max(1,Math.round(Math.hypot(p.x-start.x,p.y-start.y)))];setAreas(a=>[...a,{id:Date.now(),shape,coords,href:'#',alt:'',target:false}]);setStart(null)};
 const code=useMemo(()=>{const rows=areas.map(a=>`  <area shape="${a.shape}" coords="${a.coords.join(',')}" href="${a.href||'#'}" alt="${a.alt}"${a.target?' target="_blank"':''}>`).join('\n');return `<img src="${src?'IMAGE_URL':'IMAGE_URL'}" usemap="#${name}" alt="">\n<map name="${name}">\n${rows}${rows?'\n':''}</map>`},[areas,name,src]);
 const upload=(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;if(src)URL.revokeObjectURL(src);setSrc(URL.createObjectURL(f));setAreas([])};
 const patch=(id:number,k:'href'|'alt'|'target',v:string|boolean)=>setAreas(a=>a.map(x=>x.id===id?{...x,[k]:v}:x));
 return <div className="workspace">
  <div className="workspaceAction"><label className="settingField"><span>이미지 업로드</span><input type="file" accept="image/*" onChange={upload}/></label><label className="settingField"><span>영역 모양</span><select value={shape} onChange={e=>setShape(e.target.value as 'rect'|'circle')}><option value="rect">사각형</option><option value="circle">원형</option></select></label><label className="settingField"><span>Map 이름</span><input value={name} onChange={e=>setName(e.target.value.replace(/[^a-zA-Z0-9_-]/g,''))}/></label></div>
  <p className="settingHint">이미지에서 클릭 영역의 시작점과 끝점을 드래그하세요. 원형은 중심에서 바깥쪽으로 드래그합니다.</p>
  {src&&<div style={{overflow:'auto',margin:'16px 0',border:'1px solid #e5e7eb',borderRadius:12,padding:12}}><img ref={img} src={src} alt="이미지맵 작업 이미지" onMouseDown={down} onMouseUp={up} draggable={false} style={{maxWidth:'100%',height:'auto',display:'block',cursor:'crosshair',userSelect:'none'}}/></div>}
  {areas.map((a,i)=><div key={a.id} className="workspaceAction" style={{alignItems:'end'}}><strong>영역 {i+1}</strong><span className="settingHint">{a.shape} · {a.coords.join(', ')}</span><label className="settingField"><span>링크 URL</span><input value={a.href} onChange={e=>patch(a.id,'href',e.target.value)}/></label><label className="settingField"><span>대체 텍스트</span><input value={a.alt} onChange={e=>patch(a.id,'alt',e.target.value)}/></label><label><input type="checkbox" checked={a.target} onChange={e=>patch(a.id,'target',e.target.checked)}/> 새 창</label><button className="textButton" onClick={()=>setAreas(x=>x.filter(v=>v.id!==a.id))}>삭제</button></div>)}
  <div className="jsonPane"><div className="workspaceHead" style={{padding:0,background:'transparent',border:0}}><span className="fieldLabel">HTML 이미지맵 코드</span><button className="textButton" disabled={!areas.length} onClick={()=>navigator.clipboard.writeText(code)}>복사</button></div><textarea className="toolTextarea jsonTextarea" readOnly value={code}/></div>
 </div>
}