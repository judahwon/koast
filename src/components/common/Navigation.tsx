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
}

export default function Navigation({ links, cta, base }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function resolveHref(href: string) {
    if (href === '/') return base || '/';
    return `${ base }${ href }`;
  }

  return (
    <div className={'flex items-center gap-8'}>
      <nav className={'hidden items-center gap-8 md:flex'}>
        {links.map((link) => (
          <a
            key={link.href}
            href={resolveHref(link.href)}
            className={'text-sm font-medium text-content-secondary transition-colors hover:text-content-brand'}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href={resolveHref(cta.href)}
        className={'hidden rounded-lg border border-line-info px-4 py-2 text-sm font-semibold text-content-brand transition-colors hover:bg-interactive-selected md:inline-flex'}
      >
        {cta.label}
      </a>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={'-mr-2 rounded-lg p-2 text-content-primary transition-colors hover:bg-interactive-secondary-hovered md:hidden'}
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <nav className={'absolute inset-x-0 top-full border-b border-line-secondary bg-surface-primary shadow-sm md:hidden'}>
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
