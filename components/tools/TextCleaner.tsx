'use client';

import { useMemo, useState } from 'react';

type CleanMode = 'spaces' | 'blank-lines' | 'trim-lines' | 'lowercase' | 'uppercase' | 'sort-lines';

const countWords = (value: string) => value.trim() ? value.trim().split(/\s+/).length : 0;
const countLines = (value: string) => value ? value.split(/\r?\n/).length : 0;

function cleanText(value: string, mode: CleanMode) {
  switch (mode) {
    case 'spaces':
      return value
        .split(/\r?\n/)
        .map(line => line.replace(/[ \t]+/g, ' ').trimEnd())
        .join('\n')
        .trim();
    case 'blank-lines':
      return value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    case 'trim-lines':
      return value.split(/\r?\n/).map(line => line.trim()).join('\n').trim();
    case 'lowercase':
      return value.toLowerCase();
    case 'uppercase':
      return value.toUpperCase();
    case 'sort-lines':
      return value
        .split(/\r?\n/)
        .filter(line => line.trim().length > 0)
        .sort((a, b) => a.localeCompare(b, 'ko'))
        .join('\n');
  }
}

export default function TextCleaner() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [message, setMessage] = useState('');

  const inputStats = useMemo(() => ({ chars: input.length, words: countWords(input), lines: countLines(input) }), [input]);
  const outputStats = useMemo(() => ({ chars: output.length, words: countWords(output), lines: countLines(output) }), [output]);

  const apply = (mode: CleanMode) => {
    if (!input) {
      setMessage('정리할 텍스트를 입력해주세요.');
      return;
    }
    setOutput(cleanText(input, mode));
    setMessage('텍스트 정리가 완료되었습니다.');
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setMessage('결과를 클립보드에 복사했습니다.');
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cleaned-text.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setInput('');
    setOutput('');
    setMessage('');
  };

  return (
    <div className="workspace jsonWorkspace">
      <div className="workspaceHead jsonHead">
        <div>
          <span className="engineBadge">브라우저 처리</span>
          <h2>복잡한 텍스트를 한 번에 정리하세요</h2>
          <p>공백, 빈 줄, 줄 앞뒤 여백을 정리하거나 대소문자 변환과 줄 정렬을 할 수 있습니다.</p>
        </div>
      </div>

      <div className="jsonToolbar">
        <div className="jsonActions">
          <button className="primaryButton" type="button" onClick={() => apply('spaces')}>중복 공백 제거</button>
          <button className="primaryButton" type="button" onClick={() => apply('blank-lines')}>빈 줄 정리</button>
          <button className="primaryButton" type="button" onClick={() => apply('trim-lines')}>줄 앞뒤 공백 제거</button>
          <button className="downloadButton" type="button" onClick={() => apply('lowercase')}>소문자로</button>
          <button className="downloadButton" type="button" onClick={() => apply('uppercase')}>대문자로</button>
          <button className="downloadButton" type="button" onClick={() => apply('sort-lines')}>줄 가나다순 정렬</button>
        </div>
        <button className="textButton" type="button" onClick={reset}>전체 초기화</button>
      </div>

      <div className="jsonEditorGrid">
        <section className="jsonPane">
          <div className="jsonPaneHead">
            <strong>원본 텍스트</strong>
            <small>{inputStats.chars.toLocaleString()}자 · {inputStats.words.toLocaleString()}단어 · {inputStats.lines.toLocaleString()}줄</small>
          </div>
          <textarea
            className="toolTextarea jsonTextarea"
            value={input}
            onChange={event => { setInput(event.target.value); setMessage(''); }}
            placeholder="정리할 텍스트를 붙여넣거나 입력하세요."
            spellCheck={false}
          />
        </section>

        <section className="jsonPane">
          <div className="jsonPaneHead">
            <div><strong>정리 결과</strong><small>{outputStats.chars.toLocaleString()}자 · {outputStats.words.toLocaleString()}단어 · {outputStats.lines.toLocaleString()}줄</small></div>
            <div>
              <button className="textButton" type="button" onClick={copy} disabled={!output}>복사</button>
              <button className="textButton" type="button" onClick={download} disabled={!output}>TXT 저장</button>
            </div>
          </div>
          <textarea
            className="toolTextarea jsonTextarea"
            value={output}
            onChange={event => setOutput(event.target.value)}
            placeholder="정리 결과가 여기에 표시됩니다."
            spellCheck={false}
          />
        </section>
      </div>

      {message && <div className="engineSuccess" aria-live="polite">✓ {message}</div>}
    </div>
  );
}
