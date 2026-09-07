'use client';

import { useMemo, useState } from 'react';

function ipToInt(ip: string) {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) throw new Error('올바른 IPv4 주소를 입력하세요.');
  return (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
}

function intToIp(n: number) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export default function IpSubnetCalculator() {
  const [ip, setIp] = useState('192.168.1.10');
  const [cidr, setCidr] = useState('24');

  const result = useMemo(() => {
    try {
      const prefix = Number(cidr);
      if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) throw new Error('CIDR은 0~32 사이여야 합니다.');
      const ipInt = ipToInt(ip);
      const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const network = (ipInt & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;
      const total = 2 ** (32 - prefix);
      const usable = prefix >= 31 ? total : Math.max(0, total - 2);
      const first = prefix >= 31 ? network : network + 1;
      const last = prefix >= 31 ? broadcast : broadcast - 1;
      return {
        error: '',
        rows: [
          ['네트워크 주소', intToIp(network)],
          ['브로드캐스트', intToIp(broadcast)],
          ['서브넷 마스크', intToIp(mask)],
          ['첫 사용 가능 IP', intToIp(first >>> 0)],
          ['마지막 사용 가능 IP', intToIp(last >>> 0)],
          ['전체 주소 수', total.toLocaleString()],
          ['사용 가능 호스트', usable.toLocaleString()],
        ] as [string, string][],
      };
    } catch (e) {
      return { error: e instanceof Error ? e.message : '계산할 수 없습니다.', rows: [] as [string, string][] };
    }
  }, [ip, cidr]);

  return <div className="workspace">
    <div className="jsonEditorGrid">
      <label className="settingField"><span>IPv4 주소</span><input className="toolInput" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="192.168.1.10" /></label>
      <label className="settingField"><span>CIDR Prefix</span><input className="toolInput" type="number" min="0" max="32" value={cidr} onChange={(e) => setCidr(e.target.value)} placeholder="24" /></label>
    </div>
    {result.error ? <div className="engineError">{result.error}</div> : <div className="resultPanel"><div className="workspaceHead"><strong>Subnet 결과</strong><span>{ip}/{cidr}</span></div><div className="resultList">{result.rows.map(([label, value]) => <div className="resultRow" key={label}><div><strong>{label}</strong><div style={{ marginTop: 5, color: '#64748b' }}>{value}</div></div><button className="textButton" type="button" onClick={() => navigator.clipboard.writeText(value)}>복사</button></div>)}</div></div>}
    <p className="settingHint">IPv4 CIDR 기준으로 네트워크·브로드캐스트·호스트 범위를 계산합니다. /31과 /32는 특수 용도로 전체 주소를 사용 가능 주소로 표시합니다.</p>
  </div>;
}
