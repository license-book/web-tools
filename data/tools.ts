import type { ToolDefinition } from '@/types/tool';
export const categories = [
  { slug:'image',name:'이미지',description:'압축, 변환, 크기 조정 등 이미지 작업 도구' },
  { slug:'pdf',name:'PDF',description:'PDF 변환, 병합, 분할 등 문서 작업 도구' },
  { slug:'text',name:'텍스트',description:'텍스트 정리, 변환, 비교 등 생산성 도구' },
  { slug:'developer',name:'개발',description:'개발자에게 필요한 인코딩, 포맷팅, 검사 도구' },
  { slug:'design',name:'디자인',description:'색상, 비율, 레이아웃 관련 디자인 도구' },
  { slug:'utility',name:'기타',description:'QR, 난수, 시간 등 자주 쓰는 웹 유틸리티' },
] as const;

export const tools: ToolDefinition[] = [
  {slug:'image-compressor',title:'이미지 압축',shortDescription:'브라우저에서 빠르게 이미지 용량을 줄입니다.',description:'업로드한 이미지를 서버에 저장하지 않고 브라우저에서 처리하는 이미지 압축 도구입니다.',category:'image',keywords:['이미지 압축','사진 용량 줄이기','webp','jpg'],featured:true,badge:'사용 가능'},
  {slug:'image-converter',title:'이미지 형식 변환',shortDescription:'JPG, PNG, WebP 이미지를 원하는 형식으로 변환합니다.',description:'이미지를 서버에 저장하지 않고 브라우저에서 JPG, PNG, WebP 형식으로 변환하는 무료 도구입니다.',category:'image',keywords:['이미지 변환','JPG 변환','PNG 변환','WebP 변환','사진 변환'],featured:true,badge:'사용 가능'},
  {slug:'image-resizer',title:'이미지 크기 조정',shortDescription:'가로·세로 픽셀을 지정해 이미지 크기를 빠르게 변경합니다.',description:'원본 비율 유지 여부를 선택하고 여러 이미지의 크기를 브라우저에서 한 번에 조정하는 무료 도구입니다.',category:'image',keywords:['이미지 리사이즈','사진 크기 조절','이미지 사이즈 변경','픽셀 변경','resize image'],featured:true,badge:'사용 가능'},
  {slug:'image-to-pdf',title:'이미지 PDF 변환',shortDescription:'JPG·PNG 이미지를 원하는 순서대로 하나의 PDF로 만듭니다.',description:'여러 JPG·PNG 이미지를 서버에 업로드하지 않고 브라우저에서 순서를 정해 PDF로 변환하는 무료 도구입니다.',category:'pdf',keywords:['이미지 PDF 변환','JPG PDF','PNG PDF','사진 PDF','image to PDF'],featured:true,badge:'사용 가능'},
  {slug:'pdf-merge',title:'PDF 병합',shortDescription:'여러 PDF를 원하는 순서대로 하나의 PDF로 합칩니다.',description:'PDF 파일을 서버에 업로드하지 않고 브라우저에서 순서를 정해 하나의 PDF로 병합하는 무료 도구입니다.',category:'pdf',keywords:['PDF 병합','PDF 합치기','PDF merge','PDF 파일 합치기'],featured:true,badge:'사용 가능'},
  {slug:'pdf-split',title:'PDF 분할',shortDescription:'원하는 페이지만 추출하거나 모든 페이지를 각각 나눕니다.',description:'PDF를 서버에 업로드하지 않고 브라우저에서 원하는 페이지 범위를 추출하거나 페이지별 파일로 분할하는 무료 도구입니다.',category:'pdf',keywords:['PDF 분할','PDF 페이지 추출','PDF 나누기','PDF split'],featured:true,badge:'사용 가능'},
  {slug:'pdf-to-image',title:'PDF 이미지 변환',shortDescription:'PDF의 각 페이지를 PNG 또는 JPG 이미지로 변환합니다.',description:'PDF 파일을 서버에 업로드하지 않고 브라우저에서 각 페이지를 PNG 또는 JPG 이미지로 변환하고 저장하는 무료 도구입니다.',category:'pdf',keywords:['PDF 이미지 변환','PDF JPG','PDF PNG','PDF 사진 변환','PDF to image'],featured:true,badge:'사용 가능'},
  {slug:'text-cleaner',title:'텍스트 정리',shortDescription:'공백, 빈 줄, 줄 여백을 정리하고 대소문자와 줄 순서를 바꿉니다.',description:'텍스트를 서버에 전송하지 않고 브라우저에서 공백 정리, 빈 줄 정리, 줄 앞뒤 공백 제거, 대소문자 변환, 줄 정렬을 처리하는 무료 도구입니다.',category:'text',keywords:['텍스트 정리','공백 제거','빈줄 제거','대소문자 변환','문자열 정리','text cleaner'],featured:true,badge:'사용 가능'},
  {slug:'character-counter',title:'글자수 세기',shortDescription:'공백 포함·제외 글자 수와 단어·줄·바이트 수를 계산합니다.',description:'텍스트를 서버에 전송하지 않고 브라우저에서 공백 포함·제외 글자 수, 단어 수, 줄 수, UTF-8 바이트 수를 즉시 계산하는 무료 도구입니다.',category:'text',keywords:['글자수 세기','문자수 세기','공백 제외 글자수','바이트 계산','character counter'],featured:true,badge:'사용 가능'},
  {slug:'color-converter',title:'색상 코드 변환',shortDescription:'HEX, RGB, HSL 색상 코드를 실시간으로 변환합니다.',description:'색상 선택기와 HEX·RGB 입력을 이용해 HEX, RGB, HSL 값을 브라우저에서 즉시 변환하고 복사하는 무료 디자인 도구입니다.',category:'design',keywords:['색상 코드','HEX RGB 변환','RGB HSL','컬러 코드','color converter'],featured:true,badge:'사용 가능'},
  {slug:'qr-generator',title:'QR 코드 생성기',shortDescription:'URL과 텍스트를 QR 코드로 만듭니다.',description:'주소나 텍스트를 입력해 바로 사용할 수 있는 QR 코드를 브라우저에서 생성하고 PNG로 저장하는 도구입니다.',category:'utility',keywords:['QR','QR 코드','링크 QR','QR 생성','QR code generator'],featured:true,badge:'사용 가능'},
  {slug:'uuid-generator',title:'UUID 생성기',shortDescription:'UUID v4 값을 한 번에 최대 50개까지 생성합니다.',description:'브라우저의 보안 난수 기능을 사용해 RFC 4122 버전 4 형식 UUID를 여러 개 생성하고 복사하는 무료 도구입니다.',category:'utility',keywords:['UUID 생성기','UUID v4','GUID 생성','랜덤 UUID','UUID generator'],featured:true,badge:'사용 가능'},
  {slug:'json-formatter',title:'JSON 정리',shortDescription:'JSON을 보기 좋게 정렬하고 검사합니다.',description:'JSON 데이터를 정렬하고 문법 오류를 빠르게 확인하는 개발 도구입니다.',category:'developer',keywords:['JSON','formatter','validator','JSON 정리','JSON 검사'],featured:true,badge:'사용 가능'},
  {slug:'base64-tool',title:'Base64 인코더·디코더',shortDescription:'UTF-8 텍스트를 Base64로 인코딩하거나 다시 디코딩합니다.',description:'한글과 이모지를 포함한 UTF-8 텍스트를 브라우저에서 Base64로 인코딩하거나 Base64 문자열을 원문으로 디코딩하는 무료 개발 도구입니다.',category:'developer',keywords:['Base64 인코딩','Base64 디코딩','Base64 변환','인코더','디코더'],featured:true,badge:'사용 가능'},
  {slug:'jwt-decoder',title:'JWT 디코더',shortDescription:'JWT의 Header와 Payload를 보기 좋게 해석합니다.',description:'JWT 토큰의 Header와 Payload를 서버 전송 없이 브라우저에서 디코딩해 확인하는 무료 개발 도구입니다. 서명 검증은 수행하지 않습니다.',category:'developer',keywords:['JWT 디코더','JWT decode','JWT payload','JWT header','토큰 해석'],featured:true,badge:'사용 가능'},
  {slug:'url-codec',title:'URL 인코더·디코더',shortDescription:'URL 구성 요소를 안전하게 인코딩하거나 원문으로 복원합니다.',description:'URL과 쿼리 문자열에 사용할 텍스트를 브라우저에서 percent-encoding 방식으로 인코딩하거나 디코딩하는 무료 개발 도구입니다.',category:'developer',keywords:['URL 인코딩','URL 디코딩','percent encoding','encodeURIComponent','URL encoder'],featured:true,badge:'사용 가능'},
  {slug:'timestamp-converter',title:'Unix Timestamp 변환',shortDescription:'Unix 시간과 날짜·ISO 8601 형식을 서로 변환합니다.',description:'Unix timestamp 초·밀리초 값을 로컬 시간과 ISO 8601로 확인하고 날짜 입력을 timestamp로 변환하는 무료 개발 도구입니다.',category:'developer',keywords:['Unix timestamp','timestamp converter','타임스탬프 변환','epoch time','ISO 8601'],featured:true,badge:'사용 가능'},
  {slug:'hash-generator',title:'해시 생성기',shortDescription:'텍스트에서 SHA-1·256·384·512 해시를 생성합니다.',description:'Web Crypto API를 이용해 텍스트의 SHA 계열 해시를 브라우저에서 생성하고 복사하는 무료 개발 도구입니다.',category:'developer',keywords:['SHA256','SHA512','해시 생성기','hash generator','SHA-1'],featured:true,badge:'사용 가능'},
  {slug:'regex-tester',title:'정규식 테스트',shortDescription:'JavaScript 정규식 패턴과 플래그를 실시간으로 검사합니다.',description:'정규식 패턴과 테스트 텍스트를 입력해 JavaScript RegExp 기준의 일치 결과를 브라우저에서 즉시 확인하는 무료 개발 도구입니다.',category:'developer',keywords:['정규식 테스트','regex tester','RegExp','정규표현식','regex match'],featured:true,badge:'사용 가능'},
];

export const getTool=(slug:string)=>tools.find(tool=>tool.slug===slug);
export const getCategoryTools=(category:string)=>tools.filter(tool=>tool.category===category);
