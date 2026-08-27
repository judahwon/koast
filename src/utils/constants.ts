const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

export const SITE = {
  name: '한국해양기상기술',
  url: 'https://judahwon.github.io',
  base: BASE_PATH,
  description:
    '해양·기상 데이터를 수집·예측·시각화하고, AI 기술로 더 정확한 의사결정을 지원하는 통합 기술기업입니다.',
  locale: 'ko_KR',
  ogImage: `${ BASE_PATH }/images/og-image.png`,
};

export const NAV_LINKS = [
  { label: '회사소개', href: '/about' },
  { label: '서비스', href: '/services' },
  { label: '블로그', href: '/blog' },
  { label: '채용', href: '/careers' },
];

// 헤더 우측 아웃라인 버튼. 목업의 '문의하기' 자리다.
export const NAV_CTA = { label: '문의하기', href: '/contact' };

export const COMPANY = {
  name: '한국해양기상기술',
  legalName: '한국해양기상기술(주)',
  wordmark: 'KOAST',
  fullNameEn: 'Korea Oceanic & Atmospheric System Technology',
  email: 'info@koast.co.kr',
  phone: '(+82) 070 8259 3255',
  fax: '(+82) 02 6008 3334',
  address: '서울특별시 구로구 경인로53길 90',
  addressDetail: '(구로동) STX W-타워',
  social: {
    github: 'https://github.com/hwonda',
  },
};
