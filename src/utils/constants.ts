const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

export const SITE = {
  name: '한국해양기상기술',
  url: 'https://judahwon.github.io',
  base: BASE_PATH,
  description:
    '해양·기상 데이터를 수집하고, 예측하고, 시각화하는 통합 기술기업',
  locale: 'ko_KR',
  ogImage: `${ BASE_PATH }/images/og-image.png`,
};

export const NAV_LINKS = [
  { label: '홈', href: '/' },
  { label: '회사소개', href: '/about' },
  { label: '서비스', href: '/services' },
  { label: '블로그', href: '/blog' },
  { label: '채용', href: '/careers' },
  { label: '문의', href: '/contact' },
];

export const COMPANY = {
  name: '한국해양기상기술',
  email: '',
  phone: '',
  address: '',
  fax: '',
  social: {
    github: 'https://github.com/hwonda',
  },
};
