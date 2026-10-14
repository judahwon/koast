import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  links: NavLink[];
  cta: NavLink;
  base: string;
  darkTop?: boolean;
}

export default function Navigation({ links, cta, base, darkTop = true }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function resolveHref(href: string) {
    if (href === '/') return base || '/';
    return `${ base }${ href }`;
  }

  const linkClass = darkTop
    ? 'text-sm font-medium text-white/90 transition-colors duration-300 hover:text-white group-[.is-scrolled]:text-content-secondary group-[.is-scrolled]:hover:text-content-brand'
    : 'text-sm font-medium text-content-secondary transition-colors duration-300 hover:text-content-brand';

  const ctaClass = darkTop
    ? 'hidden rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 group-[.is-scrolled]:border-line-info group-[.is-scrolled]:text-content-brand group-[.is-scrolled]:hover:bg-interactive-selected md:inline-flex'
    : 'hidden rounded-lg border border-line-info px-4 py-2 text-sm font-semibold text-content-brand transition-colors duration-300 hover:bg-interactive-selected md:inline-flex';

  const menuButtonClass = darkTop
    ? '-mr-2 rounded-lg p-2 text-white transition-colors duration-300 hover:bg-white/10 group-[.is-scrolled]:text-content-primary group-[.is-scrolled]:hover:bg-interactive-secondary-hovered md:hidden'
    : '-mr-2 rounded-lg p-2 text-content-primary transition-colors duration-300 hover:bg-interactive-secondary-hovered md:hidden';

  return (
    <div className={'flex items-center gap-8'}>
      <nav className={'hidden items-center gap-8 md:flex'}>
        {links.map((link) => (
          <a
            key={link.href}
            href={resolveHref(link.href)}
            className={linkClass}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href={resolveHref(cta.href)}
        className={ctaClass}
      >
        {cta.label}
      </a>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={menuButtonClass}
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <nav className={'absolute inset-x-0 top-full border-b border-line-secondary bg-surface-primary shadow-md md:hidden'}>
          <div className={'flex flex-col gap-1 px-6 py-4'}>
            {links.map((link) => (
              <a
                key={link.href}
                href={resolveHref(link.href)}
                className={'py-2.5 text-sm font-medium text-content-secondary transition-colors hover:text-content-brand'}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href={resolveHref(cta.href)}
              className={'mt-2 rounded-lg border border-line-info px-4 py-2.5 text-center text-sm font-semibold text-content-brand'}
              onClick={() => setIsOpen(false)}
            >
              {cta.label}
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}

