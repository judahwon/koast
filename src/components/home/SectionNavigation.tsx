import { useEffect, useState, type MouseEvent } from 'react';

interface SectionItem {
  id: string;
  index: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'partners', index: '1', label: 'What We Do' },
  { id: 'business', index: '2', label: 'Business Area' },
  { id: 'solutions', index: '3', label: 'Solutions' },
  { id: 'research', index: '4', label: 'Tech & Research' },
  { id: 'contact', index: '5', label: 'Contact Us' },
];

export default function SectionNavigation() {
  const [activeId, setActiveId] = useState<string>('partners');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDarkBackground, setIsDarkBackground] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const partnersEl = document.getElementById('partners');
        const footerEl = document.querySelector('footer');
        const viewportHeight = window.innerHeight;
        const headerOffset = 80;

        // 1번 What We Do(#partners) 섹션에 도달하기 전(히어로 및 Statement 영역)에서는 숨김
        if (partnersEl) {
          const partnersRect = partnersEl.getBoundingClientRect();
          if (partnersRect.top > headerOffset + 160) {
            setIsVisible(false);
            ticking = false;
            return;
          }
        }

        // 푸터 영역에 진입하면 콘텐츠 겹침 방지를 위해 숨김
        if (footerEl) {
          const footerRect = footerEl.getBoundingClientRect();
          if (footerRect.top < viewportHeight - 60) {
            setIsVisible(false);
            ticking = false;
            return;
          }
        }

        // 1~5번 섹션 영역에서는 표시
        setIsVisible(true);

        // 현재 뷰포트 기준 활성 섹션 계산
        const checkY = headerOffset + 150;
        let currentSectionId = SECTIONS[0].id;

        for (let i = 0; i < SECTIONS.length; i++) {
          const el = document.getElementById(SECTIONS[i].id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= checkY) {
              currentSectionId = SECTIONS[i].id;
            }
          }
        }

        setActiveId(currentSectionId);

        // 내비게이션 중심(50vh)이 어두운 배경 섹션(#research) 위에 위치하는지 감지
        const navCenterY = viewportHeight / 2;
        const researchEl = document.getElementById('research');
        let isDark = false;

        if (researchEl) {
          const researchRect = researchEl.getBoundingClientRect();
          if (researchRect.top <= navCenterY + 40 && researchRect.bottom >= navCenterY - 40) {
            isDark = true;
          }
        }

        setIsDarkBackground(isDark);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      history.pushState(null, '', `#${ id }`);
      setActiveId(id);
    }
  };

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeId);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  // 5개 섹션 축(0% ~ 100%) 기준 활성 진행 비율
  const progressPercent = (safeActiveIndex / (SECTIONS.length - 1)) * 100;

  return (
    <div
      className={`fixed top-1/2 left-3 z-40 hidden -translate-y-1/2 transition-all duration-500 ease-out select-none lg:flex xl:left-5 ${
        isVisible ? 'pointer-events-auto translate-x-0 opacity-100' : 'pointer-events-none -translate-x-6 opacity-0'
      }`}
    >
      <nav
        aria-label={'페이지 섹션 내비게이션'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={'group relative flex flex-col items-start rounded-2xl py-14 pr-5 pl-1 font-sans backdrop-blur-[2px] transition-all duration-300'}
      >
        {/* 세로 관측 축 기준선 & 진행선 */}
        <div
          aria-hidden={'true'}
          className={'absolute inset-y-[70px] left-[7px] flex w-1 -translate-x-1/2 justify-center'}
        >
          {/* 전체 얇은 기준선 (1px) */}
          <div
            className={`h-full w-px transition-colors duration-300 ${
              isDarkBackground ? 'bg-white/20' : 'bg-line-secondary'
            }`}
          />
          {/* 이미 읽은 진행선 (더 굵은 2.5px 선) */}
          <div
            className={`absolute top-0 w-[2.5px] rounded-full transition-all duration-300 ease-out ${
              isDarkBackground ? 'bg-white' : 'bg-content-primary'
            }`}
            style={{ height: `${ progressPercent }%` }}
          />
        </div>

        {/* 섹션 항목 목록 (1~5번 5개 항목, 세로 높이 추가 확장 gap-[135px]) */}
        <ul className={'relative flex flex-col gap-[135px]'} role={'list'}>
          {SECTIONS.map((section, index) => {
            const isActive = section.id === activeId;
            const isPassed = index < safeActiveIndex;
            const showLabel = isHovered || isActive;

            return (
              <li key={section.id} className={'flex justify-start'}>
                <a
                  href={`#${ section.id }`}
                  onClick={(e) => handleClick(e, section.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`group/item flex items-center justify-start gap-3 rounded-md py-1.5 pr-3 pl-4 transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                    isDarkBackground ? 'focus-visible:ring-white' : 'focus-visible:ring-line-primary'
                  }`}
                >
                  {/* 단일 자릿수 인덱스 번호 (1~5, Pretendard 13pt) */}
                  <span
                    className={`text-[13pt] leading-none tracking-tight tabular-nums transition-colors duration-250 ${
                      isActive
                        ? isDarkBackground
                          ? 'font-bold text-white'
                          : 'font-bold text-content-primary'
                        : isPassed
                          ? isDarkBackground
                            ? 'font-medium text-white/80 group-hover/item:text-white'
                            : 'font-medium text-content-secondary group-hover/item:text-content-primary'
                          : isDarkBackground
                            ? 'font-normal text-white/40 group-hover/item:text-white/70'
                            : 'font-normal text-content-tertiary/60 group-hover/item:text-content-secondary'
                    }`}
                  >
                    {section.index}
                  </span>

                  {/* 섹션 라벨 (호버 시 전체 확장 / 평상시 활성 섹션만 노출) */}
                  <span
                    className={`text-[10.5pt] leading-none tracking-tight whitespace-nowrap transition-all duration-300 ${
                      showLabel
                        ? 'max-w-52 translate-x-0 opacity-100'
                        : 'pointer-events-none max-w-0 -translate-x-1 overflow-hidden opacity-0'
                    } ${
                      isActive
                        ? isDarkBackground
                          ? 'font-semibold text-white'
                          : 'font-semibold text-content-primary'
                        : isPassed
                          ? isDarkBackground
                            ? 'text-white/80 group-hover/item:text-white'
                            : 'text-content-secondary group-hover/item:text-content-primary'
                          : isDarkBackground
                            ? 'text-white/40 group-hover/item:text-white/70'
                            : 'text-content-tertiary/70 group-hover/item:text-content-secondary'
                    }`}
                  >
                    {section.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
