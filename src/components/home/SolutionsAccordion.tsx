import { useState } from 'react';

import type { Solution } from '@/data/home';

interface Props {
  solutions: Solution[];
  base: string;
}

function ArrowIcon() {
  return (
    <svg viewBox={'0 0 20 20'} fill={'none'} stroke={'currentColor'} strokeWidth={1.6} strokeLinecap={'round'} strokeLinejoin={'round'} aria-hidden={true} className={'size-4'}>
      <path d={'M4 10h11m0 0-4-4m4 4-4 4'} />
    </svg>
  );
}

export default function SolutionsAccordion({ solutions, base }: Props) {
  const [activeId, setActiveId] = useState(solutions.at(-1)?.id ?? '');

  return (
    <div className={'mx-auto w-full max-w-415'}>
      {/* Desktop Layout with Interactive Image Accordion Animation */}
      <div className={'hidden h-130 gap-4 lg:flex'}>
        {solutions.map((solution) => {
          const isActive = solution.id === activeId;

          return (
            <div
              key={solution.id}
              role={'button'}
              tabIndex={0}
              aria-expanded={isActive}
              aria-controls={`solution-panel-${ solution.id }`}
              style={{ flexGrow: isActive ? 1 : 0 }}
              onClick={() => setActiveId(solution.id)}
              onMouseEnter={() => setActiveId(solution.id)}
              onFocus={() => setActiveId(solution.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveId(solution.id);
                }
              }}
              className={`group relative isolate shrink-0 basis-20 cursor-pointer overflow-hidden rounded-2xl transition-all duration-700 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus-ring ${
                isActive ? 'basis-40' : 'basis-20 hover:basis-24'
              }`}
            >
              {/* Background Photo with smooth scale transition */}
              <img
                src={solution.photo.src}
                width={solution.photo.width}
                height={solution.photo.height}
                alt={''}
                aria-hidden={true}
                className={`absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 ease-in-out ${
                  isActive ? 'scale-100' : 'scale-110 brightness-90 group-hover:scale-105'
                }`}
              />

              {/* Scrim / Gradient overlays */}
              <div aria-hidden={true} className={'solution-scrim absolute inset-0 -z-10'} />
              <div
                aria-hidden={true}
                className={`absolute inset-0 -z-10 bg-surface-inverse-bolder transition-opacity duration-700 ease-in-out ${
                  isActive ? 'opacity-0' : 'opacity-40 group-hover:opacity-25'
                }`}
              />

              {/* Inactive Vertical Caption */}
              <div
                className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                  isActive ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                }`}
              >
                <span className={'sr-only'}>{solution.code}</span>
                <span
                  style={{ writingMode: 'vertical-rl' }}
                  aria-hidden={true}
                  className={'text-base font-semibold tracking-tight whitespace-nowrap text-content-on-inverse drop-shadow-md'}
                >
                  {solution.shortName}
                </span>
              </div>

              {/* Active Panel Content */}
              <div
                id={`solution-panel-${ solution.id }`}
                className={`pointer-events-none absolute inset-y-0 left-0 flex w-full min-w-130 justify-between gap-10 p-12 transition-all duration-700 ease-in-out ${
                  isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}
              >
                <div className={'flex w-80 shrink-0 flex-col'}>
                  <p className={'text-sm font-semibold tracking-wide text-content-on-inverse'}>{solution.code}</p>
                  <h3 className={'mt-5 text-3xl leading-snug font-bold text-content-on-inverse'}>
                    {solution.title.map((line) => (
                      <span key={line} className={'block'}>{line}</span>
                    ))}
                  </h3>
                  <a
                    href={`${ base }${ solution.href }`}
                    tabIndex={isActive ? 0 : -1}
                    className={'pointer-events-auto mt-auto inline-flex w-fit items-center gap-2.5 rounded-full bg-surface-primary/20 px-5 py-3 text-sm font-medium text-content-on-inverse backdrop-blur-sm transition-colors duration-200 ease-out hover:bg-surface-primary/30'}
                  >
                    {'더보기'}
                    <ArrowIcon />
                  </a>
                </div>

                <div className={'hidden w-100 shrink-0 flex-col justify-center xl:flex'}>
                  {solution.features.map((feature, index) => (
                    <div key={feature.title} className={index > 0 ? 'mt-7 border-t border-content-on-inverse/25 pt-7' : ''}>
                      <h4 className={'text-base font-bold text-content-on-inverse'}>{feature.title}</h4>
                      <p className={'mt-3 text-sm leading-relaxed text-content-on-inverse-secondary'}>{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Accordion */}
      <div className={'flex flex-col gap-4 lg:hidden'}>
        {solutions.map((solution) => (
          <article
            key={solution.id}
            className={'relative isolate overflow-hidden rounded-2xl'}
          >
            <img src={solution.photo.src} width={solution.photo.width} height={solution.photo.height} alt={''} aria-hidden={true} className={'absolute inset-0 -z-10 size-full object-cover'} />
            <div aria-hidden={true} className={'absolute inset-0 -z-10 bg-linear-to-b from-surface-inverse-bolder/70 to-surface-inverse-bolder/86'} />

            <div className={'p-7 sm:p-9'}>
              <p className={'text-xs font-semibold tracking-wide text-content-on-inverse'}>{solution.code}</p>
              <h3 className={'mt-3 text-2xl leading-snug font-bold text-content-on-inverse'}>
                {solution.title.map((line) => (
                  <span key={line} className={'block'}>{line}</span>
                ))}
              </h3>
              <ul className={'mt-6 flex flex-col gap-5'}>
                {solution.features.map((feature) => (
                  <li key={feature.title} className={'border-t border-content-on-inverse/25 pt-5'}>
                    <p className={'text-sm font-bold text-content-on-inverse'}>{feature.title}</p>
                    <p className={'mt-2 text-sm leading-relaxed text-content-on-inverse-secondary'}>{feature.description}</p>
                  </li>
                ))}
              </ul>
              <a href={`${ base }${ solution.href }`} className={'mt-7 inline-flex w-fit items-center gap-2.5 rounded-full bg-surface-primary/20 px-5 py-3 text-sm font-medium text-content-on-inverse transition-colors duration-200 ease-out hover:bg-surface-primary/30'}>
                {'더보기'}
                <ArrowIcon />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
