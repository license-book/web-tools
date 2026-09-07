'use client';

import { useMemo, useState } from 'react';

const statuses = [
  [100,'Continue','요청을 계속 진행할 수 있습니다.'],[101,'Switching Protocols','프로토콜 전환 요청을 수락했습니다.'],[200,'OK','요청이 정상적으로 처리되었습니다.'],[201,'Created','새 리소스가 생성되었습니다.'],[202,'Accepted','요청을 접수했지만 처리가 완료되지는 않았습니다.'],[204,'No Content','성공했지만 응답 본문이 없습니다.'],[301,'Moved Permanently','리소스가 영구적으로 이동했습니다.'],[302,'Found','리소스가 임시로 다른 위치에 있습니다.'],[304,'Not Modified','캐시된 리소스를 그대로 사용할 수 있습니다.'],[307,'Temporary Redirect','메서드를 유지한 임시 리다이렉트입니다.'],[308,'Permanent Redirect','메서드를 유지한 영구 리다이렉트입니다.'],[400,'Bad Request','잘못된 요청입니다.'],[401,'Unauthorized','인증이 필요합니다.'],[403,'Forbidden','권한이 없어 접근할 수 없습니다.'],[404,'Not Found','요청한 리소스를 찾을 수 없습니다.'],[405,'Method Not Allowed','허용되지 않은 HTTP 메서드입니다.'],[408,'Request Timeout','요청 시간이 초과되었습니다.'],[409,'Conflict','현재 리소스 상태와 요청이 충돌합니다.'],[413,'Content Too Large','요청 본문이 너무 큽니다.'],[415,'Unsupported Media Type','지원하지 않는 미디어 타입입니다.'],[422,'Unprocessable Content','문법은 맞지만 의미상 처리할 수 없습니다.'],[429,'Too Many Requests','너무 많은 요청을 보냈습니다.'],[500,'Internal Server Error','서버 내부 오류입니다.'],[501,'Not Implemented','서버가 해당 기능을 지원하지 않습니다.'],[502,'Bad Gateway','게이트웨이 또는 프록시가 잘못된 응답을 받았습니다.'],[503,'Service Unavailable','서버를 일시적으로 사용할 수 없습니다.'],[504,'Gateway Timeout','게이트웨이 응답 시간이 초과되었습니다.']
] as const;

export default function HttpStatusLookup() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return statuses;
    return statuses.filter(([code, name, desc]) => String(code).includes(q) || name.toLowerCase().includes(q) || desc.includes(query.trim()));
  }, [query]);
  return <div className="workspace">
    <input className="toolInput" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 404, Not Found, 인증" />
    <div className="resultPanel"><div className="workspaceHead"><strong>HTTP 상태코드</strong><span>{filtered.length}개 결과</span></div><div className="resultList">{filtered.map(([code,name,desc]) => <div className="resultRow" key={code}><div><strong>{code} · {name}</strong><div style={{ color:'#64748b', fontSize:13, marginTop:4 }}>{desc}</div></div><span className="badge">{Math.floor(code/100)}xx</span></div>)}</div></div>
    <p className="settingHint">웹 개발에서 자주 접하는 대표 HTTP 상태코드를 빠르게 확인할 수 있습니다.</p>
  </div>;
}
