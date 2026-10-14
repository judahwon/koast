import type { ImageMetadata } from 'astro';

// 이미지 파일을 png/jpg 로 바꿔 끼워도 import 가 깨지지 않도록 확장자를 glob 로 흡수한다.
const CANDIDATE_IMAGES = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/careers/candidate-*.{png,jpg,jpeg,webp,avif}',
  { eager: true },
);

const candidateImage = (n: number): ImageMetadata | undefined => {
  const stem = `candidate-${ String(n).padStart(2, '0') }.`;
  const path = Object.keys(CANDIDATE_IMAGES).find((key) => key.includes(stem));
  return path ? CANDIDATE_IMAGES[path].default : undefined;
};

export const CAREERS_INTRO = {
  title: '해양·기상 데이터 기술의 미래를 함께 만들 동료를 찾습니다.',
  description:
    '한국해양기상기술은 바다와 대기의 데이터를 수집하고, 분석하고, 예측하고, 시각화하는 시스템을 만듭니다. 우리가 만드는 기술은 해양 안전, 기상 서비스, 재난 대응, 연구 분석, 공공 데이터 활용에 쓰입니다.',
};

export interface CandidateItem {
  icon?: string;
  label: string;
  text: string;
  image?: ImageMetadata;
}

export const IDEAL_CANDIDATE: CandidateItem[] = [
  { icon: 'Waves', label: '도메인에 대한 관심', text: '해양·기상·환경 데이터에 관심 있는 분', image: candidateImage(1) },
  { icon: 'LineChart', label: '데이터를 보여주는 감각', text: '복잡한 데이터를 이해하기 쉽게 표현하는 일에 흥미가 있는 분', image: candidateImage(2) },
  { icon: 'Layers', label: '폭넓은 기술 경험', text: '웹, 서버, GIS, 데이터 처리, 하드웨어 연동 경험이 있는 분', image: candidateImage(3) },
  { icon: 'Sparkles', label: '배우고 적용하는 힘', text: '새로운 기술을 배우고 실제 시스템에 적용하는 것을 좋아하는 분', image: candidateImage(4) },
];

export const WORK_CULTURE = [
  { icon: 'Users', text: '도메인 전문가와 개발자가 함께 문제 해결' },
  { icon: 'Building', text: '공공기관·연구기관 중심의 안정적인 프로젝트' },
  { icon: 'Radar', text: '실제 현장 데이터와 운영 시스템을 다루는 경험' },
  { icon: 'Cpu', text: '소프트웨어와 하드웨어를 함께 이해할 수 있는 환경' },
  { icon: 'Workflow', text: '연구개발과 실무 프로젝트가 연결되는 업무 구조' },
];

export const BENEFITS = [
  { icon: 'Clock', label: '유연한 근무문화' },
  { icon: 'BookOpen', label: '자기계발 지원' },
  { icon: 'GraduationCap', label: '교육 및 세미나 참여' },
  { icon: 'Heart', label: '장기근속 지원' },
  { icon: 'Award', label: '프로젝트 성과 공유' },
  { icon: 'Coffee', label: '쾌적한 업무환경' },
];

export const HIRING_PROCESS = [
  { step: '01', icon: 'FileText', title: '지원서 접수', description: '이력서 및 자기소개서 제출' },
  { step: '02', icon: 'Search', title: '서류 검토', description: '지원서 검토 후 결과 안내' },
  { step: '03', icon: 'MessageSquare', title: '실무 면접', description: '직무 역량 및 문화 적합성 확인' },
  { step: '04', icon: 'CheckCircle', title: '최종 합류', description: '처우 협의 및 입사' },
];
