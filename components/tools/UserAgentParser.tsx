'use client';

import { useMemo, useState } from 'react';

function parseUa(ua: string) {
  const browser = /Edg\/(\d+[\d.]*)/.exec(ua) ? ['Edge', RegExp.$1] : /Chrome\/(\d+[\d.]*)/.exec(ua) ? ['Chrome', RegExp.$1] : /Firefox\/(\d+[\d.]*)/.exec(ua) ? ['Firefox', RegExp.$1] : /Version\/(\d+[\d.]*).*Safari/.exec(ua) ? ['Safari', RegExp.$1] : /MSIE\s(\d+[\d.]*)|Trident.*rv:(\d+[\d.]*)/.exec(ua) ? ['Internet Explorer', RegExp.$1 || RegExp.$2] : ['알 수 없음', ''];
  let os = '알 수 없음';
  if (/Windows NT 10\.0/.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1';
  else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7';
  else if (/Android\s([\d.]+)/.test(ua)) os = `Android ${RegExp.$1}`;
  else if (/iPhone OS ([\d_]+)/.test(ua)) os = `iOS ${RegExp.$1.replace(/_/g, '.')}`;
  else if (/iPad; CPU OS ([\d_]+)/.test(ua)) os = `iPadOS ${RegExp.$1.replace(/_/g, '.')}`;
  else if (/Mac OS X ([\d_]+)/.test(ua)) os = `macOS ${RegExp.$1.replace(/_/g, '.')}`;
  else if (/Linux/.test(ua)) os = 'Linux';

  const device = /iPad|Tablet/.test(ua) ? '태블릿' : /Mobi|Android|iPhone/.test(ua) ? '모바일' : '데스크톱';
  const engine = /AppleWebKit/.test(ua) ? 'WebKit/Blink 계열' : /Gecko\//.test(ua) ? 'Gecko 계열' : '알 수 없음';
  return { browser: browser[0], version: browser[1], os, device, engine };
}

export default function UserAgentParser() {
  const [value, setValue] = useState(typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const parsed = useMemo(() => parseUa(value), [value]);
  const rows = [
    ['브라우저', parsed.browser],
    ['브라우저 버전', parsed.version || '(확인 불가)'],
    ['운영체제', parsed.os],
    ['기기 유형', parsed.device],
    ['렌더링 엔진', parsed.engine],
  ];

  return <div className="workspace">
    <label className="settingField"><span>User-Agent 문자열</span><textarea className="toolTextarea" value={value} onChange={(e) => setValue(e.target.value)} placeholder="User-Agent 문자열을 입력하세요." /></label>
    <div className="workspaceAction"><button className="textButton" type="button" onClick={() => setValue(navigator.userAgent)}>현재 브라우저 값 불러오기</button><button className="textButton" type="button" onClick={() => setValue('')}>초기화</button></div>
    <div className="resultPanel"><div className="workspaceHead"><strong>분석 결과</strong><span>{parsed.device}</span></div><div className="resultList">{rows.map(([label, data]) => <div className="resultRow" key={label}><div><strong>{label}</strong><div style={{ marginTop: 5, color: '#64748b' }}>{data}</div></div><button className="textButton" type="button" onClick={() => navigator.clipboard.writeText(data)}>복사</button></div>)}</div></div>
    <p className="settingHint">대표 브라우저·운영체제를 빠르게 판별하는 경량 파서입니다. User-Agent 축소 정책이나 비표준 문자열에서는 세부 버전이 제한될 수 있습니다.</p>
  </div>;
}
