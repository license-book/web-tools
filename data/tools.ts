import type { ToolDefinition } from '@/types/tool';

export const categories = [
  { slug: 'image', name: '이미지', description: '압축, 변환, 크기 조정 등 이미지 작업 도구' },
  { slug: 'pdf', name: 'PDF', description: 'PDF 변환, 병합, 분할 등 문서 작업 도구' },
  { slug: 'text', name: '텍스트', description: '텍스트 정리, 변환, 비교 등 생산성 도구' },
  { slug: 'developer', name: '개발', description: '개발자에게 필요한 인코딩, 포맷팅, 검사 도구' },
  { slug: 'design', name: '디자인', description: '색상, 비율, 레이아웃 관련 디자인 도구' },
  { slug: 'utility', name: '기타', description: 'QR, 난수, 시간 등 자주 쓰는 웹 유틸리티' },
] as const;

export const tools: ToolDefinition[] = [
  { slug:'image-compressor', title:'이미지 압축', shortDescription:'브라우저에서 빠르게 이미지 용량을 줄입니다.', description:'업로드한 이미지를 서버에 저장하지 않고 브라우저에서 처리하는 이미지 압축 도구입니다.', category:'image', keywords:['이미지 압축','사진 용량 줄이기','webp','jpg'], featured:true, badge:'사용 가능' },
  { slug:'image-converter', title:'이미지 형식 변환', shortDescription:'JPG, PNG, WebP 이미지를 원하는 형식으로 변환합니다.', description:'이미지를 서버에 저장하지 않고 브라우저에서 JPG, PNG, WebP 형식으로 변환하는 무료 도구입니다.', category:'image', keywords:['이미지 변환','JPG 변환','PNG 변환','WebP 변환','사진 변환'], featured:true, badge:'사용 가능' },
  { slug:'image-resizer', title:'이미지 크기 조정', shortDescription:'가로·세로 픽셀을 지정해 이미지 크기를 빠르게 변경합니다.', description:'원본 비율 유지 여부를 선택하고 여러 이미지의 크기를 브라우저에서 한 번에 조정하는 무료 도구입니다.', category:'image', keywords:['이미지 리사이즈','사진 크기 조절','이미지 사이즈 변경','픽셀 변경','resize image'], featured:true, badge:'사용 가능' },
  { slug:'pdf-merge', title:'PDF 병합', shortDescription:'여러 PDF를 원하는 순서대로 하나의 PDF로 합칩니다.', description:'PDF 파일을 서버에 업로드하지 않고 브라우저에서 순서를 정해 하나의 PDF로 병합하는 무료 도구입니다.', category:'pdf', keywords:['PDF 병합','PDF 합치기','PDF merge','PDF 파일 합치기'], featured:true, badge:'사용 가능' },
  { slug:'pdf-split', title:'PDF 분할', shortDescription:'원하는 페이지만 추출하거나 모든 페이지를 각각 나눕니다.', description:'PDF를 서버에 업로드하지 않고 브라우저에서 원하는 페이지 범위를 추출하거나 페이지별 파일로 분할하는 무료 도구입니다.', category:'pdf', keywords:['PDF 분할','PDF 페이지 추출','PDF 나누기','PDF split'], featured:true, badge:'사용 가능' },
  { slug:'text-cleaner', title:'텍스트 정리', shortDescription:'공백, 빈 줄, 줄 여백을 정리하고 대소문자와 줄 순서를 바꿉니다.', description:'텍스트를 서버에 전송하지 않고 브라우저에서 공백 정리, 빈 줄 정리, 줄 앞뒤 공백 제거, 대소문자 변환, 줄 정렬을 처리하는 무료 도구입니다.', category:'text', keywords:['텍스트 정리','공백 제거','빈줄 제거','대소문자 변환','문자열 정리','text cleaner'], featured:true, badge:'사용 가능' },
  { slug:'qr-generator', title:'QR 코드 생성기', shortDescription:'URL과 텍스트를 QR 코드로 만듭니다.', description:'주소나 텍스트를 입력해 바로 사용할 수 있는 QR 코드를 브라우저에서 생성하고 PNG로 저장하는 도구입니다.', category:'utility', keywords:['QR','QR 코드','링크 QR','QR 생성','QR code generator'], featured:true, badge:'사용 가능' },
  { slug:'json-formatter', title:'JSON 정리', shortDescription:'JSON을 보기 좋게 정렬하고 검사합니다.', description:'JSON 데이터를 정렬하고 문법 오류를 빠르게 확인하는 개발 도구입니다.', category:'developer', keywords:['JSON','formatter','validator','JSON 정리','JSON 검사'], featured:true, badge:'사용 가능' },
];

export const getTool = (slug: string) => tools.find((tool) => tool.slug === slug);
export const getCategoryTools = (category: string) => tools.filter((tool) => tool.category === category);
