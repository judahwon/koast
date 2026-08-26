import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  links: NavLink[];
  base: string;
}

export default function Navigation({ links, base }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  function resolveHref(href: string) {
    if (href === '/') return base || '/';
    return `${ base }${ href }`;
  }

  return (
    <div className={'flex items-center gap-6'}>
      {/* Desktop nav */}
      <nav className={'hidden items-center gap-6 md:flex'}>
        {links.map((link) => (
          <a
            key={link.href}
            href={resolveHref(link.href)}
            className={'text-sm font-medium text-content-tertiary transition-colors hover:text-content-interactive-primary-hovered'}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className={'rounded-lg p-2 transition-colors hover:bg-interactive-secondary-hovered'}
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={'rounded-lg p-2 transition-colors hover:bg-interactive-secondary-hovered md:hidden'}
        aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <nav className={'absolute inset-x-0 top-full border-b border-line-secondary bg-surface-primary md:hidden'}>
          <div className={'flex flex-col gap-3 px-6 py-4'}>
            {links.map((link) => (
              <a
                key={link.href}
                href={resolveHref(link.href)}
                className={'py-2 text-sm font-medium text-content-tertiary transition-colors hover:text-content-interactive-primary-hovered'}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
