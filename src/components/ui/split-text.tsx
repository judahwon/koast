import React from 'react';

interface SplitTextProps {
  text?: string;
  lines?: string[];
  className?: string;
  charClassName?: string;
  delay?: number; // initial delay in ms
  stagger?: number; // stagger per character in ms
  duration?: number; // animation duration in ms
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export default function SplitText({
  text,
  lines,
  className = '',
  charClassName = '',
  delay = 200,
  stagger = 35,
  duration = 850,
  as: Component = 'h1',
}: SplitTextProps) {
  const contentLines = lines ?? (text ? [text] : []);
  const fullText = contentLines.join(' ');

  let globalCharIndex = 0;

  return (
    <Component className={`relative ${ className }`} aria-label={fullText}>
      {contentLines.map((line, lineIdx) => {
        const words = line.split(' ');

        return (
          <React.Fragment key={lineIdx}>
            <span className={'inline-block'}>
              {words.map((word, wordIdx) => {
                const chars = Array.from(word);

                return (
                  <span key={wordIdx} className={'inline-block whitespace-nowrap'}>
                    {chars.map((char, charIdx) => {
                      const currentIndex = globalCharIndex++;
                      const charDelay = delay + (currentIndex * stagger);

                      return (
                        <span
                          key={charIdx}
                          aria-hidden={true}
                          style={{
                            animationDuration: `${ duration }ms`,
                            animationDelay: `${ charDelay }ms`,
                          }}
                          className={`split-char ${ charClassName }`}
                        >
                          {char}
                        </span>
                      );
                    })}
                    {/* Preserve space between words */}
                    {wordIdx < words.length - 1 && (
                      <span aria-hidden={true} className={'inline-block'}>
                        {'\u00A0'}
                      </span>
                    )}
                  </span>
                );
              })}
            </span>
            {lineIdx < contentLines.length - 1 && (
              <br className={'hidden sm:inline'} />
            )}
            {lineIdx < contentLines.length - 1 && (
              <span className={'inline sm:hidden'}>
                {'\u00A0'}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </Component>
  );
}
