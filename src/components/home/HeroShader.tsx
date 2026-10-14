import { MeshGradient } from '@paper-design/shaders-react';

interface HeroShaderProps {
  className?: string;
  speed?: number;
  distortion?: number;
  swirl?: number;
  colors?: string[];
}

export default function HeroShader({
  className = '',
  speed = 0.8,
  distortion = 0.8,
  swirl = 0.1,
  colors = [
    'hsl(216, 90%, 27%)',
    'hsl(243, 68%, 36%)',
    'hsl(205, 91%, 64%)',
    'hsl(211, 61%, 57%)',
  ],
}: HeroShaderProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-20 size-full overflow-hidden ${ className }`}>
      <MeshGradient
        style={{ height: '100%', width: '100%' }}
        distortion={distortion}
        swirl={swirl}
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={speed}
        colors={colors}
      />
    </div>
  );
}
