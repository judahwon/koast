import { ContourBackground } from 'contour-field/react';

interface HeroContourProps {
  className?: string;
}

export default function HeroContour({ className = '' }: HeroContourProps) {
  return (
    <div
      aria-hidden={'true'}
      className={`pointer-events-none absolute inset-0 z-0 size-full overflow-hidden select-none ${ className }`}
    >
      {/* 1. 세부 고밀도 좌표 격자 그리드 (Fine Sub-grid, 32px) - 은은한 서브 레이어로 톤다운 */}
      <div
        className={'pointer-events-none absolute inset-0 z-0 size-full opacity-20'}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(224, 242, 254, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(224, 242, 254, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 45%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 45%, transparent 100%)',
        }}
      />

      {/* 2. 주요 GIS 기준 좌표선 그리드 (Major Grid, 128px) - 은은한 서브 레이어로 톤다운 */}
      <div
        className={'pointer-events-none absolute inset-0 z-0 size-full opacity-25'}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(224, 242, 254, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(224, 242, 254, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '128px 128px',
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)',
        }}
      />

      <style>
        {`
        @keyframes contourDiagonalDrift {
          0% {
            transform: translate(calc(-50% - 32px), calc(-50% - 22px)) scale(1.08);
          }
          50% {
            transform: translate(calc(-50% + 32px), calc(-50% + 22px)) scale(1.08);
          }
          100% {
            transform: translate(calc(-50% - 32px), calc(-50% - 22px)) scale(1.08);
          }
        }

        .contour-drift-layer {
          animation: contourDiagonalDrift 24s ease-in-out infinite;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .contour-drift-layer {
            animation: none !important;
          }
        }
        `}
      </style>

      {/* 3. 고선명 등고선 레이어 (존재감 강화) */}
      <ContourBackground
        className={'contour-drift-layer'}
        color={'rgba(224, 242, 254, 0.90)'}
        opacity={0.46}
        numLevels={42}
        indexContourEvery={5}
        levelRange={[0.03, 0.97]}
        opacityRange={[0.35, 0.95]}
        strokeWidths={{ line: 0.70, index: 1.30 }}
        viewW={1920}
        viewH={1080}
        cols={180}
        rows={100}
        hills={[
          { cx: 280, cy: 180, sx: 240, sy: 170, theta: 0.35, amp: 1.25 },
          { cx: 780, cy: 150, sx: 220, sy: 160, theta: -0.25, amp: 1.15 },
          { cx: 1220, cy: 140, sx: 250, sy: 170, theta: 0.45, amp: 1.2 },
          { cx: 1720, cy: 160, sx: 230, sy: 160, theta: -0.3, amp: 1.15 },
          { cx: 120, cy: 520, sx: 220, sy: 160, theta: 0.5, amp: 1.1 },
          { cx: 560, cy: 480, sx: 260, sy: 180, theta: -0.4, amp: 1.2 },
          { cx: 1020, cy: 540, sx: 250, sy: 180, theta: 0.65, amp: 1.2 },
          { cx: 1460, cy: 460, sx: 260, sy: 190, theta: -0.5, amp: 1.25 },
          { cx: 1840, cy: 560, sx: 210, sy: 150, theta: 0.3, amp: 1.05 },
          { cx: 340, cy: 880, sx: 260, sy: 190, theta: -0.35, amp: 1.2 },
          { cx: 800, cy: 890, sx: 240, sy: 170, theta: 0.4, amp: 1.15 },
          { cx: 1280, cy: 860, sx: 270, sy: 190, theta: -0.2, amp: 1.2 },
          { cx: 1680, cy: 870, sx: 250, sy: 180, theta: 0.35, amp: 1.25 },
        ]}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'max(100%, 177.78vh)',
          height: 'max(100%, 56.25vw)',
          aspectRatio: '1920 / 1080',
          zIndex: 0,
        }}
      />
    </div>
  );
}
