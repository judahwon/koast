import type { ImageMetadata } from 'astro';

import illustAi from '@/assets/images/home/illust-ai.png';
import illustBigData from '@/assets/images/home/illust-bigdata.png';
import illustGis from '@/assets/images/home/illust-gis.png';
import partnerKma from '@/assets/images/home/partner-01-kma.png';
import partnerMof from '@/assets/images/home/partner-02-mof.png';
import partnerAmo from '@/assets/images/home/partner-03-amo.png';
import partnerNims from '@/assets/images/home/partner-04-nims.png';
import partnerKcg from '@/assets/images/home/partner-05-kcg.png';
import solutionBuoy from '@/assets/images/home/solution-buoy.jpg';
import solutionControl from '@/assets/images/home/solution-control.jpg';
import solutionVessel from '@/assets/images/home/solution-vessel.jpg';
import solutionTidal from '@/assets/images/home/solution-tidal.jpg';

export const HERO = {
  titleTop: '해양과 기상 데이터로',
  titleAccent: '안전한 미래',
  titleTail: '를 열다',
  subtitle: [
    '한국해양기상기술은 해양·기상·항공 분야의 데이터를 정제하여',
    '공공기관의 의사결정을 돕는 솔루션을 제시합니다.',
  ],
};

export interface Partner {
  name: string;
  logo: ImageMetadata;
}

export const PARTNERS: Partner[] = [
  { name: '기상청', logo: partnerKma },
  { name: '해양수산부', logo: partnerMof },
  { name: '항공기상청', logo: partnerAmo },
  { name: '국립기상과학원', logo: partnerNims },
  { name: '해양경찰청', logo: partnerKcg },
];

export interface BusinessArea {
  label: string;
  title: string;
  illustration: ImageMetadata;
}

export const BUSINESS_AREAS: BusinessArea[] = [
  { label: '영상·예측 분석', title: 'AI', illustration: illustAi },
  { label: '대용량 관측', title: 'Big Data', illustration: illustBigData },
  { label: '3D 공간정보', title: 'GIS', illustration: illustGis },
];

export interface SolutionFeature {
  title: string;
  description: string;
}

export interface Solution {
  id: string;
  code: string;
  shortName: string;
  title: string[];
  photo: ImageMetadata;
  features: SolutionFeature[];
  href: string;
}

export const HOME_SOLUTIONS: Solution[] = [
  {
    id: 'marine-data',
    code: 'Marine Data Platform',
    shortName: 'Marine Data Platform',
    title: ['해양 관측 데이터', '통합 수집·품질관리 플랫폼'],
    photo: solutionBuoy,
    features: [
      {
        title: '전 관측망 단일 수집 경로',
        description: '등표·부이·연안 관측 장비를 하나의 수집 경로로 묶어 장비가 늘어도 운영 부담이 늘지 않습니다.',
      },
      {
        title: '자동 품질관리(QC)',
        description: '결측·이상치를 규칙 기반으로 걸러내고 보정 이력을 남겨 자료의 신뢰도를 추적할 수 있습니다.',
      },
      {
        title: '표준 포맷 개방',
        description: 'NetCDF·GRIB2 등 표준 포맷과 API 로 개방해 연구·정책 어느 쪽에서도 바로 활용됩니다.',
      },
    ],
    href: '/services#observation',
  },
  {
    id: 'lamis',
    code: 'LAMIS Project',
    shortName: 'LAMIS Project',
    title: ['연안방재 관측망', '실시간 관제 시스템'],
    photo: solutionControl,
    features: [
      {
        title: '24시간 무중단 관제',
        description: '직접 운영하며 쌓은 노하우로 관측망 장애를 조기에 감지하고 대응 시간을 단축합니다.',
      },
      {
        title: '임계값 기반 자동 경보',
        description: '파고·풍속·수위가 기준을 넘으면 담당자에게 즉시 통보되어 상황 판단이 늦어지지 않습니다.',
      },
      {
        title: '관제 화면 맞춤 구성',
        description: '기관별 업무 흐름에 맞춰 대시보드와 권한을 설계해 화면을 옮겨 다닐 필요가 없습니다.',
      },
    ],
    href: '/services#system',
  },
  {
    id: 'digital-twin',
    code: 'Digital Twin Project',
    shortName: 'Digital Twin Project',
    title: ['해양 예측자료', '3D 디지털트윈 가시화'],
    photo: solutionTidal,
    features: [
      {
        title: '자체 3D 가시화 엔진',
        description: '조석·조류·해상상태 예측 격자를 3D 지구 위에서 끊김 없이 재생합니다.',
      },
      {
        title: '시간축 애니메이션',
        description: '예보 시점을 이동하며 바람·조류 벡터의 변화를 한 화면에서 비교할 수 있습니다.',
      },
      {
        title: '응용모델 표출',
        description: '유류오염 확산, 수색구조 표류 예측 결과를 같은 좌표계 위에 겹쳐 봅니다.',
      },
    ],
    href: '/services#visualization',
  },
  {
    id: 'iuu-em',
    code: 'IUU EM Project',
    shortName: 'IUU EM Project',
    title: ['불법 어업 방지', '모니터링 시스템'],
    photo: solutionVessel,
    features: [
      {
        title: '조업 영상 자동 분석',
        description: '전자 모니터링 영상에서 어획 활동을 자동 판별해 검토 대상을 사람이 볼 양으로 줄입니다.',
      },
      {
        title: '항적·조업 이력 대조',
        description: '선박 항적과 조업 기록을 나란히 대조해 신고 내용과 어긋나는 구간을 짚어냅니다.',
      },
      {
        title: '국제 규범 대응',
        description: 'IUU 관련 국제 보고 양식에 맞춰 근거 자료를 그대로 산출할 수 있습니다.',
      },
    ],
    href: '/services#si',
  },
];

export interface Stat {
  value: string;
  label: string;
  labelEn?: string;
}

export const STATS: Stat[] = [
  { value: '100+', label: '논문' },
  { value: '100억+', label: '누적 매출' },
  { value: '10+', label: '정부기관 표창 및 인증', labelEn: 'Awards' },
  { value: '15+', label: '정부 R&D 프로젝트 수행', labelEn: 'Gov R&D' },
];

export const QUALIFICATIONS = [
  '연구개발서비스업',
  '공간정보사업자',
  '기상사업자',
  '수도권기상청 표창',
  '신기술(NET) 인증',
];
