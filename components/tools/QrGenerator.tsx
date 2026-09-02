'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

type ErrorLevel = 'L' | 'M' | 'Q' | 'H';

export default function QrGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [value, setValue] = useState('https://');
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [level, setLevel] = useState<ErrorLevel>('M');
  const [dark, setDark] = useState('#111827');
  const [light, setLight] = useState('#ffffff');
  const [error, setError] = useState('');

  const renderQr = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !value.trim()) return;
    try {
      setError('');
      await QRCode.toCanvas(canvas, value.trim(), {
        width: size,
        margin,
        errorCorrectionLevel: level,
        color: { dark, light },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'QR 코드를 만들지 못했습니다.');
    }
  };

  useEffect(() => {
    void renderQr();
  }, [value, size, margin, level, dark, light]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="compressorWorkspace">
      <div className="compressorIntro"><div><span className="engineBadge">브라우저 처리</span><h2>텍스트나 URL을 QR 코드로 만드세요</h2><p>입력 내용은 서버로 전송하지 않고 브라우저에서 QR 이미지로 생성합니다.</p></div></div>
      <div className="qrGrid">
        <section className="qrEditor">
          <label className="settingField"><span>내용</span><textarea className="toolTextarea qrTextarea" value={value} onChange={event => setValue(event.target.value)} placeholder="https://example.com 또는 텍스트를 입력하세요" /></label>
          <div className="qrSettingGrid">
            <label className="settingField"><span>크기</span><select value={size} onChange={event => setSize(Number(event.target.value))}><option value={240}>240px</option><option value={320}>320px</option><option value={480}>480px</option><option value={640}>640px</option></select></label>
            <label className="settingField"><span>여백</span><select value={margin} onChange={event => setMargin(Number(event.target.value))}><option value={1}>좁게</option><option value={2}>보통</option><option value={4}>넓게</option></select></label>
            <label className="settingField"><span>오류 복원</span><select value={level} onChange={event => setLevel(event.target.value as ErrorLevel)}><option value="L">낮음</option><option value="M">보통</option><option value="Q">높음</option><option value="H">매우 높음</option></select></label>
          </div>
          <div className="qrColorGrid">
            <label className="settingField"><span>QR 색상</span><input className="qrColorInput" type="color" value={dark} onChange={event => setDark(event.target.value)} /></label>
            <label className="settingField"><span>배경 색상</span><input className="qrColorInput" type="color" value={light} onChange={event => setLight(event.target.value)} /></label>
          </div>
          <p className="settingHint">실제 사용 전에는 휴대폰 카메라로 한 번 스캔해 확인하는 것을 권장합니다.</p>
        </section>
        <aside className="qrPreview">
          <span className="fieldLabel">미리보기</span>
          <div className="qrCanvasWrap"><canvas ref={canvasRef} aria-label="생성된 QR 코드" /></div>
          <button className="primaryButton" type="button" onClick={downloadPng} disabled={!value.trim()}>PNG 다운로드</button>
        </aside>
      </div>
      {error && <div className="engineError" role="alert">{error}</div>}
    </div>
  );
}
