'use client';

import { useMemo, useState } from 'react';

const INFO: Record<string, { title: string; description: string; example: string }> = {
  A: { title: 'A', description: '도메인을 IPv4 주소에 연결합니다.', example: 'example.com. 3600 IN A 203.0.113.10' },
  AAAA: { title: 'AAAA', description: '도메인을 IPv6 주소에 연결합니다.', example: 'example.com. 3600 IN AAAA 2001:db8::10' },
  CNAME: { title: 'CNAME', description: '한 호스트 이름을 다른 정규 호스트 이름에 별칭으로 연결합니다.', example: 'www.example.com. 3600 IN CNAME example.com.' },
  MX: { title: 'MX', description: '도메인의 메일 수신 서버와 우선순위를 지정합니다.', example: 'example.com. 3600 IN MX 10 mail.example.com.' },
  TXT: { title: 'TXT', description: 'SPF, 소유권 검증 등 임의의 텍스트 정보를 저장합니다.', example: 'example.com. 3600 IN TXT "v=spf1 include:_spf.example.net ~all"' },
  NS: { title: 'NS', description: '도메인의 권한 있는 네임서버를 지정합니다.', example: 'example.com. 86400 IN NS ns1.example.net.' },
  SRV: { title: 'SRV', description: '서비스의 호스트, 포트, 우선순위와 가중치를 지정합니다.', example: '_sip._tcp.example.com. 3600 IN SRV 10 5 5060 sip.example.com.' },
  CAA: { title: 'CAA', description: 'TLS 인증서를 발급할 수 있는 인증기관을 제한합니다.', example: 'example.com. 3600 IN CAA 0 issue "letsencrypt.org"' },
};

function parseRecord(line: string) {
  const clean = line.trim();
  if (!clean) return null;
  const parts = clean.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [];
  const typeIndex = parts.findIndex((p) => INFO[p.toUpperCase()]);
  if (typeIndex < 0) return { error: '지원하는 DNS 레코드 형식을 찾지 못했습니다.' } as const;
  const type = parts[typeIndex].toUpperCase();
  const name = parts[0] ?? '';
  const ttl = parts.slice(1, typeIndex).find((p) => /^\d+$/.test(p)) ?? '미지정';
  const value = parts.slice(typeIndex + 1).join(' ');
  return { type, name, ttl, value } as const;
}

export default function DnsRecordHelper() {
  const [type, setType] = useState('A');
  const [record, setRecord] = useState('example.com. 3600 IN A 203.0.113.10');
  const parsed = useMemo(() => parseRecord(record), [record]);
  const info = INFO[type];

  return <div className="workspace">
    <div className="jsonEditorGrid">
      <label className="settingField"><span>레코드 종류</span><select className="toolInput" value={type} onChange={(e) => { const next = e.target.value; setType(next); setRecord(INFO[next].example); }}>{Object.keys(INFO).map((key) => <option key={key} value={key}>{key}</option>)}</select></label>
      <div className="resultPanel" style={{ padding: 16 }}><strong>{info.title} 레코드</strong><p style={{ marginBottom: 0 }}>{info.description}</p></div>
    </div>
    <label className="settingField"><span>DNS 레코드 붙여넣기</span><textarea className="toolTextarea" value={record} onChange={(e) => setRecord(e.target.value)} placeholder={info.example} /></label>
    {parsed && 'error' in parsed && <div className="engineError">{parsed.error}</div>}
    {parsed && !('error' in parsed) && <div className="resultPanel"><div className="resultList"><div className="resultRow"><span>Type</span><code>{parsed.type}</code></div><div className="resultRow"><span>Name</span><code>{parsed.name}</code></div><div className="resultRow"><span>TTL</span><code>{parsed.ttl}</code></div><div className="resultRow"><span>Value</span><code>{parsed.value || '-'}</code></div></div></div>}
    <div className="resultPanel" style={{ padding: 16 }}><strong>예시</strong><code style={{ display: 'block', marginTop: 10, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{info.example}</code></div>
    <p className="settingHint">이 도구는 DNS 서버에 실제 조회 요청을 보내지 않고, 레코드 문법을 해석하고 의미를 설명하는 보조 도구입니다.</p>
  </div>;
}
