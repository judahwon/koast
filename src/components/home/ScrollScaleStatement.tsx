import { useEffect, useRef } from 'react';

export interface FloatingCardItem {
  id: string;
  image: string;
  alt: string;
  side: 'left' | 'right';
  xPercent: number; // % of viewport width from center (-40 to 40)
  baseYPercent: number; // % of viewport height base coordinate (-40 to 60)
  scrollSpeedMultiplier?: number; // Parallax speed multiplier
}

interface Props {
  mainImageSrc: string;
  mainImageWidth?: number;
  mainImageHeight?: number;
  leftCards?: FloatingCardItem[];
  rightCards?: FloatingCardItem[];
}

const STATEMENT_LINES = [
  ['바다와', '대기는', '끊임없이', '변화합니다.'],
  ['우리는', '관측과', '예측,', '분석과', '시각화', '기술을', '통해'],
  ['그', '변화', '속에서', '필요한', '정보를', '발견합니다.'],
];

const STATEMENT_WORDS_FLAT = STATEMENT_LINES.flat();

export default function ScrollScaleStatement({
  mainImageSrc,
  mainImageWidth,
  mainImageHeight,
  leftCards = [],
  rightCards = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardWrapperRef = useRef<HTMLDivElement>(null);
  const mainCardBoxRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text1Line1Ref = useRef<HTMLSpanElement>(null);
  const text1Line1DimRef = useRef<HTMLSpanElement>(null);
  const text1Line1HighRef = useRef<HTMLSpanElement>(null);
  const text1Line2Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const wordElementsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const leftCardElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightCardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    let currentProgress = 0;
    let targetProgress = 0;

    const computeTarget = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalScrollable = rect.height - viewportHeight;

      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      targetProgress = Math.min(Math.max(currentScroll / totalScrollable, 0), 1);
    };

    const loop = () => {
      // Smooth inertial interpolation (lerp)
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * 0.12;
      } else {
        currentProgress = targetProgress;
      }

      const p = currentProgress;

      // Responsive breakpoints for card scaling
      const width = window.innerWidth;
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      const startScale = 1.0;
      const midScale = isMobile ? 0.88 : isTablet ? 0.78 : 0.68;
      const finalScale = isMobile ? 0.76 : isTablet ? 0.58 : 0.44;
      const finalTranslateY = isMobile ? -11.5 : isTablet ? -12.5 : -12.5;
      const halfHeightVh = isMobile ? 12 : 26;
      const text2FinalY = isMobile ? 9.5 : 11.5;

      let cardScale: number;
      let cardTranslateYVh: number;
      let cardBottomVh: number;

      // Target visual corner radius (24px matching rounded-3xl of side floating cards)
      const visualRadiusPx = 24;

      // --- 1. Main Center Card Animation ---
      if (p < 0.28) {
        // Phase 1: Smoothly shrink from large wide box to medium card
        const phase1 = p / 0.28;
        cardScale = startScale - (phase1 * (startScale - midScale));
        cardTranslateYVh = 0;
        cardBottomVh = cardScale * halfHeightVh;

        if (mainCardBoxRef.current) {
          const r = (visualRadiusPx / cardScale).toFixed(1);
          mainCardBoxRef.current.style.clipPath = `inset(0% 0% 0% 0% round ${ r }px)`;
        }
      } else if (p < 0.48) {
        // Phase 2: Crop left/right into a square and float to upper center
        const phase2 = (p - 0.28) / 0.20;
        const p2Ease = Math.pow(phase2, 1.25);

        cardScale = midScale - (p2Ease * (midScale - finalScale));
        cardTranslateYVh = p2Ease * finalTranslateY;
        cardBottomVh = cardTranslateYVh + (cardScale * halfHeightVh);

        if (mainCardBoxRef.current) {
          const insetX = (p2Ease * 21.88).toFixed(2);
          const r = (visualRadiusPx / cardScale).toFixed(1);
          mainCardBoxRef.current.style.clipPath = `inset(0% ${ insetX }% 0% ${ insetX }% round ${ r }px)`;
        }
      } else {
        // Phase 3: Top square card stays locked at upper center
        cardScale = finalScale;
        cardTranslateYVh = finalTranslateY;
        cardBottomVh = finalTranslateY + (finalScale * halfHeightVh);

        if (mainCardBoxRef.current) {
          const r = (visualRadiusPx / cardScale).toFixed(1);
          mainCardBoxRef.current.style.clipPath = `inset(0% 21.88% 0% 21.88% round ${ r }px)`;
        }
      }

      if (mainCardWrapperRef.current) {
        mainCardWrapperRef.current.style.transform = `translate3d(0, ${ cardTranslateYVh.toFixed(2) }vh, 0) scale(${ cardScale.toFixed(4) })`;
      }

      // --- 2. Text 1 ("보이지 않는 변화" 40% + "를" 100% -> "데이터로 읽습니다." 100%) ---
      // Line 1 in (p=0.02 ~ 0.08), Line 2 in (p=0.08 ~ 0.15)
      // Generous reading dwell window (p=0.15 ~ 0.28), smooth fade out (p=0.28 ~ 0.35)
      if (text1Ref.current) {
        const t1Line1In = Math.min(Math.max((p - 0.02) / 0.06, 0), 1);
        const t1Line2In = Math.min(Math.max((p - 0.08) / 0.07, 0), 1);
        const t1Out = Math.min(Math.max((p - 0.28) / 0.07, 0), 1);

        const l1InEase = Math.pow(t1Line1In, 2);
        const l2InEase = Math.pow(t1Line2In, 2);
        const outEase = Math.pow(t1Out, 1.8);

        // "보이지 않는 변화" -> max 40% (0.40)
        const l1DimOpacity = l1InEase * (1 - outEase) * 0.40;
        // "를" & "데이터로 읽습니다." -> max 100% (1.00)
        const l1HighOpacity = l1InEase * (1 - outEase);
        const l2Opacity = l2InEase * (1 - outEase);

        const l1OffsetY = (1 - l1InEase) * 14;
        const l2OffsetY = (1 - l2InEase) * 14;

        const t1YVh = cardBottomVh + (isMobile ? 6 : 8.5);

        text1Ref.current.style.transform = `translate3d(0, ${ t1YVh.toFixed(2) }vh, 0)`;
        text1Ref.current.style.pointerEvents = (l1HighOpacity > 0.05 || l2Opacity > 0.05) ? 'auto' : 'none';

        if (text1Line1Ref.current) {
          text1Line1Ref.current.style.transform = `translate3d(0, ${ l1OffsetY.toFixed(2) }px, 0)`;
        }
        if (text1Line1DimRef.current) {
          text1Line1DimRef.current.style.opacity = l1DimOpacity.toFixed(4);
        }
        if (text1Line1HighRef.current) {
          text1Line1HighRef.current.style.opacity = l1HighOpacity.toFixed(4);
        }
        if (text1Line2Ref.current) {
          text1Line2Ref.current.style.opacity = l2Opacity.toFixed(4);
          text1Line2Ref.current.style.transform = `translate3d(0, ${ l2OffsetY.toFixed(2) }px, 0)`;
        }
      }

      // --- 3. Text 2 (Narrative Manifesto Statement) ---
      // ONLY begins to appear at p=0.50 AFTER the image has ALREADY reached its final top position (p=0.48)
      if (text2Ref.current) {
        if (p < 0.50) {
          text2Ref.current.style.opacity = '0';
          text2Ref.current.style.transform = `translate3d(0, ${ (text2FinalY + 3.5).toFixed(2) }vh, 0)`;
          text2Ref.current.style.pointerEvents = 'none';
        } else if (p < 0.58) {
          const t2Progress = (p - 0.50) / 0.08;
          const t2Ease = Math.pow(t2Progress, 1.5);
          const t2TranslateY = ((1 - t2Ease) * 3.5) + text2FinalY;

          text2Ref.current.style.opacity = t2Ease.toFixed(4);
          text2Ref.current.style.transform = `translate3d(0, ${ t2TranslateY.toFixed(2) }vh, 0)`;
          text2Ref.current.style.pointerEvents = t2Ease > 0.1 ? 'auto' : 'none';
        } else {
          // Phase 3: Pinned strictly at text2FinalY
          text2Ref.current.style.opacity = '1';
          text2Ref.current.style.transform = `translate3d(0, ${ text2FinalY.toFixed(2) }vh, 0)`;
          text2Ref.current.style.pointerEvents = 'auto';
        }
      }

      // --- Word-by-Word Scroll Highlight Animation (Reference Style) ---
      const totalWords = STATEMENT_WORDS_FLAT.length;
      const highlightStart = 0.58;
      const highlightEnd = 0.88;

      STATEMENT_WORDS_FLAT.forEach((_, i) => {
        const el = wordElementsRef.current[i];
        if (!el) return;

        const wordStart = highlightStart + ((i / totalWords) * (highlightEnd - highlightStart));
        const wordDuration = ((highlightEnd - highlightStart) / totalWords) * 1.5;
        const wordProgress = Math.min(Math.max((p - wordStart) / wordDuration, 0), 1);
        const wordOpacity = 0.22 + (wordProgress * 0.78); // 0.22 (dimmed) -> 1.0 (illuminated bold)

        el.style.opacity = wordOpacity.toFixed(4);
      });

      // --- 4. Left & Right Floating Columns (5 cards each) ---
      // When Text 1 begins to ease out (p >= 0.28), Card 1 starts rising from the bottom of the screen
      let currentScrollOffsetY: number;
      if (p < 0.28) {
        currentScrollOffsetY = 85;
      } else if (p < 0.58) {
        const p2 = (p - 0.28) / 0.30;
        currentScrollOffsetY = (1 - p2) * 85;
      } else {
        const p3 = (p - 0.58) / 0.42;
        currentScrollOffsetY = -p3 * 75;
      }

      // Left Cards (5 items)
      leftCards.forEach((card, index) => {
        const el = leftCardElementsRef.current[index];
        if (!el) return;

        const currentX = card.xPercent; // Fixed X track (no lateral drift)
        const currentY = card.baseYPercent + currentScrollOffsetY;

        // Smooth edge fade near top & bottom viewport bounds
        const edgeFade = Math.min(Math.max(1 - ((Math.abs(currentY) - 38) / 14), 0), 1);

        el.style.opacity = edgeFade.toFixed(4);
        el.style.transform = `translate3d(${ currentX.toFixed(2) }vw, ${ currentY.toFixed(2) }vh, 0)`;
      });

      // Right Cards (5 items)
      rightCards.forEach((card, index) => {
        const el = rightCardElementsRef.current[index];
        if (!el) return;

        const currentX = card.xPercent; // Fixed X track (no lateral drift)
        const currentY = card.baseYPercent + currentScrollOffsetY;

        // Smooth edge fade near top & bottom viewport bounds
        const edgeFade = Math.min(Math.max(1 - ((Math.abs(currentY) - 38) / 14), 0), 1);

        el.style.opacity = edgeFade.toFixed(4);
        el.style.transform = `translate3d(${ currentX.toFixed(2) }vw, ${ currentY.toFixed(2) }vh, 0)`;
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    computeTarget();
    currentProgress = targetProgress;
    animationFrameId = requestAnimationFrame(loop);

    const onScroll = () => {
      computeTarget();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [leftCards, rightCards]);

  return (
    <div ref={containerRef} className={'relative h-[580vh] w-full bg-surface-primary'}>
      <div className={'sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6 sm:px-12 md:px-16 lg:px-20'}>
        {/* Central Stage Container */}
        <div className={'relative flex size-full items-center justify-center'}>
          {/* Main Top/Center Card (Undistorted Image with Smooth Left/Right Mask Inset) */}
          <div
            ref={mainCardWrapperRef}
            style={{
              transform: 'scale(1)',
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
            className={'absolute z-20 flex w-full max-w-4xl items-center justify-center sm:max-w-5xl lg:max-w-5xl'}
          >
            <div
              ref={mainCardBoxRef}
              style={{
                clipPath: 'inset(0% 0% 0% 0% round 24px)',
                willChange: 'clip-path',
              }}
              className={'relative aspect-video w-full overflow-hidden rounded-3xl bg-surface-subtle'}
            >
              <img
                src={mainImageSrc}
                width={mainImageWidth}
                height={mainImageHeight}
                alt={'KOAST 해양·기상 기술'}
                loading={'lazy'}
                className={'size-full object-cover select-none'}
              />
            </div>
          </div>

          {/* Text 1: "보이지 않는 변화를 데이터로 읽습니다." (Staggered 2-line appearance) */}
          <div
            ref={text1Ref}
            style={{
              transform: 'translate3d(0, 34.5vh, 0)',
              willChange: 'transform',
            }}
            className={'absolute z-30 max-w-3xl px-6 text-center'}
          >
            <h2 className={'flex flex-col items-center gap-2.5 text-2xl font-bold tracking-tight text-content-primary sm:gap-4 sm:text-4xl lg:gap-5 lg:text-5xl'}>
              <span
                ref={text1Line1Ref}
                style={{
                  transform: 'translate3d(0, 14px, 0)',
                  willChange: 'transform',
                }}
                className={'block'}
              >
                <span
                  ref={text1Line1DimRef}
                  style={{
                    opacity: 0,
                    willChange: 'opacity',
                  }}
                >
                  {'보이지 않는 변화'}
                </span>
                <span
                  ref={text1Line1HighRef}
                  style={{
                    opacity: 0,
                    willChange: 'opacity',
                  }}
                >
                  {'를'}
                </span>
              </span>
              <span
                ref={text1Line2Ref}
                style={{
                  opacity: 0,
                  transform: 'translate3d(0, 14px, 0)',
                  willChange: 'opacity, transform',
                }}
                className={'block'}
              >
                {'데이터로 읽습니다.'}
              </span>
            </h2>
          </div>

          {/* Left Column Floating Cards (5 items) */}
          <div className={'pointer-events-none absolute inset-0 z-10 hidden items-center justify-center lg:flex'}>
            {leftCards.map((card, index) => (
              <div
                key={card.id}
                ref={(el) => {
                  leftCardElementsRef.current[index] = el;
                }}
                style={{
                  opacity: 0,
                  transform: 'translate3d(0, 0, 0)',
                  willChange: 'opacity, transform',
                }}
                className={'absolute flex size-[220px] shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-surface-card'}
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  loading={'lazy'}
                  className={'size-full object-cover select-none'}
                />
              </div>
            ))}
          </div>

          {/* Right Column Floating Cards (5 items) */}
          <div className={'pointer-events-none absolute inset-0 z-10 hidden items-center justify-center lg:flex'}>
            {rightCards.map((card, index) => (
              <div
                key={card.id}
                ref={(el) => {
                  rightCardElementsRef.current[index] = el;
                }}
                style={{
                  opacity: 0,
                  transform: 'translate3d(0, 0, 0)',
                  willChange: 'opacity, transform',
                }}
                className={'absolute flex size-[220px] shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-surface-card'}
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  loading={'lazy'}
                  className={'size-full object-cover select-none'}
                />
              </div>
            ))}
          </div>

          {/* Text 2: Second Narrative Manifesto Statement strictly locked in the CENTER (Word Highlight Animation) */}
          <div
            ref={text2Ref}
            style={{
              opacity: 0,
              transform: 'translate3d(0, 11.5vh, 0)',
              willChange: 'opacity, transform',
            }}
            className={'absolute z-30 flex max-w-4xl flex-col items-center justify-center px-6 text-center sm:px-10'}
          >
            <p className={'text-xl leading-relaxed font-bold tracking-tight text-content-primary sm:text-3xl sm:leading-relaxed lg:text-4xl lg:leading-relaxed'}>
              {STATEMENT_LINES.map((line, lineIdx) => {
                const wordsBeforeThisLine = STATEMENT_LINES.slice(0, lineIdx).reduce((acc, l) => acc + l.length, 0);

                return (
                  <span key={lineIdx} className={'block'}>
                    {line.map((word, wordIdx) => {
                      const globalIndex = wordsBeforeThisLine + wordIdx;

                      return (
                        <span
                          key={wordIdx}
                          ref={(el) => {
                            wordElementsRef.current[globalIndex] = el;
                          }}
                          style={{
                            opacity: 0.22,
                            willChange: 'opacity',
                          }}
                          className={'inline-block transition-opacity duration-75'}
                        >
                          {word}
                          {wordIdx < line.length - 1 && '\u00A0'}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </p>
            <p className={'mt-4 text-xs font-semibold tracking-wider text-content-tertiary sm:mt-6 sm:text-sm'}>
              {'Precision Data & AI Technology for Safe Future'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
