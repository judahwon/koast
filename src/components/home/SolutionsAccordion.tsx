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
      <div className={'hidden h-[521px] gap-4 lg:flex'}>
        {solutions.map((solution) => {
          const isActive = solution.id === activeId;

          return (
            <div key={solution.id} style={{ flexGrow: isActive ? 1 : 0 }} className={'relative isolate shrink-0 basis-21 overflow-hidden rounded-lg transition-[flex-grow] duration-200 ease-out'}>
              <img src={solution.photo.src} width={solution.photo.width} height={solution.photo.height} alt={''} aria-hidden={true} className={'absolute inset-0 -z-10 size-full object-cover'} />
              <div aria-hidden={true} className={'absolute inset-0 -z-10 bg-linear-to-r from-surface-inverse-bolder/92 from-8% via-surface-inverse-bolder/66 via-45% to-surface-inverse-bolder/92'} />
              <div aria-hidden={true} className={`absolute inset-0 -z-10 bg-surface-inverse-bolder transition-opacity duration-200 ease-out ${ isActive ? 'opacity-0' : 'opacity-25' }`} />

              <button type={'button'} aria-expanded={isActive} aria-controls={`solution-panel-${ solution.id }`} onClick={() => setActiveId(solution.id)} onFocus={() => setActiveId(solution.id)} className={'absolute inset-0 flex cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-content-on-inverse'}>
                <span className={'sr-only'}>{solution.code}</span>
                <span style={{ writingMode: 'vertical-rl' }} aria-hidden={true} className={`text-base font-semibold tracking-tight whitespace-nowrap text-content-on-inverse transition-opacity duration-200 ease-out ${ isActive ? 'opacity-0' : 'opacity-100' }`}>{solution.shortName}</span>
              </button>

              <div id={`solution-panel-${ solution.id }`} className={`pointer-events-none absolute inset-y-0 left-0 flex w-full min-w-130 justify-between gap-10 p-12 transition-opacity duration-200 ease-out ${ isActive ? 'opacity-100' : 'opacity-0' }`}>
                <div className={'flex w-80 shrink-0 flex-col'}>
                  <p className={'text-sm font-semibold tracking-wide text-content-on-inverse'}>{solution.code}</p>
                  <h3 className={'mt-5 text-3xl leading-snug font-bold text-content-on-inverse'}>
                    {solution.title.map((line) => (
                      <span key={line} className={'block'}>{line}</span>
                    ))}
                  </h3>
                  <a href={`${ base }${ solution.href }`} tabIndex={isActive ? 0 : -1} className={'pointer-events-auto mt-auto inline-flex w-fit items-center gap-2.5 rounded-full bg-surface-primary/20 px-5 py-3 text-sm font-medium text-content-on-inverse backdrop-blur-sm transition-colors duration-200 ease-out hover:bg-surface-primary/30'}>
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

      <div className={'flex flex-col gap-4 lg:hidden'}>
        {solutions.map((solution) => (
          <article key={solution.id} className={'relative isolate overflow-hidden rounded-lg'}>
            <img src={solution.photo.src} width={solution.photo.width} height={solution.photo.height} alt={''} aria-hidden={true} className={'absolute inset-0 -z-10 size-full object-cover'} />
            <div aria-hidden={true} className={'absolute inset-0 -z-10 bg-linear-to-b from-surface-inverse-bolder/78 to-surface-inverse-bolder/90'} />

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
