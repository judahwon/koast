import React from 'react';
import { cn } from '@/lib/utils';

export interface FlippingCardProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

export function FlippingCard({
  className,
  frontContent,
  backContent,
  height = 357,
  width = '100%',
}: FlippingCardProps) {
  const heightStyle = typeof height === 'number' ? `${ height }px` : height;
  const widthStyle = typeof width === 'number' ? `${ width }px` : width;

  return (
    <div
      className={'group/flipping-card w-full perspective-[1000px]'}
      style={
        {
          '--height': heightStyle,
          '--width': widthStyle,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          'relative w-full rounded-2xl border border-line-secondary bg-white shadow-xs transition-all duration-700 transform-3d group-hover/flipping-card:transform-[rotateY(180deg)]',
          'h-(--height)',
          className,
        )}
      >
        {/* Front Face */}
        <div className={'absolute inset-0 size-full transform-[rotateY(0deg)] rounded-[inherit] bg-white text-content-primary backface-hidden transform-3d'}>
          <div className={'size-full transform-[translateZ(40px)_scale(.96)]'}>
            {frontContent}
          </div>
        </div>
        {/* Back Face */}
        <div className={'absolute inset-0 size-full transform-[rotateY(180deg)] rounded-[inherit] bg-white text-content-primary backface-hidden transform-3d'}>
          <div className={'size-full transform-[translateZ(40px)_scale(.96)]'}>
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}
